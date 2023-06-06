const Tag = require('../models/tag');
const Post = require('../models/post');
const PrintEdition = require('../models/printEdition');

const getTags = async () => {
    let result;
    try {
        result = await Tag.find().populate('printEditions');
    } catch(error) {
        throw error;
    }
    return result;
};

const getTagsByName = async (tagName) => {
    let result;
    try {
        result = await Tag.findOne({ name: tagName }).populate('printEditions');
    } catch(error) {
        throw error;
    }
    return result;
};

const createTag = async (name) => {
    let result;
    try {
        const foundTag = await Tag.findOne({ name });
        if (foundTag) throw new Error('Tag already exists');
        const tag = new Tag({
            name
        });
        result = await tag.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateTag = async (oldName, newName) => {
    let result;
    try {
        const foundTag = await Tag.findOne({ name: newName });
        if (foundTag) throw new Error('Tag already exists');
        const tag = await Tag.findOne({ name: oldName });
        tag.name = newName;
        for (const postId of tag.posts) {
            const post = await Post.findById(postId);
            post.tags = post.tags.map(tag => tag === oldName ? newName : tag);
            await post.save();
        };
        for (const printEditionId of tag.printEditions) {
            const printEdition = await PrintEdition.findById(printEditionId);
            printEdition.tags = printEdition.tags.map(tag => tag === oldName ? newName : tag);
            await printEdition.save();
        };
        result = await tag.save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getTags,
    getTagsByName,
    createTag,
    updateTag
};
