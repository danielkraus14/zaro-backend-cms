const { roleService } = require('../services');

const getRoles = async (req, res) => {
    let result;
    try {
        result = await roleService.getRoles();
        res.status(200).send(result);
    } catch(error) {
        res.status(404).send({error, message: 'Role not found'});
    }
};

const getRoleById = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await roleService.getRoleById(roleId);
        res.status(200).send(role);
    } catch(error) {
        res.status(404).send({error, message: 'Role not found'});
    }
};

module.exports = {
    getRoles,
    getRoleById
};
