const FileFolder = require('../models/fileFolder');
const File = require('../models/file');
const Record = require('../models/record');

const { deleteFile } = require('../services/fileService');

const { deleteFileS3, createDirectoryS3, deleteDirectoryS3 } = require('../s3');

const getFileFolders = async () => {
    let result;
    try{
        const fileFolders = await FileFolder.find();
        if(!fileFolders){
            result = [];
        };
        result = fileFolders;
    } catch(error) {
        throw error;
    }
    return result;
};

const getFileFolderBySlug = async (fileFolderSlug) => {
    let result;
    try{
        const fileFolder = await FileFolder.findOne({ slug: fileFolderSlug }).populate('files', 'url');
        if(!fileFolder) throw new Error('File folder not found');
        result = fileFolder;
    } catch(error) {
        throw error;
    }
    return result;
};

const createFileFolder = async (name, userId) => {
    let result;
    try{
        const rawSlug = name.replace(/ /g, '_').toLowerCase();
        const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const url = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${slug}/`;
        const newFileFolder = new FileFolder({ name, slug, url, createdBy: userId });

        const fileFolder = await FileFolder.findOne({ slug });
        if(fileFolder) throw new Error('File folder already exists');

        await createDirectoryS3(slug);
        result = await newFileFolder.save();
        await new Record({ description: newFileFolder.name, operation: 'create', collectionName: 'fileFolder', objectId: newFileFolder._id, user: userId}).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateFileFolder = async (fileFolderSlug, name, userId) => {
    let result;
    try{
        const fileFolder = await FileFolder.findOne({ slug: fileFolderSlug });
        if(!fileFolder) throw new Error('File folder not found');

        fileFolder.name = name;
        fileFolder.lastUpdatedBy = userId;
        fileFolder.lastUpdatedAt = Date.now();
        result = await fileFolder.save();
        await new Record({ description: fileFolder.name, operation: 'update', collectionName: 'fileFolder', objectId: fileFolder._id, user: userId}).save();
    }
    catch(error){
        throw error;
    }
    return result;
};

const deleteFileFolder = async (fileFolderSlug, userId) => {
    let result;
    try{

        const fileFolder = await FileFolder.findOne({ slug: fileFolderSlug });
        if(!fileFolder) throw new Error('File folder not found');

        for (const fileId of fileFolder.files) {
            const file = await File.findById(fileId);
            await deleteFileS3(file.filename);
            await deleteFile(fileId);
        }
        await deleteDirectoryS3(fileFolder.slug);
        const delFileFolderId = fileFolder._id;
        const description = fileFolder.name;
        result = await fileFolder.remove();
        await new Record({ description, operation: 'delete', collectionName: 'fileFolder', objectId: delFileFolderId, user: userId}).save();
    }catch(error){
        throw error;
    }
    return result;
};

module.exports = {
    getFileFolders,
    getFileFolderBySlug,
    createFileFolder,
    updateFileFolder,
    deleteFileFolder
};
