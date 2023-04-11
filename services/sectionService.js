const Section = require('../models/section');
const File = require("../models/file");

const { deletePost } = require('../services/postService');

const getSections = async () => {
    let result;
    try{
        result = await Section.find({});
    }catch(error){
        throw error;
    }
    return result;
};

const getSectionBySlug = async (sectionSlug) => {
    let result;
    try{
        const section = await Section.findOne({ slug: sectionSlug });
        if (!section) throw new Error("Section not found");
        result = section;
    }catch(error){
        throw error;
    }
    return result;
};

const createSection = async (name, description, imageId, userId) => {
    let result;
    try{
        const rawSlug = name.replace(/ /g, '_').toLowerCase();
        const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const section = new Section( {
            name,
            description,
            image: imageId,
            slug,
            createdBy: userId
        } );

        if (imageId) {
            const file = await File.findById(imageId);
            if (!file) throw new Error("File not found");
            file.section = section._id;
            await file.save();
        };

        result = await section.save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateSection = async (sectionSlug, name, description, imageId, userId) => {
    let result;
    try{
        const section = await Section.findOne({ slug: sectionSlug });
        if (!section) throw new Error("Section not found");

        section.name = name;
        section.description = description;

        if (imageId) {
            if (section.image != imageId) {
                const file = await File.findById(imageId);
                if (!file) throw new Error("Image not found");
                file.section = section._id;
                await file.save();
                section.image = imageId;
            }
        };

        section.lastUpdatedBy = userId;
        section.lastUpdatedAt = Date.now();

        result = await section.save();
    }catch(error){
        throw error;
    }
    return result;
};

const deleteSection = async (sectionSlug) => {
    let result;
    try{

        const section = await Section.findOne({ slug: sectionSlug });
        if(!section) throw new Error('Section not found');

        for (const postId of section.posts) {
            await deletePost(postId);
        };

        result = await section.remove();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getSections,
    getSectionBySlug,
    createSection,
    updateSection,
    deleteSection
};
