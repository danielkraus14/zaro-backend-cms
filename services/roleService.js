const Role = require('../models/role');

const getRoles = async () => {
    let result;
    try {
        result = await Role.find();
    } catch(error) {
        throw error;
    }
    return result;
};

const getRoleById = async (roleId) => {
    let result;
    try {
        result = await Role.findById(roleId);
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getRoles,
    getRoleById
}
