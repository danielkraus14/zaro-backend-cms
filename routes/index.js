const express = require('express');
const routes = express.Router();
//const { isAuth } = require('../middlewares');

// Import controllers
const { 
    userController,
} = require('../controllers');

// Import Middlewares
const {
    isAuth
} = require('../middlewares');

// Schema validation
const { userSchema } = require('../controllers/schemas');

// Routes

// Users
routes.post('/register', userSchema, userController.signUpUser);
routes.post('/login', userSchema, userController.signInUser);
routes.post('/delete/:userId', isAuth , userController.deleteUser);
routes.put('/update/:userId', isAuth , userController.updateUser);

module.exports = routes;