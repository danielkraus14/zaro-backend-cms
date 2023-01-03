const { postService } = require('../services');
const {uploadFile, readFile, getFiles, deleteFile} = require('../s3');
const fs = require('fs-extra');

const getPosts = async (req, res) => {
    try{
        const posts = await postService.getPosts();
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPostsBySection = async (req, res) => {
    try{
        const posts = await postService.getPostsBySection(req.params.sectionId);
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
        const {userId, title, subtitle, content, image, section, category, tags} = req.body;
        const result = await postService.createPost(userId, title, subtitle, content, image, section, category, tags);
        res.status(201).send({post: result});
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePost = async (req, res) => {
    try{
        const { userId, title, subtitle, content, image, section, category, tags} = req.body;
        const result = await postService.updatePost(req.params.postId, userId, title, subtitle, content, image, section, category, tags);
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

const getMedia = async (req, res) => {
    try{
        const result = await getFiles();
        res.status(200).send(result);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong when getting media"});
    }
};

const searchPosts = async (req, res) => {
    try{
        const result = await postService.searchPosts(req.query);
        res.status(200).send(result);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong when searching posts"});
    }
};

//Media controller

const uploadMedia = async (req, res) => {
    try{
        console.log(req.files);
        const result = await uploadFile(req.files.file);
        await fs.unlink(req.files.file.tempFilePath)

        res.status(200).send({message: "Media uploaded", file: result});

    }catch(error){
        res.status(400).send({error, message: "Something went wrong when uploading media"});
    }
};

const getMediaByName = async (req, res) => {
    try{
        console.log(req.query);
        const result = await readFile(req.query.fileName);
        res.status(200).send(result);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong when getting media"});
    }
};

const deleteMedia = async (req, res) => {
    try{
        const result = await deleteFile(req.query.fileName);
        res.status(200).send(result);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong when deleting media"});
    }
};



module.exports = {
    getPosts,
    getPostsBySection,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost,
    getMedia,
    searchPosts,
    uploadMedia,
    getMediaByName,
    deleteMedia,
}