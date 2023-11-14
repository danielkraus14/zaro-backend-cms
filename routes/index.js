const express = require('express');
const routes = express.Router();

// Import controllers
const {
    userController,
    roleController,
    postController,
    sectionController,
    categoryController,
    tagController,
    funeralNoticeController,
    printEditionController,
    fileController,
    fileFolderController,
    venueController,
    eventController,
    recordController,
    adServerController
} = require('../controllers');

// Import Auth Middlewares
const {
    isAuth,
    isAdmin,
    isDirective,
    isComertial,
    isReviser
} = require('../middlewares');

// Schema validation
const { signUpSchema, signInSchema } = require('../controllers/schemas');

// Routes

// Roles
routes.get('/roles', isAuth, isAdmin, roleController.getRoles);
routes.get('/roles/id/:roleId', isAuth, isAdmin, roleController.getRoleById);

// Users
routes.get('/users', isAuth, isAdmin, userController.getUsers);
routes.get('/users/id/:userId', isAuth, isAdmin, userController.getUserById);
routes.post('/signup', isAuth, isAdmin, signUpSchema, userController.signUpUser);
routes.post('/signin', signInSchema, userController.signInUser);
routes.put('/users/update/:userId', isAuth, isAdmin, userController.updateUser);
routes.delete('/users/delete/:userId', isAuth, isAdmin, userController.deleteUser);

// Sections
routes.get('/sections', sectionController.getSections);
routes.get('/sections/:sectionSlug', sectionController.getSectionBySlug);
routes.post('/sections/create', isAuth, isAdmin, sectionController.createSection);
routes.put('/sections/update/:sectionSlug', isAuth, isAdmin, sectionController.updateSection);
routes.delete('/sections/delete/:sectionSlug', isAuth, isAdmin, sectionController.deleteSection);

// Categories
routes.get('/categories', categoryController.getCategories);
routes.get('/categories/:categorySlug', categoryController.getCategoryBySlug);
routes.post('/categories/create', isAuth, isAdmin, categoryController.createCategory);
routes.put('/categories/update/:categorySlug', isAuth, isAdmin, categoryController.updateCategory);
routes.delete('/categories/delete/:categorySlug', isAuth, isAdmin, categoryController.deleteCategory);

// Posts
routes.get('/posts', postController.getPosts);
routes.get('/posts/id/:postId', postController.getPostById);
routes.get('/posts/slug/:postSlug', postController.getPostBySlug);
routes.get('/posts/search', postController.searchPosts);
routes.get('/posts/section/:sectionSlug', postController.getPostsBySection);
routes.get('/posts/category/:categorySlug', postController.getPostsByCategory);
routes.get('/posts/creator/:userId', postController.getPostsByCreator);
routes.get('/posts/tags/:tag', postController.getPostsByTag);
routes.get('/posts/position/:position', postController.getPostsByPosition);
routes.get('/posts/status/:status', isAuth, postController.getPostsByStatus);
routes.post('/posts/create', isAuth, postController.createPost);
routes.put('/posts/update/:postId', isAuth, postController.updatePost);
routes.delete('/posts/delete/:postId', isAuth, isReviser, postController.deletePost);

// Tags
routes.get('/tags', tagController.getTags);
routes.get('/tags/:tagName', tagController.getTagsByName);
routes.post('/tags/create', isAuth, tagController.createTag);
routes.put('/tags/update/:oldName', isAuth, tagController.updateTag);

// Funeral Notices
routes.get('/funeral-notices', funeralNoticeController.getFuneralNotices);
routes.get('/funeral-notices/id/:funeralNoticeId', funeralNoticeController.getFuneralNoticeById);
routes.get('/funeral-notices/search', funeralNoticeController.searchFuneralNotice);
routes.get('/funeral-notices/religion/:religion', funeralNoticeController.getFuneralNoticesByReligion);
routes.get('/funeral-notices/date/:date', funeralNoticeController.getFuneralNoticesByDate);
routes.get('/funeral-notices/status/:status', funeralNoticeController.getFuneralNoticesByStatus);
routes.post('/funeral-notices/create', isAuth, funeralNoticeController.createFuneralNotice);
routes.put('/funeral-notices/update/:funeralNoticeId', isAuth, funeralNoticeController.updateFuneralNotice);
routes.delete('/funeral-notices/delete/:funeralNoticeId', isAuth, funeralNoticeController.deleteFuneralNotice);

