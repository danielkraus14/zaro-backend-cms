const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/auth/isAdmin');
const isDirective = require('../middlewares/auth/isDirective');
const isComertial = require('../middlewares/auth/isComertial');
const isReviser = require('../middlewares/auth/isReviser');

module.exports = {
    isAuth,
    isAdmin,
    isDirective,
    isComertial,
    isReviser
}

