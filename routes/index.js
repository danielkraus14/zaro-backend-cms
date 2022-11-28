const express = require('express');
const routes = express.Router();

// Import controllers
const { 
    userController,
    postController,
    secretaryshipController,
    categoryController
} = require('../controllers');

// Import Auth Middlewares
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
routes.put('/update/:userId', userController.updateUser);
routes.delete('/delete/:userId',  userController.deleteUser);

// Secretaryships
routes.get('/secretaryships', secretaryshipController.getSecretaryships);
routes.get('/secretaryship/:secretaryshipId', secretaryshipController.getSecretaryshipById);
routes.post('/secretaryships/create', secretaryshipController.createSecretaryship);
routes.put('/secretaryships/update/:secretaryshipId', secretaryshipController.updateSecretaryship);
routes.delete('/secretaryships/delete/:secretaryshipId', secretaryshipController.deleteSecretaryship);

// Categories

routes.get('/categories', categoryController.getCategories);
routes.get('/categories/:categoryId', categoryController.getCategoryById);
routes.post('/categories/create', categoryController.createCategory);
routes.put('/categories/update/:categoryId', categoryController.updateCategory);
routes.delete('/categories/delete/:categoryId', categoryController.deleteCategory);

// Posts
routes.get('/posts', postController.getPosts);
routes.get('/posts/:secretaryshipId', postController.getPostsBySecretaryship);
routes.get('/posts/:categoryId', postController.getPostsByCategory);
routes.post('/posts/new',  postController.createPost);
routes.put('/posts/update/:postId', postController.updatePost);
routes.delete('/posts/delete/:postId', postController.deletePost);

module.exports = routes;