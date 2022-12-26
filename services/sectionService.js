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
        const candidateSection = new Section( {
            name, 
            description, 
            image
        } );
        result = await candidateSection.save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateSection = async (sectionId, name, description, image) => {
    let result;
    try{
        const candidateSection = await Section.findById(sectionId);
        candidateSection.name = name;
        candidateSection.description = description;
        candidateSection.image = image;
        result = await candidateSection.save();
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
}
