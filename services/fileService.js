const FileFolder = require('../models/fileFolder');
const File = require('../models/file');
const Post = require('../models/post');
const PrintEdition = require('../models/printEdition');
const Event = require('../models/event');
const Section = require('../models/section');
const Record = require('../models/record');

const { uploadFileS3, readFileS3, deleteFileS3 } = require('../s3');

const dateFns = require('date-fns');

const getFiles = async () => {
    let result;
    try {
        const files = await File.find();
        if (!files) {
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
    try {
        const file = await File.findById(fileId);
        if (!file) throw new Error('File not found');
        result = await readFileS3(file.filename);
    } catch(error) {
        throw error;
    }
    return result;
};

const createFile = async (file, fileFolderSlug, epigraph, userId) => {
    let result;
    try {
        const year = dateFns.format(new Date(), 'yyyy');
        const month = dateFns.format(new Date(), 'MM');
        const day = dateFns.format(new Date(), 'dd');

        const fileFolder = await FileFolder.findOne({ slug: fileFolderSlug });
        if (!fileFolder) throw new Error("File folder not found");

        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const filename = `${fileFolder.slug}/${year}/${month}/${day}_${nameFormat}`;
        const url = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${filename}`

        const newFile = new File({ filename, url, epigraph, createdBy: userId, fileFolder: fileFolder._id });
        fileFolder.files.push(newFile._id);
        await fileFolder.save();
        await uploadFileS3(file, filename);
        result = await newFile.save();
        await new Record({ description: newFile.filename, operation: 'create', collectionName: 'file', objectId: newFile._id, user: userId }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateFile = async (fileId, epigraph, userId) => {
    let result;
    try {
        const file = await File.findById(fileId);
        if (!file) throw new Error('File not found');

        file.epigraph = epigraph;
        result = await file.save();
        await new Record({ description: file.filename, operation: 'update', collectionName: 'file', objectId: file._id, user: userId }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteFile = async (fileId, userId) => {
    let result;
    try {
        const file = await File.findById(fileId);
        if(!file) throw new Error('File not found');

        const fileFolder = await FileFolder.findById(file.fileFolder);
        if(!fileFolder) throw new Error('File folder not found');
        fileFolder.files.pull(file._id);
        await fileFolder.save();

        if (file.post) {
            const post = await Post.findById(file.post);
            if (!post) throw new Error('Post not found');
            if (post.images.indexOf(file._id) != -1) post.images.pull(file._id);
            await post.save();
        };
        if (file.printEditionFP) {
            await PrintEdition.updateOne(
                { frontPage: file.printEditionFP },
                { $unset: { frontPage: 1 } }
            );
        };
        if (file.printEditionPDF) {
            await PrintEdition.updateOne(
                { newsletterPDF: file.printEditionPDF },
                { $unset: { newsletterPDF: 1 } }
            );
        };
        if (file.event) {
            await Event.updateOne(
                { billboard: file.event },
                { $unset: { billboard: 1 } }
            );
        };
        if (file.section) {
            await Section.updateOne(
                { image: file.section },
                { $unset: { image: 1 } }
            );
        };

        await deleteFileS3(file.filename);
        const delFileId = file._id;
        const description = file.filename;
        result = await file.remove();
        await new Record({ description, operation: 'delete', collectionName: 'file', objectId: delFileId, user: userId }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getFiles,
    readFileById,
    createFile,
    updateFile,
    deleteFile
};
