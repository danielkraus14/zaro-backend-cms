const Post = require('../models/post');
const Secretaryship = require('../models/secretaryship');
const Category = require('../models/category');
const Status = require('../models/status');

const getPosts = async () => {
    let result;
    try{
        const posts = await Post.find().populate('secretaryship').populate('category').populate('status');
        result = posts;
    }catch(error){
        throw error;
    }
    return result;
};

const getPostsBySecretaryship = async (secretaryshipId) => {
    let result;
    try{
        const posts = await Post.find({secretaryship: secretaryshipId}).populate('secretaryship').populate('category').populate('status');
        if(posts.length > 0){
            result = posts;
        }else{
            result = "No posts found";
        }
    }catch(error){
        throw error;
    }
    return result;
};

const getPostsByCategory = async (categoryId) => {
    let result;
    try{
        const posts = await Post.find({category: categoryId}).populate('secretaryship').populate('category').populate('status');
        if(posts.length > 0){
            result = posts;
        }else{
            result = "No posts found";
        }
        
    }catch(error){
        throw error;
    }
    return result;
};

const createPost = async (newPost) => {
    let result;
    try{
        
        if(!newPost.status){
            const statusFound = await Status.findOne({name: 'draft'});
            newPost.status = statusFound._id;
        }
        const { title, content, image, secretaryship, category, status } = newPost;
        const post = new Post({ title, content, image, secretaryship, category, status });
        const secretaryshipFound = await Secretaryship.findById(secretaryship);
        const categoryFound = await Category.findById(category);

        if(!secretaryshipFound) throw new Error('Secretaryship not found');
        if(!categoryFound) throw new Error('Category not found');


        secretaryshipFound.posts.push(post._id);
        categoryFound.posts.push(post._id);
        await secretaryshipFound.save();
        await categoryFound.save();
        result = await post.save();
    }catch(error){
        throw error;
    }
    return result;
}

const updatePost = async (postId, newPost) => {
    let result;
    try{
        const { title, content, image, secretaryship, category, status } = newPost;
        const post = await Post.findById(postId);
        if(!post) throw new Error('Post not found');

        if(title) post.title = title;
        if(content) post.content = content;
        if(image) post.image = image;
        if(secretaryship) {
            if(post.secretaryship != secretaryship){
                const oldSecretaryship = await Secretaryship.findById(post.secretaryship);
                const newSecretaryship = await Secretaryship.findById(secretaryship);
                if(!newSecretaryship) throw new Error('Secretaryship not found');
                newSecretaryship.posts.push(post._id);
                await newSecretaryship.save();
                oldSecretaryship.posts.pull(post._id);
                await oldSecretaryship.save();
                post.secretaryship = secretaryship;
            }
        };
        if(category){
            if(post.category != category){
                const oldCategory = await Category.findById(post.category);
                const newCategory = await Category.findById(category);
                if(!newCategory) throw new Error('Category not found');
                newCategory.posts.push(post._id);
                await newCategory.save();
                oldCategory.posts.pull(post._id);
                await oldCategory.save();
                post.category = category;}
        };
        if(status)post.status = status;

        result = await post.save();
    }catch(error){
        throw error;
    }
    return result;
};

const deletePost = async (postId) => {
    let result;
    try{
        const post = await Post.findById(postId);
        if(!post) throw new Error('Post not found');
        const secretaryship = await Secretaryship.findById(post.secretaryship);
        const category = await Category.findById(post.category);
        secretaryship.posts.pull(post._id);
        await secretaryship.save();
        category.posts.pull(post._id);
        await category.save();
        result = await post.remove();
    }catch(error){
        throw error;
    }
    return result;
};

module.exports = {
    getPosts,
    createPost,
    getPostsBySecretaryship,
    getPostsByCategory,
    updatePost,
    deletePost
}