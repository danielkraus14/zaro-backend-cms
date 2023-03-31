const express = require('express');
const routes = express.Router();

// Import controllers
const {
    userController,
    postController,
    sectionController,
    categoryController,
    tagController,
    funeralNoticeController
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
routes.get('/section/:sectionId', sectionController.getSectionById);
routes.post('/sections/create', sectionController.createSection);
routes.put('/sections/update/:sectionId', sectionController.updateSection);
routes.delete('/sections/delete/:sectionId', sectionController.deleteSection);

// Categories
routes.get('/categories', categoryController.getCategories);
routes.get('/categories/:categoryId', categoryController.getCategoryById);
routes.post('/categories/create', categoryController.createCategory);
routes.put('/categories/update/:categoryId', categoryController.updateCategory);
routes.delete('/categories/delete/:categoryId', categoryController.deleteCategory);

// Posts
routes.get('/posts', postController.getPosts);
routes.get('/posts/search', postController.searchPosts);
routes.get('/posts/section/:sectionId', postController.getPostsBySection);
routes.get('/posts/category/:categoryId', postController.getPostsByCategory);
routes.post('/posts/create',  postController.createPost);
routes.put('/posts/update/:postId', postController.updatePost);
routes.delete('/posts/delete/:postId', postController.deletePost);

// Media
routes.get('/media', postController.getMedia)
routes.get('/media/get', postController.getMediaByName)
routes.post('/media/upload', postController.uploadMedia);
routes.delete('/media/delete', postController.deleteMedia);

// Tags
routes.get('/tags', tagController.getTags);
routes.get('/tags/:tagName', tagController.getTagsByName);
routes.post('/tags/create', tagController.createTag);

// Funeral Notices
routes.get('/funeral-notices', funeralNoticeController.getFuneralNotices);
routes.get('/funeral-notices/search', funeralNoticeController.searchFuneralNotice);
routes.get('/funeral-notices/:religion', funeralNoticeController.getFuneralNoticesByReligion);
routes.get('/funeral-notices/:date', funeralNoticeController.getFuneralNoticesByDate);
routes.get('/funeral-notices/:status', funeralNoticeController.getFuneralNoticesByStatus);
routes.post('/funeral-notices/create',  funeralNoticeController.createFuneralNotice);
routes.put('/funeral-notices/update/:funeralNoticeId', funeralNoticeController.updateFuneralNotice);
routes.delete('/funeral-notices/delete/:funeralNoticeId', funeralNoticeController.deleteFuneralNotice);

module.exports = routes;