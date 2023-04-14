const { categoryService } = require('../services');

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).send(categories);
    } catch(error) {
        res.status(400).send({error, message: 'Categories not found'});
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        const category = await categoryService.getCategoryBySlug(categorySlug);
        res.status(200).send(category);
    } catch(error) {
        res.status(400).send({error, message: 'Category not found'});
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        const result = await categoryService.createCategory(name, description, userId);
        res.status(201).send({category: result});
    } catch(error) {
        res.status(400).send({error, message: 'Category already exists'});
    }
};

const updateCategory = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        const { name, description, userId } = req.body;
        const result = await categoryService.updateCategory(categorySlug, name, description, userId);
        res.status(200).send({category: result});
    } catch(error) {
        res.status(400).send({error, message: 'Category not found'});
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        const { userId } = req.body;
        const result = await categoryService.deleteCategory(categorySlug, userId);
        res.status(204).send({category: result});
    } catch(error) {
        res.status(400).send({error, message: 'Category not found'});
    }
};

module.exports = {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};
