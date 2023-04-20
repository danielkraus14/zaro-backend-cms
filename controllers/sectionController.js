const { sectionService } = require('../services');

const getSections = async (req, res) => {
    let result;
    try {
        result = await sectionService.getSections();
    } catch(error) {
        throw error;
    }
    res.status(200).send(result);
};

const getSectionBySlug = async (req, res) => {
    try {
        const { sectionSlug } = req.params;
        const section = await sectionService.getSectionBySlug(sectionSlug);
        res.status(200).send(section);
    } catch(error) {
        res.status(400).send({error, message: 'Section not found'});
    }
};

const createSection = async (req, res) => {
    const { name, description, imageId, atMenu, userId } = req.body;
    let result;
    try {
        result = await sectionService.createSection(name, description, imageId, atMenu, userId);
        res.status(201).send(result);
    } catch(error) {
        res.status(400).send({error, message: 'Section already exists'});
    }
};

const updateSection = async (req, res) => {
    try {
        const { sectionSlug } = req.params;
        const { name, description, imageId, atMenu, userId } = req.body;
        const result = await sectionService.updateSection(sectionSlug, name, description, imageId, atMenu, userId);
        res.status(200).send({section: result});
    } catch(error) {
        res.status(400).send({error, message: 'Section not found'});
    }
};

const deleteSection = async (req, res) => {
    try {
        const { sectionSlug } = req.params;
        const { userId } = req.body;
        const result = await sectionService.deleteSection(sectionSlug, userId);
        res.status(204).send({section: result});
    } catch(error) {
        res.status(400).send({error, message: 'Section not found'});
    }
};

module.exports = {
    getSections,
    getSectionBySlug,
    createSection,
    updateSection,
    deleteSection
};
