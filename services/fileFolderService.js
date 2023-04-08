const FileFolder = require('../models/fileFolder');
const File = require('../models/file');
const { deleteFileS3, createDirectoryS3 } = require('../s3');

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

const getFileFolderById = async (fileFolderId) => {
    let result;
    try{
        const fileFolder = await FileFolder.findById(fileFolderId);
        if(!fileFolder) throw new Error('File folder not found');
        result = fileFolder;
    } catch(error) {
        throw error;
    }
    return result;
};

const createFileFolder = async (name) => {
    let result;
    try{
        const slug = name.replace(/ /g, '_').toLowerCase();
        const url = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${slug}`
        const newFileFolder = new FileFolder({ name, slug, url });

        const fileFolder = await FileFolder.findOne({ name });
        if(fileFolder) throw new Error('File folder already exists');

        await createDirectoryS3(slug);
        result = await newFileFolder.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateFileFolder = async (fileFolderId, name) => {
    let result;
    try{
        const fileFolder = await FileFolder.findById(fileFolderId);
        if(!fileFolder) throw new Error('File folder not found');

        fileFolder.name = name;
        result = await fileFolder.save();
    }
    catch(error){
        throw error;
    }
    return result;
};

const deleteFileFolder = async (fileFolderId) => {
    let result;
    try{

        const fileFolder = await FileFolder.findById(fileFolderId)
        if(!fileFolder) throw new Error('File folder not found');

        for (const file of fileFolder.files) {
            await deleteFileS3(file.filename);
            await File.findByIdAndDelete(file._id);
        };

        result = await fileFolder.remove();
    }catch(error){
        throw error;
    }
    return result;
};

module.exports = {
    getFileFolders,
    getFileFolderById,
    createFileFolder,
    updateFileFolder,
    deleteFileFolder
};
