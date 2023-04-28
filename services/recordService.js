const Record = require('../models/record');
const Category = require('../models/category');
const Event = require('../models/event');
const File = require('../models/file');
const FileFolder = require('../models/fileFolder');
const FuneralNotice = require('../models/funeralNotice');
const Post = require('../models/post');
const PrintEdition = require('../models/printEdition');
const Section = require('../models/section');
const Venue = require('../models/venue');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
    populate: {
        path: 'user',
        select: ['username', 'email']
    }
};

const getRecords = async (page) => {
    let result;
    if (page) paginateOptions.page = page;
    try {
        await Record.paginate({}, paginateOptions, function (err, res) {
            if (err) {
                throw err;
            }
            result = res;
        });
    } catch(error) {
        throw error;
    }
    return result;
};

const searchRecords = async (search) => {
    let result;
    if (search.page) paginateOptions.page = search.page;
    try {
        let query = {};
        if (search.collectionName) {
            query.collectionName = { $eq: search.collectionName };
            if (search.objectId) {
                query.objectId = { $eq: search.objectId };
            }
        }
        if (search.userId) {
            query.user = { $eq: search.userId };
        }
        if (search.operation) {
            query.operation = { $eq: search.operation };
        }
        if (search.dateFrom) {
            const date = new Date(search.dateFrom);
            date.setUTCHours(0, 0, 0, 0);
            query.date = { $gte: date };
        }
        if (search.dateUntil) {
            const date = new Date(search.dateUntil);
            date.setUTCHours(23, 59, 59, 999);
            query.date = { $lte: date };
        }
        if (search.objectId && !search.collectionName) {
            throw new Error("You must provide a collection name when searching by object id");
        }
        await Record.paginate(query, paginateOptions, function (err, res) {
            if (err) {
                throw err;
            }
            result = res;
        });
    } catch(error) {
        throw error;
    }
    return result;
};

const getObjectOfRecord = async (recordId) => {
    let object;
    try {
        const record = await Record.findById(recordId);
        const collectionName = record.collectionName;
        const objectId = record.objectId;
        const deleted = await Record.findOne({ collectionName, objectId, operation: 'delete' });
        if (deleted) return { message: `This ${collectionName} has been deleted`, object: null };
        switch (collectionName) {
            case 'category':
                object = await Category.findById(objectId);
                break;
            case 'event':
                object = await Event.findById(objectId);
                break;
            case 'file':
                object = await File.findById(objectId);
                break;
            case 'fileFolder':
                object = await FileFolder.findById(objectId);
                break;
            case 'funeralNotice':
                object = await FuneralNotice.findById(objectId);
                break;
            case 'post':
                object = await Post.findById(objectId);
                break;
            case 'printEdition':
                object = await PrintEdition.findById(objectId);
                break;
            case 'section':
                object = await Section.findById(objectId);
                break;
            case 'venue':
                object = await Venue.findById(objectId);
                break;
            default:
                throw new Error("Invalid collection name");
        };
    } catch(error) {
        throw error;
    }
    return object;
};

module.exports = {
    getRecords,
    searchRecords,
    getObjectOfRecord
}
