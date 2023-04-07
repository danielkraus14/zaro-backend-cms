const { uploadFile, readFile, getFiles, deleteFile, createDirectory, getDirectories } = require('../s3');

const getMedia = async (req, res) => {
    try{
        const result = await getFiles();
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when getting media"});
    }
};

const uploadMedia = async (req, res) => {
    try{
        const file = req.files.file;
        const type = req.params.type;
        const result = await uploadFile(file, type);

        res.status(200).send({message: "Media uploaded", file: result});

    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when uploading media"});
    }
};

const getMediaByName = async (req, res) => {
    try {
        const result = await readFile(req.query.fileName);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when getting media"});
    }
};

const deleteMedia = async (req, res) => {
    try{
        const result = await deleteFile(req.query.fileName);
        res.status(204).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when deleting media"});
    }
};

const createDirectory = async (req, res) => {
    try{
        const { dirName } = req.body;
        const result = await createDirectory(dirName);

        res.status(200).send({message: "Directory created", file: result});

    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when creating directory"});
    }
};

const getDirectories = async (req, res) => {
    try{
        const result = await getDirectories();
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when getting directories"});
    }
};

module.exports = {
    getMedia,
    uploadMedia,
    getMediaByName,
    deleteMedia,
    createDirectory,
    getDirectories
};