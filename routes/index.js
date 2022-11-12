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
routes.put('/update/:userId', isAuth, isDirective , userController.updateUser);
routes.delete('/delete/:userId', isAuth, isAdmin , userController.deleteUser);

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
routes.delete('/categories/delete/:categoryId', isAuth, isAdmin, categoryController.deleteCategory);

// Posts
routes.get('/posts', postController.getPosts);
routes.get('/posts/:secretaryshipId', postController.getPostsBySecretaryship);
routes.get('/posts/:categoryId', postController.getPostsByCategory);
routes.post('/posts/new', isAuth , isComertial, postController.createPost);
routes.put('/posts/update/:postId', isAuth, isComertial, postController.updatePost);
routes.delete('/posts/delete/:postId', isAuth, isComertial, postController.deletePost);

module.exports = routes;