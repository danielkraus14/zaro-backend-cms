const FileFolder = require('../models/fileFolder');
const File = require('../models/file');
const { uploadFileS3, readFileS3, deleteFileS3 } = require('../s3');
const dateFns = require('date-fns');

const getFiles = async () => {
    let result;
    try{
        const files = await File.find();
        if(!files){
            result = [];
        };
        result = files;
    } catch(error) {
        throw error;
    }
    return result;
};

const readFileById = async (fileId) => {
    let result;
    try{
        const file = await File.findById(fileId);
        if(!file) throw new Error('File not found');
        result = await readFileS3(file.filename);
    } catch(error) {
        throw error;
    }
    return result;
};

const createFile = async (file, fileFolderId) => {
    let result;
    try{
        const year = dateFns.format(new Date(), 'yyyy');
        const month = dateFns.format(new Date(), 'MM');
        const day = dateFns.format(new Date(), 'dd');

        const fileFolder = await FileFolder.findById(fileFolderId);
        if (!fileFolder) throw new Error("File folder not found");

        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const filename = `${fileFolder.slug}/${year}/${month}/${day}_${nameFormat}`;
        const url = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${filename}`

        const newFile = new File({ filename, url });
        await uploadFileS3(file, filename);
        result = await newFile.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteFile = async (fileId) => {
    let result;
    try{
        const file = await File.findById(fileId)
        if(!file) throw new Error('File not found');

        const fileFolder = await FileFolder.findById(file.fileFolder);
        fileFolder.files.pull(file._id);
        await fileFolder.save();

        await deleteFileS3(file.filename);
        result = await file.remove();
    }catch(error){
        throw error;
    }
    return result;
};

module.exports = {
    getFiles,
    readFileById,
    createFile,
    deleteFile
};
