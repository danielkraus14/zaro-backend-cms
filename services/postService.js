const User = require("../models/user");
const Post = require("../models/post");
const Section = require("../models/section");
const Category = require("../models/category");
const Tag = require("../models/tag");

const { deleteFile } = require('../s3');


const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
}

const getPosts = async () => {
    let result;
    try {
        await Post.paginate({}, paginateOptions, function (err, res) {
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

const getPostsBySection = async (sectionId) => {
    let result;
    try {
        await Post.paginate({ section: sectionId }, paginateOptions, function (err, res) {
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
        await Post.paginate({ category: categoryId }, paginateOptions, function (err, res) {
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
        if (search.content) {
            query.content = { $regex: new RegExp(search.content), $options: "i" };
        }
        await Post.paginate(query, paginateOptions, function (err, res) {
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
    flywheel,
    content,
    type,
    position,
    comments,
    image,
    sectionId,
    categoryId,
    tags
) => {
    let result;
    try {
        const imagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${image}`
        const post = new Post({
            userId,
            title,
            subtitle,
            flywheel,
            content,
            type,
            position,
            comments,
            image: imagePath,
            sectionId,
            categoryId,
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const section = await Section.findById(section);
        const category = await Category.findById(category);
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

        if (!section) throw new Error("Section not found");
        if (!category) throw new Error("Category not found");

        user.posts.push(post._id);
        section.posts.push(post._id);
        category.posts.push(post._id);
        await user.save();
        await section.save();
        await category.save();
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
    sectionId,
    categoryId,
    tags
) => {
    let result;
    try {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");

        if (title) post.title = title;
        if (subtitle) post.subtitle = subtitle;
        if (content) post.content = content;
        if (image) {
            const imagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${image}`
            post.image = imagePath;
        }
        if (sectionId) {
            if (post.section != sectionId) {
                const oldSection = await Section.findById(
                    post.section
                );
                const newSection = await Section.findById(sectionId);
                if (!newSection) throw new Error("Section not found");
                newSection.posts.push(post._id);
                await newSection.save();
                oldSection.posts.pull(post._id);
                await oldSection.save();
                post.section = sectionId;
            }
        }
        if (categoryId) {
            if (post.category != categoryId) {
                const oldCategory = await Category.findById(post.category);
                const newCategory = await Category.findById(categoryId);
                if (!newCategory) throw new Error("Category not found");
                newCategory.posts.push(post._id);
                await newCategory.save();
                oldCategory.posts.pull(post._id);
                await oldCategory.save();
                post.category = categoryId;
            }
        }
        if (tags) {
            tags.map(async (tag) => {
                if (post.tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (!tagFound) {
                        const newTag = new Tag({ name: tag });
                        newTag.posts.push(post._id);
                        await newTag.save();
                    } else {
                        tagFound.posts.push(post._id);
                        await tagFound.save();
                    }
                }
            });
            post.tags.map(async (tag) => {
                if (tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (tagFound) {
                        tagFound.posts.pull(post._id);
                        await tagFound.save();
                    }
                }
            });
            post.tags = tags;
        }


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
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        user.posts.pull(post._id);
        await user.save();
        //Find the section and delete the post._id from the section's posts array
        const section = await Section.findById(post.section);
        section.posts.pull(post._id);
        await section.save();
        //Find the category and delete the post._id from the category's posts array
        const category = await Category.findById(post.category);
        category.posts.pull(post._id);
        await category.save();
        //Delete image from S3 server
        if (post.image) {
            await deleteFile(post.image);
        }

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
    getPostsBySection,
    getPostsByCategory,
    updatePost,
    deletePost,
};
