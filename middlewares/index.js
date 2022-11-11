const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/auth/isAdmin');
const isDirective = require('../middlewares/auth/isDirective');
const isEditor = require('../middlewares/auth/isEditor');

module.exports = {
    isAuth,
    isAdmin,
    isDirective,
    isEditor
}

