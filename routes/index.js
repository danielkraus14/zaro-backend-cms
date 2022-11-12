const express = require('express');
const routes = express.Router();

// Import controllers
const { 
    userController,
    postController,
    secretaryshipController,
    categoryController
} = require('../controllers');

// Import Middlewares
const {
    isAuth,
    isAdmin,
    isDirective,
    isComertial
} = require('../middlewares');

// Schema validation
const { userSchema } = require('../controllers/schemas');

// Routes

// Users
routes.post('/signup', userSchema, userController.signUpUser);
routes.post('/signin', userSchema, userController.signInUser);
routes.post('/delete/:userId', isAuth, isAdmin , userController.deleteUser);
routes.put('/update/:userId', isAuth, isDirective , userController.updateUser);

// Secretaryships
routes.get('/secretaryships', isAuth, secretaryshipController.getSecretaryships);
routes.get('/secretaryship/:secretaryshipId', isAuth, secretaryshipController.getSecretaryshipById);
routes.post('/secretaryships/create', isAuth, isAdmin, secretaryshipController.createSecretaryship);
routes.put('/secretaryships/update/:secretaryshipId', isAuth, isAdmin, secretaryshipController.updateSecretaryship);
routes.delete('/secretaryships/delete/:secretaryshipId', isAuth, isAdmin, secretaryshipController.deleteSecretaryship);

// Categories

routes.get('/categories', isAuth, categoryController.getCategories);
routes.get('/categories/:categoryId', isAuth, categoryController.getCategoryById);
routes.post('/categories/create', isAuth, isAdmin, categoryController.createCategory);
routes.put('/categories/update/:categoryId', isAuth, isAdmin, categoryController.updateCategory);
routes.post('/categories/delete/:categoryId', isAuth, isAdmin, categoryController.deleteCategory);

// Posts
routes.get('/posts', isAuth , postController.getPosts);
routes.post('/posts/new', isAuth , postController.createPost);

module.exports = routes;