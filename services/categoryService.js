const Category = require('../models/category');

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

const getCategoryById = async (categoryId) => {
    let result;
    try{
        const category = await Category.findById(categoryId);
        if(!category) throw new Error('Category not found');
        result = category;
    } catch(error) {
        throw error;
    }
    return result;
};

const createCategory = async (name, userId) => {
    let result;
    try{
        const newCategory = new Category({ name, createdBy: userId });

        const category = await Category.findOne({ name });
        if(category) throw new Error('Category already exists');

        result = await newCategory.save();
    } catch(error) {
        throw error;
    }

    return result;
};

const updateCategory = async (categoryId, name, userId) => {
    let result;
    try{
        const category = await Category.findById(categoryId);
        if(!category) throw new Error('Category not found');

        category.name = name;
        category.lastUpdatedAt = new Date.now();
        category.lastUpdatedBy = userId;
        result = await category.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteCategory = async (categoryId) => {
    let result;
    try{

        const category = await Category.findById(categoryId)
        if(!category) throw new Error('Category not found');

        result = await category.remove();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
