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
        const { file } = req.files
        const { userId, fileFolderSlug } = req.body
        const result = await fileService.createFile(file, fileFolderSlug, userId);
        res.status(201).send({file: result});
    }catch(error){
        res.status(400).send({error, message: 'File already exists'});
    }
};

const deleteFile = async (req, res) => {
    try{
        const { fileId } = req.params;
        const { userId } = req.body;
        const result = await fileService.deleteFile(fileId, userId);
        res.status(204).send({file: result});
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
