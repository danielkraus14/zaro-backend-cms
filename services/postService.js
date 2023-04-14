const User = require("../models/user");
const Post = require("../models/post");
const Section = require("../models/section");
const Category = require("../models/category");
const Tag = require("../models/tag");
const File = require("../models/file");
const Record = require("../models/record");

const { deleteFile } = require('../services/fileService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
};

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

const getPostById = async (postId) => {
    let result;
    try {
        result = await Post.findById(postId);
    } catch(error) {
        throw error;
    }
    return result;
};

const getPostsBySection = async (sectionSlug) => {
    let result;
    try {
        const section = await Section.findOne({ slug: sectionSlug });
        if(!section) throw new Error('Section not found');
        await Post.paginate({ section: section._id }, paginateOptions, function (err, res) {
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

const getPostsByCategory = async (categorySlug) => {
    let result;
    try {
        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');
        await Post.paginate({ category: category._id }, paginateOptions, function (err, res) {
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
            section: sectionId,
            category: categoryId,
            createdBy: userId
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const section = await Section.findById(sectionId);
        const category = await Category.findById(categoryId);
        if (status) post.status = status;
        if (comments) post.comments = comments;
        if (type) post.type = type;
        if (position) post.position = position;
        if (tags) {
            for (const tag of tags) {
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
            };
        };

        if (imagesIds) {
            for (const imageId of imagesIds) {
                const image = await File.findById(imageId);
                if (!image) throw new Error("Image not found");
                image.post = post._id;
                await image.save();
            };
            post.images = imagesIds;
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
        await new Record({ description: post.title, operation: 'create', collectionName: 'post', objectId: post._id, user: userId }).save();
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
            for (const imageId of imagesIds) {
                if (post.images.indexOf(imageId) == -1) {
                    const image = await File.findById(imageId);
                    if (!image) throw new Error("Image not found");
                    image.post = post._id;
                    await image.save();
                };
            };
            for (const imageId of post.images) {
                if (imagesIds.indexOf(imageId) == -1) {
                    await deleteImage(imageId);
                };
            };
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
            for (const tag of tags) {
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
                };
            };
            for (const tag of post.tags) {
                if (tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (tagFound) {
                        tagFound.posts.pull(post._id);
                        await tagFound.save();
                    }
                }
            };
            post.tags = tags;
        };

        post.lastUpdatedBy = userId;
        post.lastUpdatedAt = Date.now();

        result = await post.save();
        await new Record({ description: post.title, operation: 'update', collectionName: 'post', objectId: post._id, user: userId }).save();
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
        const user = await User.findById(post.createdBy);
        if (!user) throw new Error("User not found");
        if (user.posts.indexOf(post._id) != -1) user.posts.pull(post._id);

        //Find the section and delete the post._id from the section's posts array
        const section = await Section.findById(post.section);
        if (!section) throw new Error("Section not found");
        if (section.posts.indexOf(post._id) != -1) section.posts.pull(post._id);

        //Find the category and delete the post._id from the category's posts array
        const category = await Category.findById(post.category);
        if (!category) throw new Error("Category not found");
        if (category.posts.indexOf(post._id) != -1) category.posts.pull(post._id);

        //Delete all images
        if (post.images) {
            for (const imageId of post.images) {
                await deleteFile(imageId);
            };
        };

        await category.save();
        await section.save();
        await user.save();
        const delPostId = post._id;
        const description = post.title;
        result = await post.remove();
        await new Record({ description, operation: 'delete', collectionName: 'post', objectId: delPostId, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getPosts,
    getPostById,
    getPostsBySection,
    getPostsByCategory,
    createPost,
    searchPosts,
    updatePost,
    deletePost,
};
