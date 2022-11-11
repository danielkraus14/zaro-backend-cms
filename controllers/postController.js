const { postService } = require('../services');

const getPosts = async (req, res) => {
    try{
        const posts = await postService.getPosts();
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send(error);
    }
};

const createPost = async (req, res) => {
    try{
        const { title, content, image, secretaryship} = req.body;
        const result = await postService.createPost(title, content, image, secretaryship);
        res.status(201).send({post: result});
    }catch(error){
        res.status(400).send(error);
    }
}



module.exports = {
    getPosts,
    createPost
}