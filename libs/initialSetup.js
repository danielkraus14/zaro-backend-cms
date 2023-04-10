const Role = require('../models/role');
const FileFolder = require('../models/fileFolder');

const { createFileFolder } = require('../services/fileFolderService')

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

const createInitialFileFolders = async () => {
    try {
        const postsFileFolder = FileFolder.findOne({ name: process.env.POSTS_FILE_FOLDER_NAME });
        if (!postsFileFolder) await createFileFolder(process.env.POSTS_FILE_FOLDER_NAME);

        const printEditionsFileFolder = FileFolder.findOne({ name: process.env.PRINT_EDITIONS_FILE_FOLDER_NAME });
        if (!printEditionsFileFolder) await createFileFolder(process.env.PRINT_EDITIONS_FILE_FOLDER_NAME);

        const eventsFileFolder = FileFolder.findOne({ name: process.env.EVENTS_FILE_FOLDER_NAME });
        if (!eventsFileFolder) await createFileFolder(process.env.EVENTS_FILE_FOLDER_NAME);

        const sectionsFileFolder = FileFolder.findOne({ name: process.env.SECTIONS_FILE_FOLDER_NAME });
        if (!sectionsFileFolder) await createFileFolder(process.env.SECTIONS_FILE_FOLDER_NAME);
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    createRoles,
    createInitialFileFolders
};