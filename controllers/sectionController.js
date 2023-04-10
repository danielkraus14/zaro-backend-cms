const { sectionService } = require('../services');

const getSections = async (req, res) => {
    let result;
    try{
        result = await sectionService.getSections();
    }catch(error){
        throw error;
    }
    res.status(200).send(result);
};

const getSectionById = async (req, res) => {
    try{
        const { sectionId } = req.params;
        const section = await sectionService.getSectionById(sectionId);
        res.status(200).send(section);
    }catch(error){
        res.status(400).send({error, message: 'Section not found'});
    }
};

const createSection = async (req, res) => {
    const { name, description, imageId, userId } = req.body;
    let result;
    try{
        result = await sectionService.createSection(name, description, imageId, userId);
    }catch(error){
        console.log(error);
    }
    res.status(201).send(result);
};

const updateSection = async (req, res) => {
    try{
        const { sectionId } = req.params;
        const { name, description, imageId, userId } = req.body;
        const result = await sectionService.updateSection(sectionId, name, description, imageId, userId);
        res.status(200).send({section: result});
    }catch(error){
        res.status(400).send({error, message: 'Section not found'});
    }
};

module.exports = {
    getSections,
    getSectionById,
    createSection,
    updateSection
};
