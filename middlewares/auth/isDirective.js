const User = require('../../models/user');


const isDirective = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate('role');
    if (user.role.name == 'admin') {
        next();
        return;
    }
    if (user.role.name !== 'directive') {
        return res.status(403).json({ message: 'Require directive role' });
    }
    next();
}

module.exports = isDirective;