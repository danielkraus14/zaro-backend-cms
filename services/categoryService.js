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

const createCategory = async (name) => {
        let result;
        try{
            const candidateCategory = new Category({ name });

            const categoryFound = await Category.findOne({ name });
            if(categoryFound) throw new Error('Category already exists');

            result = await candidateCategory.save();
        } catch(error) {
            throw error;
        }

        return result;
};

const updateCategory = async (categoryId, name) => {
    let result;
    try{
        const categoryFound = await Category.findById(categoryId);
        if(!categoryFound) throw new Error('Category not found');

        categoryFound.name = name;
        result = await categoryFound.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const deleteCategory = async (categoryId) => {
    let result;
    try{

        const categoryFound = await Category.findById(categoryId)
        if(!categoryFound) throw new Error('Category not found');

        result = await categoryFound.remove();
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