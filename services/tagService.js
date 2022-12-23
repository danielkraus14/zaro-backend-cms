const Tag = require('../models/tag');

const getTags = async () => {
    let result;
    try{
        result = await Tag.find().populate('posts');
    }catch(error){
        throw error;
    }
    return result;
}

const getTagsById = async (tagId) => {
    let result;
    try{
        result = await Tag.findById(tagId).populate('posts');
    }catch(error){
        throw error;
    }
    return result;
}

const createTag = async (name) => {
    let result;
    try{
        const candidateTag = new Tag( {
            name
        } );
        result = await candidateTag.save();
    }catch(error){
        throw error;
    }
    return result;
}



module.exports = {
    getTags,
    getTagsById,
    createTag
}