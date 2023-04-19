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

// Roles - Admin
routes.get('/roles', isAuth, roleController.getRoles);
routes.get('/roles/id/:roleId', isAuth, roleController.getRoleById);

// Users - Admin
routes.get('/users', isAuth, userController.getUsers);
routes.get('/users/id/:userId', isAuth, userController.getUserById);
routes.post('/signup', signUpSchema, userController.signUpUser);
routes.post('/signin', signInSchema, userController.signInUser);
routes.put('/users/update/:userId', isAuth, userController.updateUser);
routes.delete('/users/delete/:userId', isAuth, userController.deleteUser);

// Sections - Admin
routes.get('/sections', isAuth, sectionController.getSections);
routes.get('/sections/:sectionSlug', isAuth, sectionController.getSectionBySlug);
routes.post('/sections/create', isAuth, sectionController.createSection);
routes.put('/sections/update/:sectionSlug', isAuth, sectionController.updateSection);
routes.delete('/sections/delete/:sectionSlug', isAuth, sectionController.deleteSection);

// Categories - Admin
routes.get('/categories', isAuth, categoryController.getCategories);
routes.get('/categories/:categorySlug', isAuth, categoryController.getCategoryBySlug);
routes.post('/categories/create', isAuth, categoryController.createCategory);
routes.put('/categories/update/:categorySlug', isAuth, categoryController.updateCategory);
routes.delete('/categories/delete/:categorySlug', isAuth, categoryController.deleteCategory);

// Posts - Editores - Agregar filtro por tags
routes.get('/posts', isAuth, postController.getPosts);
routes.get('/posts/id/:postId', isAuth, postController.getPostById);
routes.get('/posts/search', isAuth, postController.searchPosts);
routes.get('/posts/section/:sectionSlug', isAuth, postController.getPostsBySection);
routes.get('/posts/category/:categorySlug', isAuth, postController.getPostsByCategory);
routes.post('/posts/create', isAuth, postController.createPost);
routes.put('/posts/update/:postId', isAuth, postController.updatePost);
routes.delete('/posts/delete/:postId', isAuth, postController.deletePost);

// Tags - Editores
routes.get('/tags', isAuth, tagController.getTags);
routes.get('/tags/:tagName', isAuth, tagController.getTagsByName);
routes.post('/tags/create', isAuth, tagController.createTag);

// Funeral Notices - Editores
routes.get('/funeral-notices', isAuth, funeralNoticeController.getFuneralNotices);
routes.get('/funeral-notices/id/:funeralNoticeId', isAuth, funeralNoticeController.getFuneralNoticeById);
routes.get('/funeral-notices/search', isAuth, funeralNoticeController.searchFuneralNotice);
routes.get('/funeral-notices/religion/:religion', isAuth, funeralNoticeController.getFuneralNoticesByReligion);
routes.get('/funeral-notices/date/:date', isAuth, funeralNoticeController.getFuneralNoticesByDate);
routes.get('/funeral-notices/status/:status', isAuth, funeralNoticeController.getFuneralNoticesByStatus);
routes.post('/funeral-notices/create', isAuth, funeralNoticeController.createFuneralNotice);
routes.put('/funeral-notices/update/:funeralNoticeId', isAuth, funeralNoticeController.updateFuneralNotice);
routes.delete('/funeral-notices/delete/:funeralNoticeId', isAuth, funeralNoticeController.deleteFuneralNotice);

// Print Editions - Editores - Agregar filtro por tags
routes.get('/print-editions', isAuth, printEditionController.getPrintEditions);
routes.get('/print-editions/id/:printEditionId', isAuth, printEditionController.getPrintEditionById);
routes.get('/print-editions/date/:date', isAuth, printEditionController.getPrintEditionsByDate);
routes.post('/print-editions/create', isAuth, printEditionController.createPrintEdition);
routes.put('/print-editions/update/:printEditionId', isAuth, printEditionController.updatePrintEdition);
routes.delete('/print-editions/delete/:printEditionId', isAuth, printEditionController.deletePrintEdition);

// Venues - Editores
routes.get('/venues', isAuth, venueController.getVenues);
routes.get('/venues/:venueSlug', isAuth, venueController.getVenueBySlug);
routes.post('/venues/create', isAuth, venueController.createVenue);
routes.put('/venues/update/:venueSlug', isAuth, venueController.updateVenue);
routes.delete('/venues/delete/:venueSlug', isAuth, venueController.deleteVenue);

// Events - Editores
routes.get('/events', isAuth, eventController.getEvents);
routes.get('/events/id/:eventId', isAuth, eventController.getEventById);
routes.get('/events/search', isAuth, eventController.searchEvents);
routes.get('/events/venue/:venueSlug', isAuth, eventController.getEventsByVenue);
routes.post('/events/create', isAuth, eventController.createEvent);
routes.put('/events/update/:eventId', isAuth, eventController.updateEvent);
routes.delete('/events/delete/:eventId', isAuth, eventController.deleteEvent);

// File Folders - Editores
routes.get('/file-folders', isAuth, fileFolderController.getFileFolders);
routes.get('/file-folders/:fileFolderSlug', isAuth, fileFolderController.getFileFolderBySlug);
routes.post('/file-folders/create', isAuth, fileFolderController.createFileFolder);
routes.put('/file-folders/update/:fileFolderSlug', isAuth, fileFolderController.updateFileFolder);
routes.delete('/file-folders/delete/:fileFolderSlug', isAuth, fileFolderController.deleteFileFolder);

// Files - Editores - Agregar epígrafe
routes.get('/files', isAuth, fileController.getFiles);
routes.get('/files/:fileId', isAuth, fileController.readFileById);
routes.post('/files/create', isAuth, fileController.createFile);
routes.delete('/files/delete/:fileId', isAuth, fileController.deleteFile);

// Records - Directivos - Agregar qué campo se modificó
routes.get('/records', isAuth, recordController.getRecords);
routes.get('/records/search', isAuth, recordController.searchRecords);
routes.get('/records/object/:recordId', isAuth, recordController.getObjectOfRecord);

module.exports = routes;
