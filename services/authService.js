const jwt = require('jwt-simple');
const {DateTime} = require('luxon');


const createToken = (user) => {
    const payload = {
        sub: user._id,
        iat: DateTime.now().toMillis(),
        exp: DateTime.now().plus({days: 14}).toMillis()
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

const decodeToken = (token) => {
    try {
        const payload = jwt.decode(token, process.env.SECRET_KEY);
        if(payload.exp <= DateTime.now().toMillis()){
            return {
                status: 401,
                message: 'Token has expired'
            }
        }
            return  payload.sub
    } catch (error) {
        return {
            status: 500,
            message: 'Invalid token'
        }
    }
}

module.exports = {
    createToken,
    decodeToken
};
