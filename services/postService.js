const Post = require('../models/post');
const Secretaryship = require('../models/secretaryship');

const getPosts = async () => {
    const posts = await Post.find().populate('secretaryship');
    return posts;
}

const createPost = async (title, content, image, secretaryship) => {
    const post = new Post({ title, content, image, secretaryship });
    const secretaryshipFound = await Secretaryship.findById(secretaryship);

    if(!secretaryshipFound) throw new Error('Secretaryship not found');

    secretaryshipFound.posts.push(post._id);
    await secretaryshipFound.save();
    return await post.save();
}





module.exports = {
    getPosts,
    createPost
}