const Role = require('../../models/role');
const User = require('../../models/user');


const isComertial = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate('role');
    if (user.role.name == 'admin') {
        next();
        return;
    }
    if (user.role.name == 'directive') {
        next();
        return;
    }
    if (user.role.name !== 'comertial') {
        return res.status(403).json({ message: 'Require comertial role' });
    }
    next();
}

module.exports = isComertial;