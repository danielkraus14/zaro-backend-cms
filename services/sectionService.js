const Section = require('../models/section');
const File = require("../models/file");
const Record = require('../models/record');

const { deletePost } = require('../services/postService');
const { deleteFile } = require('../services/fileService');

const populate = [
    {
        path: 'createdBy',
        select: ['username', 'email']
    },
    {
        path: 'lastUpdatedBy',
        select: ['username', 'email']
    },
    {
        path: 'image',
        select: 'url'
    },
    {
        path: 'posts',
        populate: {
            path: 'images',
            select: 'url'
        }
    }
]

const getSections = async () => {
    let result;
    try {
        result = await Section.find().populate(populate);
    } catch(error) {
        throw error;
    }
    return result;
};

const getSectionBySlug = async (sectionSlug) => {
    let result;
    try {
        const section = await Section.findOne({ slug: sectionSlug }).populate(populate);
        if (!section) throw new Error("Section not found");
        result = section;
    } catch(error) {
        throw error;
    }
    return result;
};

const createSection = async (name, description, imageId, atMenu, userId) => {
    let result;
    try {
        const rawSlug = name.replace(/ /g, '_').toLowerCase();
        const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const section = new Section( {
            name,
            description,
            slug,
            atMenu,
            createdBy: userId
        } );

        if (imageId) {
            const file = await File.findById(imageId);
            if (!file) throw new Error("File not found");
            file.section = section._id;
            await file.save();
            section.image = imageId;
        };

        // if (atMenu) section.atMenu = atMenu;
        result = (await section.save()).populate(populate);
        await new Record({ description: section.name, operation: 'create', collectionName: 'section', objectId: section._id, user: userId }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateSection = async (sectionSlug, name, description, imageId, atMenu, userId) => {
    let result;
    let updatedProperties = [];
    try {
        const section = await Section.findOne({ slug: sectionSlug });
        if (!section) throw new Error("Section not found");

        if (name) section.name = (section.name != name) ? (updatedProperties.push('name'), name) : section.name;
        if (description) section.description = (section.description != description) ? (updatedProperties.push('description'), description) : section.description;
        if (atMenu !== undefined) section.atMenu = (section.atMenu != atMenu) ? (updatedProperties.push('atMenu'), atMenu) : section.atMenu;

        if (imageId) {
            if (section.image != imageId) {
                const file = await File.findById(imageId);
                if (!file) throw new Error("Image not found");
                await deleteFile(section.image, userId);
                file.section = section._id;
                await file.save();
                section.image = imageId;
                updatedProperties.push('image');
            }
        };

        section.lastUpdatedBy = userId;
        section.lastUpdatedAt = Date.now();

        result = (await section.save()).populate(populate);
        await new Record({ description: section.name, operation: 'update', collectionName: 'section', objectId: section._id, user: userId, updatedProperties }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteSection = async (sectionSlug, userId) => {
    let result;
    try {

        const section = await Section.findOne({ slug: sectionSlug });
        if(!section) throw new Error('Section not found');

        //Delete all posts in section
        for (const postId of section.posts) {
            await deletePost(postId);
        };

        //Delete image from S3 server
        if (section.image) {
            await deleteFile(section.image, userId);
        };

        const delSectionId = section._id;
        const description = section.name;
        result = await section.remove();
        await new Record({ description, operation: 'delete', collectionName: 'section', objectId: delSectionId, user: userId }).save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getSections,
    getSectionBySlug,
    createSection,
    updateSection,
    deleteSection
};
