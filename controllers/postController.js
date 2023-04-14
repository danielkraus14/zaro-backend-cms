const { postService } = require('../services');

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts();
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
        const posts = await postService.getPostsBySection(req.params.sectionSlug);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByCategory = async (req, res) => {
    try {
        const posts = await postService.getPostsByCategory(req.params.categorySlug);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPost = async (req, res) => {
    try {
        const { userId, title, subtitle, flywheel, content, type, position, comments, imagesIds, sectionId, categoryId, tags, status } = req.body;
        const result = await postService.createPost(
            userId,
            title,
            subtitle,
            flywheel,
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
        const { userId, title, subtitle, flywheel, content, type, position, comments, imagesIds, sectionId, categoryId, tags, status } = req.body;
        const result = await postService.updatePost(
            postId,
            userId,
            title,
            subtitle,
            flywheel,
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
    createPost,
    updatePost,
    deletePost
};
