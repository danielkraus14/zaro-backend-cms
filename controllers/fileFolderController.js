const { fileFolderService } = require('../services');

const getFileFolders = async (req, res) => {
    try{
        const fileFolders = await fileFolderService.getFileFolders();
        res.status(200).send(fileFolders);
    }catch(error){
        res.status(400).send({error, message: 'File folders not found'});
    }
};

const getFileFolderById = async (req, res) => {
    try{
        const { fileFolderId } = req.params;
        const fileFolder = await fileFolderService.getFileFolderById(fileFolderId);
        res.status(200).send(fileFolder);
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

const createFileFolder = async (req, res) => {
    try{
        const { name } = req.body;
        const result = await fileFolderService.createFileFolder(name);
        res.status(201).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder already exists'});
    }
};

const updateFileFolder = async (req, res) => {
    try{
        const { fileFolderId } = req.params;
        const { name } = req.body;
        const result = await fileFolderService.updateFileFolder(fileFolderId, name);
        res.status(200).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

const deleteFileFolder = async (req, res) => {
    try{
        const { fileFolderId } = req.params;
        const result = await fileFolderService.deleteFileFolder(fileFolderId);
        res.status(204).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'File folder not found'});
    }
};

module.exports = {
    getFileFolders,
    getFileFolderById,
    createFileFolder,
    updateFileFolder,
    deleteFileFolder
};
