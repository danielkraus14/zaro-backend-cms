const {check} = require('express-validator');

module.exports = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid isEmail'),
    check('username')
        .notEmpty().withMessage('Username is required')
        .isLength({min: 4}).withMessage('Username must be at least 4 characters long'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
];