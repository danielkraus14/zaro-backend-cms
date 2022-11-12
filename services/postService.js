const Post = require('../models/post');
const Secretaryship = require('../models/secretaryship');
const Category = require('../models/category');

const getPosts = async () => {
    const posts = await Post.find().populate('secretaryship').populate('category');
    return posts;
}

const createPost = async (title, content, image, secretaryship, category) => {
    const post = new Post({ title, content, image, secretaryship, category });
    const secretaryshipFound = await Secretaryship.findById(secretaryship);
    const categoryFound = await Category.findById(category);

    if(!secretaryshipFound) throw new Error('Secretaryship not found');
    if(!categoryFound) throw new Error('Category not found');

    secretaryshipFound.posts.push(post._id);
    categoryFound.posts.push(post._id);
    await secretaryshipFound.save();
    await categoryFound.save();
    return await post.save();
}





module.exports = {
    getPosts,
    createPost
}