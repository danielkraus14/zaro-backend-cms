const Role = require('../models/role');
const Status = require('../models/status');

const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if(count > 0) return;
        const values = await Promise.all([
            new Role({name: 'comertial'}).save(),
            new Role({name: 'editor'}).save(),
            new Role({name: 'directive'}).save(),
            new Role({name: 'admin'}).save()
        ]);
        console.log(values);
    } catch (error) {
        console.error(error);
    }
}

const createStatus = async () => {
    try {
        const count = await Status.estimatedDocumentCount();
        if(count > 0) return;
        const values = await Promise.all([
            new Status({name: 'draft'}).save(),
            new Status({name: 'published'}).save(),
            new Status({name: 'programed'}).save()
        ]);
        console.log(values);
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    createRoles,
    createStatus
};