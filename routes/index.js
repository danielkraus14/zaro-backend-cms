const express = require('express');
const routes = express.Router();

// Import controllers
const { 
    userController,
    postController,
    secretaryshipController
} = require('../controllers');

// Import Middlewares
const {
    isAuth,
    isAdmin,
    isDirective,
    isEditor
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
routes.post('/secretaryships/create', isAuth, secretaryshipController.createSecretaryship);

// Posts
routes.get('/posts', isAuth , postController.getPosts);
routes.post('/posts/new', isAuth , postController.createPost);

module.exports = routes;