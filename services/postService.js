const User = require("../models/user");
const Post = require("../models/post");
const Section = require("../models/section");
const Category = require("../models/category");
const Tag = require("../models/tag");
const File = require("../models/file");

const { deleteFile } = require('../services/fileService');

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
    imagesIds,
    sectionId,
    categoryId,
    tags,
    status
) => {
    let result;
    try {
        const post = new Post({
            title,
            subtitle,
            flywheel,
            content,
            type,
            position,
            comments,
            images: imagesIds,
            section: sectionId,
            category: categoryId,
            createdBy: userId,
            status
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
        };

        if (imagesIds) {
            imagesIds.map(async (imageId) => {
                const image = await File.findById(imageId);
                if (!image) throw new Error("Image not found");
                image.post = post._id;
                await image.save();
            });
        };

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
    flywheel,
    content,
    type,
    position,
    comments,
    imagesIds,
    sectionId,
    categoryId,
    tags,
    status
) => {
    let result;
    try {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");

        if (title) post.title = title;
        if (subtitle) post.subtitle = subtitle;
        if (flywheel) post.flywheel = flywheel;
        if (content) post.content = content;
        if (type) post.type = type;
        if (position) post.position = position;
        if (comments) post.comments = comments;
        if (status) post.status = status;
        if (imagesIds) {
            imagesIds.map(async (imageId) => {
                if (post.images.indexOf(imageId) == -1) {
                    const image = await File.findById(imageId);
                    if (!image) throw new Error("Image not found");
                    image.post = post._id;
                    await image.save();
                };
            });
            post.images = imagesIds;
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
        };

        post.lastUpdatedBy = userId;
        post.lastUpdatedAt = new Date.now();

        result = await post.save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deletePost = async (postId) => {
    let result;
    try {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");

        //Find the user and delete the post._id from the user's posts array
        const user = await User.findById(post.createdBy);
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

        //Delete all images
        if (post.images) {
            post.images.map(async (imageId) => {
                await deleteFile(imageId);
            });
        };

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