// Print Editions
routes.get('/print-editions', printEditionController.getPrintEditions);
routes.get('/print-editions/id/:printEditionId', printEditionController.getPrintEditionById);
routes.get('/print-editions/date/:date', printEditionController.getPrintEditionsByDate);
routes.get('/print-editions/tags/:tag', printEditionController.getPrintEditionsByTag);
routes.post('/print-editions/create', isAuth, printEditionController.createPrintEdition);
routes.put('/print-editions/update/:printEditionId', isAuth, printEditionController.updatePrintEdition);
routes.delete('/print-editions/delete/:printEditionId', isAuth, printEditionController.deletePrintEdition);

// Venues
routes.get('/venues', venueController.getVenues);
routes.get('/venues/:venueSlug', venueController.getVenueBySlug);
routes.post('/venues/create', isAuth, venueController.createVenue);
routes.put('/venues/update/:venueSlug', isAuth, venueController.updateVenue);
routes.delete('/venues/delete/:venueSlug', isAuth, isAdmin, venueController.deleteVenue);

// Events
routes.get('/events', eventController.getEvents);
routes.get('/events/id/:eventId', eventController.getEventById);
routes.get('/events/search', eventController.searchEvents);
routes.get('/events/venue/:venueSlug', eventController.getEventsByVenue);
routes.post('/events/create', isAuth, eventController.createEvent);
routes.put('/events/update/:eventId', isAuth, eventController.updateEvent);
routes.delete('/events/delete/:eventId', isAuth, eventController.deleteEvent);

// File Folders
routes.get('/file-folders', fileFolderController.getFileFolders);
routes.get('/file-folders/:fileFolderSlug', fileFolderController.getFileFolderBySlug);
routes.post('/file-folders/create', isAuth, fileFolderController.createFileFolder);
routes.put('/file-folders/update/:fileFolderSlug', isAuth, fileFolderController.updateFileFolder);
routes.delete('/file-folders/delete/:fileFolderSlug', isAuth, fileFolderController.deleteFileFolder);

// Files
routes.get('/files', fileController.getFiles);
routes.get('/files/:fileId', fileController.readFileById);
routes.post('/files/create', isAuth, fileController.createFile);
routes.put('/files/update/:fileId', isAuth, fileController.updateFile);
routes.delete('/files/delete/:fileId', isAuth, fileController.deleteFile);

// Records
routes.get('/records', isAuth, isDirective, recordController.getRecords);
routes.get('/records/search', isAuth, isDirective, recordController.searchRecords);
routes.get('/records/object/:recordId', isAuth, isDirective, recordController.getObjectOfRecord);

// Ad Servers
routes.get('/ad-servers', adServerController.getAdServers);
routes.get('/ad-servers/id/:adServerId', adServerController.getAdServerById);
routes.get('/ad-servers/search', adServerController.searchAdServers);
routes.get('/ad-servers/position/:position', adServerController.getAdServersByPosition);
routes.get('/ad-servers/status/:status', adServerController.getAdServersByStatus);
routes.get('/ad-servers/public', adServerController.publicGetAdServers);
routes.get('/ad-servers/public/:position', adServerController.publicGetAdServersByPosition);
routes.get('/ad-servers/position-types', adServerController.getPositionTypes);
routes.post('/ad-servers/create', isAuth, isComertial, adServerController.createAdServer);
routes.put('/ad-servers/update/:adServerId', isAuth, isComertial, adServerController.updateAdServer);
routes.delete('/ad-servers/delete/:adServerId', isAuth, isComertial, adServerController.deleteAdServer);

module.exports = routes;
