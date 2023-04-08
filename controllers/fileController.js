const { fileService } = require('../services');

const getFiles = async (req, res) => {
    try{
        const files = await fileService.getFiles();
        res.status(200).send(files);
    }catch(error){
        res.status(400).send({error, message: 'Files not found'});
    }
};

const readFileById = async (req, res) => {
    try{
        const { fileId } = req.params;
        const file = await fileService.readFileById(fileId);
        res.status(200).send(file);
    }catch(error){
        res.status(400).send({error, message: 'File not found'});
    }
};

const createFile = async (req, res) => {
    try{
        const { fileFolderId } = req.params;
        const file = req.files.file
        const result = await fileService.createFile(file, fileFolderId);
        res.status(201).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'File already exists'});
    }
};

const deleteFile = async (req, res) => {
    try{
        const { fileId } = req.params;
        const result = await fileService.deleteFile(fileId);
        res.status(204).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'File not found'});
    }
};

module.exports = {
    getFiles,
    readFileById,
    createFile,
    deleteFile
};