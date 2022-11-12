const { postService } = require('../services');

const getPosts = async (req, res) => {
    try{
        const posts = await postService.getPosts();
        res.status(200).send(posts);
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPost = async (req, res) => {
    try{
        const { title, content, image, secretaryship, category} = req.body;
        const result = await postService.createPost(title, content, image, secretaryship, category);
        res.status(201).send({post: result});
    }catch(error){
        res.status(400).send({error, message: "Something went wrong"});
    }
}



module.exports = {
    getPosts,
    createPost
}