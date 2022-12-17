const User = require("../models/user");
const Post = require("../models/post");
const Secretaryship = require("../models/secretaryship");
const Category = require("../models/category");
const Tag = require("../models/tag");

const paginateOptions = {
  page: 1,
  limit: 15,
  sort: { date: -1 },
}

const getPosts = async () => {
  let result;
  try {
    await Post.paginate({}, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const getPostsBySecretaryship = async (secretaryshipId) => {
  let result;
  try {
    await Post.paginate({ secretaryship: secretaryshipId }, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const getPostsByCategory = async (categoryId) => {
  let result;
  try {
    await Post.paginate({ category: categoryId }, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const searchPosts = async (search) => {
  let result;
  try {
    let query = {};
    if (search.title) {
      query.title = { $regex: new RegExp(search.title), $options: "i" };
    }
    if(search.content){
      query.content = { $regex: new RegExp(search.content), $options: "i" };
    }
    await Post.paginate(query, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const createPost = async (
  userId,
  title,
  subtitle,
  content,
  image,
  secretaryship,
  category,
  tags
) => {
  let result;
  try {
    const post = new Post({
      userId,
      title,
      subtitle,
      content,
      image,
      secretaryship,
      category,
    });
    const userFound = await User.findById(userId);
    if (!userFound) throw new Error("User not found");

    const secretaryshipFound = await Secretaryship.findById(secretaryship);
    const categoryFound = await Category.findById(category);
    if (tags) {
      tags.map(async (tag) => {
        const tagFound = await Tag.findOne({ name: tag });
        if (!tagFound) {
          const newTag = new Tag({ name: tag });
          newTag.posts.push(post._id);
          await newTag.save();

          post.tags.push(newTag.name);
        } else {
          post.tags.push(tagFound.name);
          tagFound.posts.push(post._id);
        }
      });
    }

    if (!secretaryshipFound) throw new Error("Secretaryship not found");
    if (!categoryFound) throw new Error("Category not found");

    userFound.posts.push(post._id);
    secretaryshipFound.posts.push(post._id);
    categoryFound.posts.push(post._id);
    await userFound.save();
    await secretaryshipFound.save();
    await categoryFound.save();
    result = await post.save();
  } catch (error) {
    throw error;
  }
  return result;
};

const updatePost = async (
  postId,
  userId,
  title,
  subtitle,
  content,
  image,
  secretaryship,
  category,
  tags
) => {
  let result;
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    if (title) post.title = title;
    if (subtitle) post.subtitle = subtitle;
    if (content) post.content = content;
    if (image) post.image = image;
    if (secretaryship) {
      if (post.secretaryship != secretaryship) {
        const oldSecretaryship = await Secretaryship.findById(
          post.secretaryship
        );
        const newSecretaryship = await Secretaryship.findById(secretaryship);
        if (!newSecretaryship) throw new Error("Secretaryship not found");
        newSecretaryship.posts.push(post._id);
        await newSecretaryship.save();
        oldSecretaryship.posts.pull(post._id);
        await oldSecretaryship.save();
        post.secretaryship = secretaryship;
      }
    }
    if (category) {
      if (post.category != category) {
        const oldCategory = await Category.findById(post.category);
        const newCategory = await Category.findById(category);
        if (!newCategory) throw new Error("Category not found");
        newCategory.posts.push(post._id);
        await newCategory.save();
        oldCategory.posts.pull(post._id);
        await oldCategory.save();
        post.category = category;
      }
    }
    if (tags) {
        tags.map(async (tag) => {
            if(post.tags.indexOf(tag) == -1){
                const tagFound = await Tag.findOne({ name: tag });
                if (!tagFound) {
                    const newTag = new Tag({ name: tag });
                    newTag.posts.push(post._id);
                    await newTag.save();
                }else {
                    tagFound.posts.push(post._id);
                    await tagFound.save();
                }
            }
        });
        post.tags.map(async (tag) => {
            if(tags.indexOf(tag) == -1){
                const tagFound = await Tag.findOne({ name: tag });
                if (tagFound) {
                    tagFound.posts.pull(post._id);
                    await tagFound.save();
                }     
            }
        });
        post.tags = tags;
        
    }

    console.log(post.tags);

    result = await post.save();
  } catch (error) {
    throw error;
  }
  return result;
};

const deletePost = async (postId, userId) => {
  let result;
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    //Find the user and delete the post._id from the user's posts array
    const userFound = await User.findById(userId);
    if (!userFound) throw new Error("User not found");
    userFound.posts.pull(post._id);
    await userFound.save();
    //Find the secretaryship and delete the post._id from the secretaryship's posts array
    const secretaryshipFound = await Secretaryship.findById(post.secretaryship);
    secretaryshipFound.posts.pull(post._id);
    await secretaryshipFound.save();
    //Find the category and delete the post._id from the category's posts array
    const categoryFound = await Category.findById(post.category);
    categoryFound.posts.pull(post._id);
    await categoryFound.save();
    result = await post.remove();
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = {
  getPosts,
  createPost,
  searchPosts,
  getPostsBySecretaryship,
  getPostsByCategory,
  updatePost,
  deletePost,
};
