const Category = require('../models/category');
const Record = require('../models/record');

const { deletePost } = require('../services/postService');

const getCategories = async () => {
    let result;
    try{
        const categories = await Category.find();
        if(!categories){
            result = [];
        };
        result = categories;
    } catch(error) {
        throw error;
    }
    return result;
};

const getCategoryBySlug = async (categorySlug) => {
    let result;
    try{
        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');
        result = category;
    } catch(error) {
        throw error;
    }
    return result;
};

const createCategory = async (name, description, userId) => {
    let result;
    try{
        const rawSlug = name.replace(/ /g, '_').toLowerCase();
        const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const newCategory = new Category({ name, slug, description, createdBy: userId });

        const category = await Category.findOne({ slug });
        if(category) throw new Error('Category already exists');

        result = await newCategory.save();
        await new Record({ description: newCategory.name, operation: 'create', collectionName: 'category', objectId: newCategory._id, user: userId }).save();
    } catch(error) {
        throw error;
    }

    return result;
};

const updateCategory = async (categorySlug, name, description, userId) => {
    let result;
    try{
        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');

        category.name = name;
        category.description = description;
        category.lastUpdatedAt = Date.now();
        category.lastUpdatedBy = userId;
        result = await category.save();
        await new Record({ description: category.name, operation: 'update', collectionName: 'category', objectId: category._id, user: userId}).save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteCategory = async (categorySlug, userId) => {
    let result;
    try{

        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');

        for (const postId of category.posts) {
            await deletePost(postId);
        };
        const delCategoryId = category._id;
        const description = category.name;

        result = await category.remove();
        await new Record({ description, operation: 'delete', collectionName: 'category', objectId: delCategoryId, user: userId}).save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};
