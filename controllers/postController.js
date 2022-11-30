const { postService } = require('../services');

const getPosts = async (req, res) => {
    try{
        const posts = await postService.getPosts();
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsBySecretaryship = async (req, res) => {
    try{
        const posts = await postService.getPostsBySecretaryship(req.params.secretaryshipId);
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsByCategory = async (req, res) => {
    try{
        const posts = await postService.getPostsByCategory(req.params.categoryId);
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPost = async (req, res) => {
    try{
        const {userId, title, subtitle, content, image, secretaryship, category, tags} = req.body;
        const result = await postService.createPost(userId, title, subtitle, content, image, secretaryship, category, tags);
        res.status(201).send({post: result});
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePost = async (req, res) => {
    try{
        const { userId, title, subtitle, content, image, secretaryship, category, tags} = req.body;
        const result = await postService.updatePost(req.params.postId, userId, title, subtitle, content, image, secretaryship, category, tags);
        res.status(200).send({post: result});
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deletePost = async (req, res) => {
    try{
        const userId = req.body.userId;
        const result = await postService.deletePost(req.params.postId, userId);
        res.status(200).send({post: result});
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

module.exports = {
    getPosts,
    getPostsBySecretaryship,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost
}