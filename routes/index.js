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
    recordController
} = require('../controllers');

// Import Auth Middlewares
const {
    isAuth,
    isAdmin,
    isDirective,
    isComertial
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
routes.get('/posts/search', postController.searchPosts);
routes.get('/posts/section/:sectionSlug', postController.getPostsBySection);
routes.get('/posts/category/:categorySlug', postController.getPostsByCategory);
routes.get('/posts/tags/:tag', postController.getPostsByTag);
routes.post('/posts/create', isAuth, postController.createPost);
routes.put('/posts/update/:postId', isAuth, postController.updatePost);
routes.delete('/posts/delete/:postId', isAuth, postController.deletePost);

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

// Files - Agregar epígrafe
routes.get('/files', fileController.getFiles);
routes.get('/files/:fileId', fileController.readFileById);
routes.post('/files/create', isAuth, fileController.createFile);
routes.put('/files/update/:fileId', isAuth, fileController.updateFile);
routes.delete('/files/delete/:fileId', isAuth, fileController.deleteFile);

// Records - Agregar qué campo se modificó
routes.get('/records', isAuth, isDirective, recordController.getRecords);
routes.get('/records/search', isAuth, isDirective, recordController.searchRecords);
routes.get('/records/object/:recordId', isAuth, isDirective, recordController.getObjectOfRecord);

module.exports = routes;
