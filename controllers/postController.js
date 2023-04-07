const { postService } = require('../services');

const getPosts = async (req, res) => {
    try{
        const posts = await postService.getPosts();
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsBySection = async (req, res) => {
    try{
        const posts = await postService.getPostsBySection(req.params.sectionId);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByCategory = async (req, res) => {
    try{
        const posts = await postService.getPostsByCategory(req.params.categoryId);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPost = async (req, res) => {
    try{
        const { userId, title, subtitle, flywheel, content, type, position, comments, image, section, category, tags } = req.body;
        const result = await postService.createPost(userId, title, subtitle, flywheel, content, type, position, comments, image, section, category, tags);
        res.status(201).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePost = async (req, res) => {
    try{
        const { userId, title, subtitle, content, image, section, category, tags } = req.body;
        const result = await postService.updatePost(req.params.postId, userId, title, subtitle, content, image, section, category, tags);
        res.status(200).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deletePost = async (req, res) => {
    try{
        const userId = req.body.userId;
        const result = await postService.deletePost(req.params.postId, userId);
        res.status(200).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const searchPosts = async (req, res) => {
    try{
        const result = await postService.searchPosts(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when searching posts"});
    }
};


module.exports = {
    getPosts,
    getPostsBySection,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
};