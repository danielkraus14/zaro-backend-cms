const Category = require('../models/category');

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
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteCategory = async (categorySlug) => {
    let result;
    try{

        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');

        for (const postId of category.posts) {
            await deletePost(postId);
        };

        result = await category.remove();
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
