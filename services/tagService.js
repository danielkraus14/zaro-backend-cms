const Tag = require('../models/tag');

const getTags = async () => {
    let result;
    try {
        result = await Tag.find().populate('posts').populate('printEditions');
    } catch(error) {
        throw error;
    }
    return result;
};

const getTagsByName = async (tagName) => {
    let result;
    try {
        result = await Tag.findOne({ name: tagName }).populate('posts').populate('printEditions');
    } catch(error) {
        throw error;
    }
    return result;
};

const createTag = async (name) => {
    let result;
    try {
        const tag = new Tag({
            name
        });
        result = await tag.save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getTags,
    getTagsByName,
    createTag
};
