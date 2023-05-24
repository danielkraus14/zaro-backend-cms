const User = require('../../models/user');


const isAdmin = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate('role');
    if (user.role.name !== 'admin') {
        return res.status(403).json({ message: 'Require admin role' });
    }
    next();
}

module.exports = isAdmin;