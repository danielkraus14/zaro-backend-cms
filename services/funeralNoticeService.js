const User = require("../models/user");
const FuneralNotice = require("../models/funeralNotice");
const Record = require("../models/record");

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
};

const getFuneralNotices = async () => {
    let result;
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
    try{
        result = await FuneralNotice.findById(funeralNoticeId);
    }catch(error){
        throw error;
    }
    return result;
};

const getFuneralNoticesByReligion = async (religion) => {
    let result;
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

const getFuneralNoticesByDate = async (date) => {
    let result;
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

const getFuneralNoticesByStatus = async (status) => {
    let result;
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
    try {
        let query = {};
        if (search.deceased) {
            query.deceased = { $regex: new RegExp(search.deceased), $options: "i" };
        }
        if (search.content) {
            query.content = { $regex: new RegExp(search.content), $options: "i" };
        }
        await FuneralNotice.paginate(query, paginateOptions, function (err, res) {
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

        user.funeralNotices.push(funeralNotice._id);
        await user.save();
        result = await funeralNotice.save();
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
    try {
        const funeralNotice = await FuneralNotice.findById(funeralNoticeId);
        if (!funeralNotice) throw new Error("Funeral notice not found");

        if (title) funeralNotice.title = title;
        if (deceased) funeralNotice.deceased = deceased;
        if (client) funeralNotice.client = client;
        if (date) funeralNotice.date = date;
        if (religion) funeralNotice.religion = religion;
        if (status) funeralNotice.status = status;
        if (content) funeralNotice.content = content;

        funeralNotice.lastUpdatedBy = userId;
        funeralNotice.lastUpdatedAt = Date.now();

        result = await funeralNotice.save();
        await new Record({
            description: `${funeralNotice.deceased} by ${funeralNotice.client}`,
            operation: 'update',
            collectionName: 'funeralNotice',
            objectId: funeralNotice._id,
            user: userId
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

        //Find the user and delete the funeralNotice._id from the user's funeral notices array
        const user = await User.findById(funeralNotice.createdBy);
        if (!user) throw new Error("User not found");
        if (user.funeralNotices.indexOf(funeralNotice._id) != -1) user.funeralNotices.pull(funeralNotice._id);
        await user.save();

        const delFuneralNoticeId = funeralNotice._id;
        const description = `${funeralNotice.deceased} by ${funeralNotice.client}`;
        result = await funeralNotice.remove();
        await new Record({ description, operation: 'delete', collectionName: 'funeralNotice', objectId: delFuneralNoticeId, user: userId}).save();
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
    updateFuneralNotice,
    deleteFuneralNotice,
};
