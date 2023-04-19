const { authService } = require('../services');

const isAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: 'You are not authorized' });
        }
        const token = req.headers.authorization.split(' ')[1];
        const response = await authService.decodeToken(token)
        req.userId = response;
        next();
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong when trying to authenticate', error });
    }
}

module.exports = isAuth;