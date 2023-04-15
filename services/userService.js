const User = require('../models/user');
const Role = require('../models/role');

const getUsers = async () => {
    let result;
    try {
        result = await User.find();
    } catch(error) {
        throw error;
    }
    return result;
};

const getUserById = async (userId) => {
    let result;
    try {
        result = await User.findById(userId);
    } catch(error) {
        throw error;
    }
    return result;
};

const signUpUser = async (email, username, password, role) => {
    let result;
    try {
        const candidateUser = new User( {
            email,
            username,
            password,
            role} );

            User.findOne({email: candidateUser.email, username: candidateUser.username}, (error, user) => {
                if (error) {
                    throw error;
                }
                if (user) {
                    result = {error: 'User already exists'};
                    return result;
                }
            })
            if (role) {
                const roleFound = await Role.findOne({_id: role});
                candidateUser.role = roleFound._id;
            } else {
                const roleFound = await Role.findOne({name: 'editor'});
                candidateUser.role = roleFound._id;
            }
        result = await candidateUser.save();
    } catch(error) {
        throw error;
    }
    return result;
}

const signInUser = async (email, username, password) => {
    let result;
    try {
        const candidateUser = new User( {
            email,
            username,
            password
        } );

        const userFound = await User.findOne({email: candidateUser.email, username: candidateUser.username}).populate('role');
        if (!userFound) {
            result = {error: 'User not found'};
            return result;
        }
        const isMatch = await userFound.comparePassword(candidateUser.password);
        if (!isMatch) {
            result = {error: 'Email, username or password is incorrect'};
            return result;
        }

        result = userFound;
    } catch(error) {
        throw error;
    }
    return result;
}

const deleteUser = async (userId) => {
    let result;
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        user.isActive = false;
        result = await user.save();
    } catch(error) {
        throw error;
    }
    return result;
};

const updateUser = async (userId, email, username, password, role) => {
    let result;
    try {
        const userFound = await User.findById(userId);
        if (!userFound) {
            result = {error: 'User not found'};
            return result;
        }
        const candidateUser = new User({
            email,
            username,
            password,
            role
        });
        result = await User.findByIdAndUpdate(userId, candidateUser, { new: true });
    } catch(error) {
        throw error;
    }
    return result;
};


module.exports = {
    getUsers,
    getUserById,
    signUpUser,
    signInUser,
    deleteUser,
    updateUser
}
