const Role = require('../../models/role');
const User = require('../../models/user');


const isEditor = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate('role');
    const role = await Role.findById(user.role._id);
    if(role.name == 'admin'){
        next();
        return;
    }
    if(role.name == 'directive'){
        next();
        return;
    }
    if(role.name !== 'editor'){
        return res.status(403).json({message: 'Require editor role'});
    }
    next();
}

module.exports = isEditor;