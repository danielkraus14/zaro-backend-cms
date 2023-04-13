const { fileFolderService } = require('../services');

const getFileFolders = async (req, res) => {
    try{
        const fileFolders = await fileFolderService.getFileFolders();
        res.status(200).send(fileFolders);
    }catch(error){
        res.status(400).send({error, message: 'File folders not found'});
    }
};

const getFileFolderBySlug = async (req, res) => {
    try{
        const { fileFolderSlug } = req.params;
        const fileFolder = await fileFolderService.getFileFolderBySlug(fileFolderSlug);
        res.status(200).send(fileFolder);
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

const createFileFolder = async (req, res) => {
    try{
        const { name, userId } = req.body;
        const result = await fileFolderService.createFileFolder(name, userId);
        res.status(201).send({fileFolder: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder already exists'});
    }
};

const updateFileFolder = async (req, res) => {
    try{
        const { fileFolderSlug } = req.params;
        const { name, userId } = req.body;
        const result = await fileFolderService.updateFileFolder(fileFolderSlug, name, userId);
        res.status(200).send({fileFolder: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

const deleteFileFolder = async (req, res) => {
    try{
        const { fileFolderSlug } = req.params;
        const result = await fileFolderService.deleteFileFolder(fileFolderSlug);
        res.status(204).send({fileFolder: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

module.exports = {
    getFileFolders,
    getFileFolderBySlug,
    createFileFolder,
    updateFileFolder,
    deleteFileFolder
};
