const Section = require('../models/section');
const File = require("../models/file");

const getSections = async () => {
    let result;
    try{
        result = await Section.find({});
    }catch(error){
        throw error;
    }
    return result;
};

const getSectionById = async (sectionId) => {
    let result;
    try{
        result = await Section.findById(sectionId);
    }catch(error){
        throw error;
    }
    return result;
};

const createSection = async (name, description, imageId, userId) => {
    let result;
    try{
        const section = new Section( {
            name,
            description,
            image: imageId,
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

const updateSection = async (sectionId, name, description, imageId, userId) => {
    let result;
    try{
        const section = await Section.findById(sectionId);
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
        section.lastUpdatedAt = new Date.now();

        result = await section.save();
    }catch(error){
        throw error;
    }
    return result;
};

module.exports = {
    getSections,
    getSectionById,
    createSection,
    updateSection
};
