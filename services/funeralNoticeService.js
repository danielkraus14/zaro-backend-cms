const User = require("../models/user");
const FuneralNotice = require("../models/funeralNotice");
const Record = require("../models/record");

const paginateOptions = {
    limit: 14,
    sort: { createdAt: -1 },
    populate: [
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

const getFuneralNotices = async (page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await FuneralNotice.paginate({}, paginateOptions, function (err, res) {
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

const getFuneralNoticeById = async (funeralNoticeId) => {
    let result;
    try {
        result = await FuneralNotice.findById(funeralNoticeId).populate(paginateOptions.populate);
    } catch(error) {
        throw error;
    }
    return result;
};

const getFuneralNoticesByReligion = async (religion, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await FuneralNotice.paginate({ religion }, paginateOptions, function (err, res) {
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

const getFuneralNoticesByDate = async (date, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        await FuneralNotice.paginate({ date: { $gte: start, $lte: end } }, paginateOptions, function (err, res) {
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

const getFuneralNoticesByStatus = async (status, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await FuneralNotice.paginate({ status }, paginateOptions, function (err, res) {
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

const searchFuneralNotice = async (search) => {
    let result;
    paginateOptions.page = search.page ? search.page : 1;
    try {
        let query = {};
        if (search.deceased) {
            query.deceased = { $regex: new RegExp(search.deceased), $options: "i" };
        };
        if (search.content) {
            query.content = { $regex: new RegExp(search.content), $options: "i" };
        };
        if (search.title) {
            query.title = { $regex: new RegExp(search.title), $options: "i" };
        };
        await FuneralNotice.paginate(query, paginateOptions, function (err, res) {
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

const publicGetFuneralNotices = async (page) => {
    try {
        paginateOptions.page = page || 1;
        const result = {};
        const query = { status: 'published' };

        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 10);
        limitDate.setUTCHours(0, 0, 0, 0);

        query.createdAt = { $gte: limitDate };
        
        const funeralNotices = await FuneralNotice.find(query);
        const titles = [...new Set(funeralNotices.map(funeralNotice => funeralNotice.title))]
        
        for (const title of titles) {
            query.title = title;

            try {
                result[title] = await FuneralNotice.paginate(query, paginateOptions);
            } catch (error) {
                throw error;
            };
        };

        return result;
    } catch (error) {
        throw error;
    };
};

const createFuneralNotice = async (
    userId,
    title,
    deceased,
    client,
    date,
    religion,
    status,
    content,
) => {
    let result;
    try {
        const funeralNotice = new FuneralNotice({
            title,
            deceased,
            client,
            content,
            createdBy: userId
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        if (date) funeralNotice.date = date;
        if (religion) funeralNotice.religion = religion;
        if (status) funeralNotice.status = status;

        result = (await funeralNotice.save()).populate(paginateOptions.populate);
        await new Record({
            description: `${funeralNotice.deceased} by ${funeralNotice.client}`,
            operation: 'create',
            collectionName: 'funeralNotice',
            objectId: funeralNotice._id,
            user: userId
        }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const updateFuneralNotice = async (
    funeralNoticeId,
    userId,
    title,
    deceased,
    client,
    date,
    religion,
    status,
    content,
) => {
    let result;
    let updatedProperties = [];
    try {
        const funeralNotice = await FuneralNotice.findById(funeralNoticeId);
        if (!funeralNotice) throw new Error("Funeral notice not found");

        if (title) funeralNotice.title = (funeralNotice.title != title) ? (updatedProperties.push('title'), title) : funeralNotice.title;
        if (deceased) funeralNotice.deceased = (funeralNotice.deceased != deceased) ? (updatedProperties.push('deceased'), deceased) : funeralNotice.deceased;
        if (client) funeralNotice.client = (funeralNotice.client != client) ? (updatedProperties.push('client'), client) : funeralNotice.client;
        if (date) funeralNotice.date = (funeralNotice.date != date) ? (updatedProperties.push('date'), date) : funeralNotice.date;
        if (religion) funeralNotice.religion = (funeralNotice.religion != religion) ? (updatedProperties.push('religion'), religion) : funeralNotice.religion;
        if (status) funeralNotice.status = (funeralNotice.status != status) ? (updatedProperties.push('status'), status) : funeralNotice.status;
        if (content) funeralNotice.content = (funeralNotice.content != content) ? (updatedProperties.push('content'), content) : funeralNotice.content;

        funeralNotice.lastUpdatedBy = userId;
        funeralNotice.lastUpdatedAt = Date.now();

        result = (await funeralNotice.save()).populate(paginateOptions.populate);
        await new Record({
            description: `${funeralNotice.deceased} by ${funeralNotice.client}`,
            operation: 'update',
            collectionName: 'funeralNotice',
            objectId: funeralNotice._id,
            user: userId,
            updatedProperties
        }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deleteFuneralNotice = async (funeralNoticeId, userId) => {
    let result;
    try {
        const funeralNotice = await FuneralNotice.findById(funeralNoticeId);
        if (!funeralNotice) throw new Error("Funeral notice not found");

        const delFuneralNoticeId = funeralNotice._id;
        const description = `${funeralNotice.deceased} by ${funeralNotice.client}`;
        result = await funeralNotice.remove();
        await new Record({ description, operation: 'delete', collectionName: 'funeralNotice', objectId: delFuneralNoticeId, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getFuneralNotices,
    getFuneralNoticeById,
    createFuneralNotice,
    searchFuneralNotice,
    getFuneralNoticesByReligion,
    getFuneralNoticesByDate,
    getFuneralNoticesByStatus,
    publicGetFuneralNotices,
    updateFuneralNotice,
    deleteFuneralNotice,
};
