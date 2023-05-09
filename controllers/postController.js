const { postService } = require('../services');

const getPosts = async (req, res) => {
    try {
        const { page } = req.query;
        const posts = await postService.getPosts(page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        res.status(200).send(post);
    } catch(error) {
        res.status(400).send({error, message: 'Post not found'});
    }
};

const searchPosts = async (req, res) => {
    try {
        const result = await postService.searchPosts(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when searching posts"});
    }
};

const getPostsBySection = async (req, res) => {
    try {
        const { page } = req.query;
        const { sectionSlug } = req.params;
        const posts = await postService.getPostsBySection(sectionSlug, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByCategory = async (req, res) => {
    try {
        const { page } = req.query;
        const { categorySlug } = req.params;
        const posts = await postService.getPostsByCategory(categorySlug, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByTag = async (req, res) => {
    try {
        const { page } = req.query;
        const { tag } = req.params;
        const posts = await postService.getPostsByTag(tag, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByPosition = async (req, res) => {
    try {
        const { page } = req.query;
        const { position } = req.params;
        const posts = await postService.getPostsByPosition(position, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPost = async (req, res) => {
    try {
        const { userId, title, subtitle, flywheel, excerpt, liveSports, content, type, position, comments, imagesIds, sectionId, categoryId, tags, status } = req.body;
        const result = await postService.createPost(
            userId,
            title,
            subtitle,
            flywheel,
            excerpt,
            liveSports,
            content,
            type,
            position,
            comments,
            imagesIds,
            sectionId,
            categoryId,
            tags,
            status
        );
        res.status(201).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params
        const { userId, title, subtitle, flywheel, excerpt, liveSports, content, type, position, comments, imagesIds, sectionId, categoryId, tags, status } = req.body;
        const result = await postService.updatePost(
            postId,
            userId,
            title,
            subtitle,
            flywheel,
            excerpt,
            liveSports,
            content,
            type,
            position,
            comments,
            imagesIds,
            sectionId,
            categoryId,
            tags,
            status
        );
        res.status(200).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const result = await postService.deletePost(postId, userId);
        res.status(204).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};


module.exports = {
    getPosts,
    getPostById,
    searchPosts,
    getPostsBySection,
    getPostsByCategory,
    getPostsByTag,
    getPostsByPosition,
    createPost,
    updatePost,
    deletePost
};
