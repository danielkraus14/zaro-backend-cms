const {categoryService} = require('../services');

const getCategories = async (req, res) => {
    try{
        const categories = await categoryService.getCategories();
        res.status(200).send(categories);
    }catch(error){
        res.status(400).send({error, message: 'Categories not found'});
    }
};

const getCategoryById = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const category = await categoryService.getCategoryById(categoryId);
        res.status(200).send(category);
    }catch(error){
        res.status(400).send({error, message: 'Category not found'});
    }
};

const createCategory = async (req, res) => {
    try{
        const { name } = req.body;
        const result = await categoryService.createCategory(name);
        res.status(201).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'Category already exists'});
    }
};

const updateCategory = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const { name } = req.body;
        const result = await categoryService.updateCategory(categoryId, name);
        res.status(200).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'Category not found'});
    }
};

const deleteCategory = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const result = await categoryService.deleteCategory(categoryId);
        res.status(204).send({category: result});
    }catch(error){
        res.status(400).send({error, message: 'Category not found'});
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
