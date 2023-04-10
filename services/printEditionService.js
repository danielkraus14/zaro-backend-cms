const PrintEdition = require("../models/printEdition");
const Tag = require("../models/tag");
const File = require("../models/file");
const User = require("../models/user");

const { deleteFile } = require('../services/fileService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
};

const getPrintEditions = async () => {
    let result;
    try {
        await PrintEdition.paginate({}, paginateOptions, function (err, res) {
            if (err) {
                throw err;
            }
            result = res;
        })
    } catch (error) {
        throw error;
    }
    return result;
};

const getPrintEditionsByDate = async (date) => {
    let result;
    try {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        await PrintEdition.paginate({ date: { $gte: start, $lte: end } }, paginateOptions, function (err, res) {
            if (err) {
                throw err;
            }
            result = res;
        })
    } catch (error) {
        throw error;
    }
    return result;
};

const createPrintEdition = async (
    date,
    frontPageId,
    newsletterPDFId,
    body,
    tags,
    userId
) => {
    let result;
    try {
        const printEdition = new PrintEdition({
            date,
            frontPage: frontPageId,
            newsletterPDF: newsletterPDFId,
            body,
            createdBy: userId
        });
        if (tags) {
            tags.map(async (tag) => {
                const tagFound = await Tag.findOne({ name: tag });
                if (!tagFound) {
                    const newTag = new Tag({ name: tag });
                    newTag.printEditions.push(printEdition._id);
                    await newTag.save();
                    printEdition.tags.push(newTag.name);
                } else {
                    printEdition.tags.push(tagFound.name);
                    tagFound.printEditions.push(printEdition._id);
                }
            });
        };
        if (frontPageId) {
            const file = await File.findById(frontPageId);
            if (!file) throw new Error("File not found");
            file.printEditionFP = printEdition._id;
            await file.save();
        };
        if (newsletterPDFId) {
            const file = await File.findById(newsletterPDFId);
            if (!file) throw new Error("File not found");
            file.printEditionPDF = printEdition._id;
            await file.save();
        };
        result = await printEdition.save();
    } catch (error) {
        throw error;
    };
    return result;
};

const updatePrintEdition = async (
    printEditionId,
    date,
    frontPageId,
    newsletterPDFId,
    body,
    tags,
    userId
) => {
    let result;
    try {
        const printEdition = await PrintEdition.findById(printEditionId);
        if (!printEdition) throw new Error("Print edition not found");
        if (date) printEdition.date = date;
        if (body) printEdition.body = body;

        if (frontPageId) {
            if (printEdition.frontPage != frontPageId) {
                const file = await File.findById(frontPageId);
                if (!file) throw new Error("Image not found");
                file.printEditionFP = printEdition._id;
                await file.save();
                printEdition.frontPage = frontPageId;
            }
        };
        if (newsletterPDFId) {
            if (printEdition.newsletterPDF != newsletterPDFId) {
                const file = await File.findById(newsletterPDFId);
                if (!file) throw new Error("Image not found");
                file.printEditionPDF = printEdition._id;
                await file.save();
                printEdition.newsletterPDF = newsletterPDFId;
            }
        };

        if (tags) {
            tags.map(async (tag) => {
                if (printEdition.tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (!tagFound) {
                        const newTag = new Tag({ name: tag });
                        newTag.printEditions.push(printEdition._id);
                        await newTag.save();
                    } else {
                        tagFound.printEditions.push(printEdition._id);
                        await tagFound.save();
                    }
                }
            });
            printEdition.tags.map(async (tag) => {
                if (tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (tagFound) {
                        tagFound.printEditions.pull(printEdition._id);
                        await tagFound.save();
                    }
                }
            });
            printEdition.tags = tags;
        };

        printEdition.lastUpdatedBy = userId;
        printEdition.lastUpdatedAt = new Date.now();

        result = await printEdition.save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deletePrintEdition = async (printEditionId) => {
    let result;
    try {
        const printEdition = await PrintEdition.findById(printEditionId);
        if (!printEdition) throw new Error("Print edition not found");

        //Find the user and delete the printEdition._id from the user's print editions array
        const user = await User.findById(printEdition.createdBy);
        if (!user) throw new Error("User not found");
        user.printEditions.pull(printEdition._id);
        await user.save();

        //Delete frontPage and newsletterPDF files
        if (printEdition.frontPage) {
            await deleteFile(printEdition.frontPage);
        };
        if (printEdition.newsletterPDF) {
            await deleteFile(printEdition.newsletterPDF);
        };

        result = await printEdition.remove();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getPrintEditions,
    getPrintEditionsByDate,
    createPrintEdition,
    updatePrintEdition,
    deletePrintEdition,
};
