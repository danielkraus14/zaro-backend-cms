const User = require("../models/user");
const Post = require("../models/post");
const Section = require("../models/section");
const Category = require("../models/category");
const Tag = require("../models/tag");
const File = require("../models/file");
const Record = require("../models/record");

const { deleteFile } = require('../services/fileService');

const { mongoose } = require("mongoose");
const dateFns = require('date-fns');

const paginateOptions = {
    limit: 15,
    sort: { createdAt: -1 },
    populate: [
        {
            path: 'images',
            select: ['url', 'filename', 'epigraph']
        },
        {
            path: 'section',
            select: ['name', 'slug', 'image']
        },
        {
            path: 'category',
            select: ['name', 'slug']
        },
        {
            path: 'createdBy',
            select: ['username', 'email']
        },
        {
            path: 'lastUpdatedBy',
            select: ['username', 'email']
        }
    ]
};

const getPosts = async (page) => {
    let result;
    paginateOptions.page = page ? page : 1;
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

const getPostBySlug = async (postSlug) => {
    let result;
    try {
        result = await Post.findOne({ slug: postSlug }).populate(paginateOptions.populate);
    } catch(error) {
        throw error;
    }
    return result;
};

const getPostsBySection = async (sectionSlug, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
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

const getPostsByCategory = async (categorySlug, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
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

const getPostsByTag = async (tag, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await Post.paginate({ tags: tag }, paginateOptions, function (err, res) {
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

const getPostsByPosition = async (position, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await Post.paginate({ position }, paginateOptions, function (err, res) {
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

const getPostsByStatus = async (status, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        await Post.paginate({ status }, paginateOptions, function (err, res) {
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
    paginateOptions.page = search.page ? search.page : 1;
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

const getValidSlug = async (title) => {
    const year = dateFns.format(new Date(), 'yyyy');
    const month = dateFns.format(new Date(), 'MM');
    const day = dateFns.format(new Date(), 'dd');

    let slug = `${year}-${month}-${day}-${title.toLowerCase().replace(/ /g, '-')}`;
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let slugFound = await Post.findOne({ slug });
    let count = 0;

    while (slugFound) {
        count++;
        slug = slug + '-' + count.toString();
        slugFound = await Post.findOne({ slug });
    };
    return slug;
};

const createPost = async (
    userId,
    title,
    subtitle,
    flywheel,
    excerpt,
    liveSports,
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
            content,
            section: sectionId,
            category: categoryId,
            createdBy: userId
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        post.slug = await getValidSlug(title);

        const section = await Section.findById(sectionId);
        const category = await Category.findById(categoryId);
        if (subtitle) post.subtitle = subtitle;
        if (flywheel) post.flywheel = flywheel;
        if (excerpt) post.excerpt = excerpt;
        if (liveSports) post.liveSports = liveSports;
        if (status) post.status = status;
        if (comments !== undefined) post.comments = comments;
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
                    await tagFound.save();
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
        result = (await post.save()).populate(paginateOptions.populate);
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
    excerpt,
    liveSports,
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
    let updatedProperties = [];
    try {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");

        if (title) post.title = (post.title != title) ? (updatedProperties.push('title'), title) : post.title;
        if (subtitle) post.subtitle = (post.subtitle != subtitle) ? (updatedProperties.push('subtitle'), subtitle) : post.subtitle;
        if (flywheel) post.flywheel = (post.flywheel != flywheel) ? (updatedProperties.push('flywheel'), flywheel) : post.flywheel;
        if (excerpt) post.excerpt = (post.excerpt != excerpt) ? (updatedProperties.push('excerpt'), excerpt) : post.excerpt;
        if (liveSports) post.liveSports = (post.liveSports != liveSports) ? (updatedProperties.push('liveSports'), liveSports) : post.liveSports;
        if (content) post.content = (post.content != content) ? (updatedProperties.push('content'), content) : post.content;
        if (type) post.type = (post.type != type) ? (updatedProperties.push('type'), type) : post.type;
        if (position) post.position = (post.position != position) ? (updatedProperties.push('position'), position) : post.position;
        if (comments !== undefined) post.comments = (post.comments != comments) ? (updatedProperties.push('comments'), comments) : post.comments;
        if (status) post.status = (post.status != status) ? (updatedProperties.push('status'), status) : post.status;
        if (imagesIds) {
            let updated = false;
            for (const imageId of imagesIds) {
                const id = mongoose.Types.ObjectId(imageId);
                if (post.images.indexOf(id) == -1) {
                    const image = await File.findById(imageId);
                    if (!image) throw new Error("Image not found");
                    image.post = post._id;
                    await image.save();
                    updated = true;
                };
            };
            for (const imageId of post.images) {
                if (imagesIds.indexOf(imageId.toString()) == -1) {
                    await deleteImage(imageId);
                    updated = true;
                };
            };
            post.images = imagesIds;
            if (updated) updatedProperties.push('images');
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
                updatedProperties.push('section');
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
                updatedProperties.push('category');
            }
        }
        if (tags) {
            let updated = false;
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
                    updated = true;
                };
            };
            for (const tag of post.tags) {
                if (tags.indexOf(tag) == -1) {
                    const tagFound = await Tag.findOne({ name: tag });
                    if (tagFound) {
                        tagFound.posts.pull(post._id);
                        await tagFound.save();
                    }
                    updated = true;
                }
            };
            post.tags = tags;
            if (updated) updatedProperties.push('tags');
        };

        post.lastUpdatedBy = userId;
        post.lastUpdatedAt = Date.now();

        result = (await post.save()).populate(paginateOptions.populate);
        await new Record({ description: post.title, operation: 'update', collectionName: 'post', objectId: post._id, user: userId, updatedProperties }).save();
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
                await deleteFile(imageId, userId);
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
    getPostBySlug,
    getPostsBySection,
    getPostsByCategory,
    getPostsByTag,
    getPostsByPosition,
    getPostsByStatus,
    createPost,
    searchPosts,
    updatePost,
    deletePost
};
