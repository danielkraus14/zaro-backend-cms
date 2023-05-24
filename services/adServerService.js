const User = require("../models/user");
const AdServer = require("../models/adServer");
const File = require("../models/file");
const Record = require("../models/record");

const { deleteFile } = require('../services/fileService');

const { mongoose } = require("mongoose");

const paginateOptions = {
    limit: 15,
    sort: { createdAt: -1 },
    populate: [
        {
            path: 'desktopImage',
            select: ['url', 'filename', 'epigraph']
        },
        {
            path: 'mobileImage',
            select: ['url', 'filename', 'epigraph']
        },
        {
            path: 'createdBy',
            select: ['username', 'email']
        },
        {
            path: 'lastUpdatedBy',
            select: ['username', 'email']
        }
    ]
};

const getAdServers = async (page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await AdServer.paginate({}, paginateOptions, function (err, res) {
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

const getAdServerById = async (adServerId) => {
    let result;
    try {
        result = await AdServer.findById(adServerId).populate(paginateOptions.populate);
    } catch(error) {
        throw error;
    }
    return result;
};

const getAdServersByPosition = async (position, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await AdServer.paginate({ position }, paginateOptions, function (err, res) {
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

const getAdServersByStatus = async (status, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await AdServer.paginate({ status }, paginateOptions, function (err, res) {
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

const searchAdServers = async (search) => {
    let result;
    paginateOptions.page = search.page ? search.page : 1;
    try {
        let query = {};
        if (search.title) {
            query.title = { $regex: new RegExp(search.title), $options: "i" };
        };
        if (search.dateFrom) {
            const date = new Date(search.dateFrom);
            date.setUTCHours(0, 0, 0, 0);
            query.$or = [ { dateEnds: { $gte: date } }, { unlimited: true } ]
        };
        if (search.dateUntil) {
            const date = new Date(search.dateUntil);
            date.setUTCHours(23, 59, 59, 999);
            query.dateStarts = { $lte: date };
        };
        await AdServer.paginate(query, paginateOptions, function (err, res) {
            if (err) {
                throw err;
            }
            result = res;
        });
    } catch (error) {
        throw error;
    }
    return result;
};

const createAdServer = async (
    userId,
    position,
    site,
    dateStarts,
    dateEnds,
    unlimited,
    title,
    htmlContent,
    desktopImageId,
    mobileImageId,
    url,
    client,
    status
) => {
    let result;
    try {
        const adServer = new AdServer({
            title,
            createdBy: userId
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        if (position) adServer.position = position;
        if (site) adServer.site = site;
        if (dateStarts) adServer.dateStarts = dateStarts;
        if (dateEnds) adServer.dateEnds = dateEnds;
        if (unlimited !== undefined) adServer.unlimited = unlimited;
        if (!adServer.unlimited && !adServer.dateEnds) throw new Error("If it's not an unlimited banner, date ends is required");
        if (htmlContent) adServer.htmlContent = htmlContent;
        if (url) adServer.url = url;
        if (client) adServer.client = client;
        if (status) adServer.status = status;

        if (desktopImageId) {
            const image = await File.findById(desktopImageId);
            if (!image) throw new Error("Image not found");
            image.adServerDesktop = adServer._id;
            await image.save();
            adServer.desktopImage = desktopImageId;
        };
        if (mobileImageId) {
            const image = await File.findById(mobileImageId);
            if (!image) throw new Error("Image not found");
            image.adServerMobile = adServer._id;
            await image.save();
            adServer.mobileImage = mobileImageId;
        };

        if (adServer.unlimited && adServer.dateEnds) {
            adServer.dateEnds = undefined;
        };
        if (!adServer.htmlContent && !adServer.desktopImage && !adServer.mobileImage && !adServer.url) {
            throw new Error("At least one of the following is required: html content, desktop image, mobile image, url");
        };

        user.adServers.push(adServer._id);
        await user.save();
        result = (await adServer.save()).populate(paginateOptions.populate);
        await new Record({ description: adServer.title, operation: 'create', collectionName: 'adServer', objectId: adServer._id, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const updateAdServer = async (
    adServerId,
    userId,
    position,
    site,
    dateStarts,
    dateEnds,
    unlimited,
    title,
    htmlContent,
    desktopImageId,
    mobileImageId,
    url,
    client,
    status
) => {
    let result;
    let updatedProperties = [];
    try {
        const adServer = await AdServer.findById(adServerId);
        if (!adServer) throw new Error("Ad server not found");

        if (position) adServer.position = (adServer.position != position) ? (updatedProperties.push('position'), position) : adServer.position;
        if (site) adServer.site = (adServer.site != site) ? (updatedProperties.push('site'), site) : adServer.site;
        if (dateStarts) adServer.dateStarts = (adServer.dateStarts != dateStarts) ? (updatedProperties.push('dateStarts'), dateStarts) : adServer.dateStarts;
        if (dateEnds) adServer.dateEnds = (adServer.dateEnds != dateEnds) ? (updatedProperties.push('dateEnds'), dateEnds) : adServer.dateEnds;
        if (unlimited !== undefined) adServer.unlimited = (adServer.unlimited != unlimited) ? (updatedProperties.push('unlimited'), unlimited) : adServer.unlimited;
        if (!adServer.unlimited && !adServer.dateEnds) throw new Error("If it's not an unlimited banner, date ends is required");
        if (title) adServer.title = (adServer.title != title) ? (updatedProperties.push('title'), title) : adServer.title;
        if (htmlContent) adServer.htmlContent = (adServer.htmlContent != htmlContent) ? (updatedProperties.push('htmlContent'), htmlContent) : adServer.htmlContent;
        if (url) adServer.url = (adServer.url != url) ? (updatedProperties.push('url'), url) : adServer.url;
        if (client) adServer.client = (adServer.client != client) ? (updatedProperties.push('client'), client) : adServer.client;
        if (status) adServer.status = (adServer.status != status) ? (updatedProperties.push('status'), status) : adServer.status;

        if (desktopImageId) {
            if (adServer.desktopImage != desktopImageId) {
                const file = await File.findById(desktopImageId);
                if (!file) throw new Error("Image not found");
                await deleteFile(adServer.desktopImage, userId);
                file.adServerDesktop = adServer._id;
                await file.save();
                adServer.desktopImage = desktopImageId;
                updatedProperties.push('desktopImage');
            }
        };
        if (mobileImageId) {
            if (adServer.mobileImage != mobileImageId) {
                const file = await File.findById(mobileImageId);
                if (!file) throw new Error("Image not found");
                await deleteFile(adServer.mobileImage, userId);
                file.adServerDesktop = adServer._id;
                await file.save();
                adServer.mobileImage = mobileImageId;
                updatedProperties.push('mobileImage');
            }
        };

        adServer.lastUpdatedBy = userId;
        adServer.lastUpdatedAt = Date.now();

        if (adServer.unlimited && adServer.dateEnds) {
            adServer.dateEnds = undefined;
        };
        if (!adServer.htmlContent && !adServer.desktopImage && !adServer.mobileImage && !adServer.url) {
            throw new Error("At least one of the following is required: html content, desktop image, mobile image, url");
        };

        result = (await adServer.save()).populate(paginateOptions.populate);
        await new Record({ description: adServer.title, operation: 'update', collectionName: 'adServer', objectId: adServer._id, user: userId, updatedProperties }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deleteAdServer = async (adServerId, userId) => {
    let result;
    try {
        const adServer = await AdServer.findById(adServerId);
        if (!adServer) throw new Error("Ad server not found");

        //Find the ad server and delete the adServer._id from the user's ad servers array
        const user = await User.findById(adServer.createdBy);
        if (!user) throw new Error("User not found");
        if (user.adServers.indexOf(adServer._id) != -1) user.adServers.pull(adServer._id);

        //Delete all images
        if (adServer.desktopImage) await deleteFile(adServer.desktopImage, userId);
        if (adServer.mobileImage) await deleteFile(adServer.mobileImage, userId);

        await user.save();
        const delAdServerId = adServer._id;
        const description = adServer.title;
        result = await adServer.remove();
        await new Record({ description, operation: 'delete', collectionName: 'adServer', objectId: delAdServerId, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getAdServers,
    getAdServerById,
    getAdServersByPosition,
    getAdServersByStatus,
    searchAdServers,
    createAdServer,
    updateAdServer,
    deleteAdServer
};
