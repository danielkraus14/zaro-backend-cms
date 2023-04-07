const Section = require('../models/section');

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

const createSection = async (name, description, image) => {
    let result;
    try{
        const section = new Section( {
            name,
            description,
            image
        } );
        result = await section.save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateSection = async (sectionId, name, description, image) => {
    let result;
    try{
        const section = await Section.findById(sectionId);
        section.name = name;
        section.description = description;
        section.image = image;
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
