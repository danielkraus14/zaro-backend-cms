const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const payload = {
        sub: user._id
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'});
};

const decodeToken = (token) => {
    try {
        if (!token) {
            return res.status(403).send({ message: 'You are not authorized' });
        }
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        return  payload.sub
    } catch (error) {
        return {
            status: 500,
            message: 'Invalid token'
        }
    }
};

module.exports = {
    createToken,
    decodeToken
};
