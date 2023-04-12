const express = require('express');
const routes = express.Router();

// Import controllers
const {
    userController,
    postController,
    sectionController,
    categoryController,
    tagController,
    funeralNoticeController,
    printEditionController,
    fileController,
    fileFolderController,
    venueController,
    eventController
} = require('../controllers');

// Import Auth Middlewares
const {
    isAuth,
    isAdmin,
    isDirective,
    isComertial
} = require('../middlewares');

// Schema validation
const { userSchema } = require('../controllers/schemas');

// Routes

// Users
routes.post('/signup', userSchema, userController.signUpUser);
routes.post('/signin', userSchema, userController.signInUser);
routes.put('/update/:userId', userController.updateUser);
routes.delete('/delete/:userId',  userController.deleteUser);

// Sections
routes.get('/sections', sectionController.getSections);
routes.get('/sections/:sectionSlug', sectionController.getSectionBySlug);
routes.post('/sections/create', sectionController.createSection);
routes.put('/sections/update/:sectionSlug', sectionController.updateSection);
routes.delete('/sections/delete/:sectionSlug', sectionController.deleteSection);

// Categories
routes.get('/categories', categoryController.getCategories);
routes.get('/categories/:categorySlug', categoryController.getCategoryBySlug);
routes.post('/categories/create', categoryController.createCategory);
routes.put('/categories/update/:categorySlug', categoryController.updateCategory);
routes.delete('/categories/delete/:categorySlug', categoryController.deleteCategory);

// Posts
routes.get('/posts', postController.getPosts);
routes.get('/posts/id/:postId', postController.getPostById);
routes.get('/posts/search', postController.searchPosts);
routes.get('/posts/section/:sectionSlug', postController.getPostsBySection);
routes.get('/posts/category/:categorySlug', postController.getPostsByCategory);
routes.post('/posts/create',  postController.createPost);
routes.put('/posts/update/:postId', postController.updatePost);
routes.delete('/posts/delete/:postId', postController.deletePost);

// Tags
routes.get('/tags', tagController.getTags);
routes.get('/tags/:tagName', tagController.getTagsByName);
routes.post('/tags/create', tagController.createTag);

// Funeral Notices
routes.get('/funeral-notices', funeralNoticeController.getFuneralNotices);
routes.get('/funeral-notices/search', funeralNoticeController.searchFuneralNotice);
routes.get('/funeral-notices/religion/:religion', funeralNoticeController.getFuneralNoticesByReligion);
routes.get('/funeral-notices/date/:date', funeralNoticeController.getFuneralNoticesByDate);
routes.get('/funeral-notices/status/:status', funeralNoticeController.getFuneralNoticesByStatus);
routes.post('/funeral-notices/create',  funeralNoticeController.createFuneralNotice);
routes.put('/funeral-notices/update/:funeralNoticeId', funeralNoticeController.updateFuneralNotice);
routes.delete('/funeral-notices/delete/:funeralNoticeId', funeralNoticeController.deleteFuneralNotice);

// Print Editions
routes.get('/print-edition', printEditionController.getPrintEditions);
routes.get('/print-edition/date/:date', printEditionController.getPrintEditionsByDate);
routes.post('/print-edition/create',  printEditionController.createPrintEdition);
routes.put('/print-edition/update/:postId', printEditionController.updatePrintEdition);
routes.delete('/print-edition/delete/:postId', printEditionController.deletePrintEdition);

// Venues
routes.get('/venues', venueController.getVenues);
routes.get('/venues/:venueId', venueController.getVenueById);
routes.post('/venues/create', venueController.createVenue);
routes.put('/venues/update/:venueId', venueController.updateVenue);

// Events
routes.get('/events', eventController.getEvents);
routes.get('/events/search', eventController.searchEvents);
routes.get('/events/venue/:venueId', eventController.getEventsByVenue);
routes.post('/events/create',  eventController.createEvent);
routes.put('/events/update/:eventId', eventController.updateEvent);
routes.delete('/events/delete/:eventId', eventController.deleteEvent);

// File Folders
routes.get('/file-folders', fileFolderController.getFileFolders);
routes.get('/file-folders/:fileFolderSlug', fileFolderController.getFileFolderBySlug);
routes.post('/file-folders/create', fileFolderController.createFileFolder);
routes.put('/file-folders/update/:fileFolderSlug', fileFolderController.updateFileFolder);
routes.delete('/file-folders/delete/:fileFolderSlug', fileFolderController.deleteFileFolder);

// Files
routes.get('/files', fileController.getFiles);
routes.get('/files/:fileId', fileController.readFileById);
routes.post('/files/create', fileController.createFile);
routes.delete('/files/delete/:fileId', fileController.deleteFile);

module.exports = routes;
