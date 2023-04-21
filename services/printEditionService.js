const PrintEdition = require("../models/printEdition");
const Tag = require("../models/tag");
const File = require("../models/file");
const User = require("../models/user");
const Record = require("../models/record");

const { deleteFile } = require('../services/fileService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
    populate: [{
        path: 'frontPage',
        select: ['url', 'filename', 'epigraph']
    }, {
        path: 'newsletterPDF',
        select: ['url', 'filename', 'epigraph']
    }]
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

const getPrintEditionById = async (printEditionId) => {
    let result;
    try {
        result = await PrintEdition.findById(printEditionId).populate(paginateOptions.populate);
    } catch(error) {
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

const getPrintEditionsByTag = async (tag) => {
    let result;
    try {
        await PrintEdition.paginate({ tags: tag }, paginateOptions, function (err, res) {
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
            createdBy: userId
        });
        if (date) printEdition.date = date;
        if (body) printEdition.body = body;

        if (tags) {
            for (const tag of tags) {
                const tagFound = await Tag.findOne({ name: tag });
                if (!tagFound) {
                    const newTag = new Tag({ name: tag });
                    newTag.printEditions.push(printEdition._id);
                    await newTag.save();
                    printEdition.tags.push(newTag.name);
                } else {
                    printEdition.tags.push(tagFound.name);
                    tagFound.printEditions.push(printEdition._id);
                    await tagFound.save();
                }
            };
        };

        if (frontPageId) {
            const file = await File.findById(frontPageId);
            if (!file) throw new Error("File not found");
            file.printEditionFP = printEdition._id;
            await file.save();
            printEdition.frontPage = frontPageId;
        };

        if (newsletterPDFId) {
            const file = await File.findById(newsletterPDFId);
            if (!file) throw new Error("File not found");
            file.printEditionPDF = printEdition._id;
            await file.save();
            printEdition.newsletterPDF = newsletterPDFId;
        };

        const description = `${printEdition.date.toISOString().split('T')[0]} - ${printEdition.body}`;

        result = (await printEdition.save()).populate(paginateOptions.populate);
        await new Record({ description, operation: 'create', collectionName: 'printEdition', objectId: printEdition._id, user: userId }).save();
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
    let updatedProperties = [];
    try {
        const printEdition = await PrintEdition.findById(printEditionId);
        if (!printEdition) throw new Error("Print edition not found");

        if (date) printEdition.date = (printEdition.date != date) ? (updatedProperties.push('date'), date) : printEdition.date;
        if (body) printEdition.body = (printEdition.body != body) ? (updatedProperties.push('body'), body) : printEdition.body;

        if (frontPageId) {
            if (printEdition.frontPage != frontPageId) {
                const file = await File.findById(frontPageId);
                if (!file) throw new Error("Image not found");
                await deleteFile(printEdition.frontPage, userId);
                file.printEditionFP = printEdition._id;
                await file.save();
                printEdition.frontPage = frontPageId;
                updatedProperties.push('frontPage');
            }
        };
        if (newsletterPDFId) {
            if (printEdition.newsletterPDF != newsletterPDFId) {
                const file = await File.findById(newsletterPDFId);
                if (!file) throw new Error("Image not found");
                await deleteFile(printEdition.newsletterPDF, userId);
                file.printEditionPDF = printEdition._id;
                await file.save();
                printEdition.newsletterPDF = newsletterPDFId;
                updatedProperties.push('newsletterPDF');
            }
        };

        if (tags) {
            let updated = false;
            for (const tag of tags) {
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
                    updated = true;
                }
            };
            for (const tag of printEdition.tags) {
                if (tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (tagFound) {
                        tagFound.printEditions.pull(printEdition._id);
                        await tagFound.save();
                    }
                    updated = true;
                }
            };
            printEdition.tags = tags;
            if (updated) updatedProperties.push('tags');
        };

        printEdition.lastUpdatedBy = userId;
        printEdition.lastUpdatedAt = Date.now();

        const description = `${printEdition.date.toISOString().split('T')[0]} - ${printEdition.body}`;

        result = (await printEdition.save()).populate(paginateOptions.populate);
        await new Record({ description, operation: 'update', collectionName: 'printEdition', objectId: printEdition._id, user: userId, updatedProperties }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deletePrintEdition = async (printEditionId, userId) => {
    let result;
    try {
        const printEdition = await PrintEdition.findById(printEditionId);
        if (!printEdition) throw new Error("Print edition not found");

        //Find the user and delete the printEdition._id from the user's print editions array
        const user = await User.findById(printEdition.createdBy);
        if (!user) throw new Error("User not found");
        if (user.printEditions.indexOf(printEdition._id) != -1) user.printEditions.pull(printEdition._id);

        //Delete frontPage and newsletterPDF files
        if (printEdition.frontPage) {
            await deleteFile(printEdition.frontPage, userId);
        };
        if (printEdition.newsletterPDF) {
            await deleteFile(printEdition.newsletterPDF, userId);
        };

        await user.save();
        const delPrintEditionId = printEdition._id;
        const description = `${printEdition.date.toISOString().split('T')[0]} - ${printEdition.body}`;
        result = await printEdition.remove();
        await new Record({ description, operation: 'delete', collectionName: 'printEdition', objectId: delPrintEditionId, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getPrintEditions,
    getPrintEditionById,
    getPrintEditionsByDate,
    getPrintEditionsByTag,
    createPrintEdition,
    updatePrintEdition,
    deletePrintEdition,
};
