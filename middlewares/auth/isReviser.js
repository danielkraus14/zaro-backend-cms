const User = require('../../models/user');


const isReviser = async (req, res, next) => {
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
    if (user.role.name !== 'reviser') {
        return res.status(403).json({ message: 'Require reviser role' });
    }
    next();
}

module.exports = isReviser;