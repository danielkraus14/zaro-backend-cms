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
    limit: 14,
    sort: { publicationDate: -1 },
    populate: [
        {
            path: 'images',
            select: ['url', 'filename', 'epigraph']
        },
        {
            path: 'pdf',
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
    ],
    allowDiskUse: true,
};

const getPosts = async (page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    let limitDate = new Date();
    try {
        limitDate.setDate(limitDate.getDate() - 15);
        limitDate.setUTCHours(0, 0, 0, 0);
        const query = { publicationDate: { $gte: limitDate } };
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

const getPostById = async (postId) => {
    let result;
    try {
        result = await Post.findById(postId).populate(paginateOptions.populate);
    } catch(error) {
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
    let limitDate = new Date();
    try {
        limitDate.setDate(limitDate.getDate() - 30);
        limitDate.setUTCHours(0, 0, 0, 0);
        const section = await Section.findOne({ slug: sectionSlug });
        if(!section) throw new Error('Section not found');
        const query = { section: section._id, status: 'published', publicationDate: { $gte: limitDate } };
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

const getPostsByCategory = async (categorySlug, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    let limitDate = new Date();
    try {
        limitDate.setDate(limitDate.getDate() - 30);
        limitDate.setUTCHours(0, 0, 0, 0);
        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');
        const query = { category: category._id, status: 'published', publicationDate: { $gte: limitDate } };
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

const getPostsByCategoryLimited = async (categorySlug, postsLimit) => {
    let result;
    try {
        const category = await Category.findOne({ slug: categorySlug });
        if(!category) throw new Error('Category not found');
        const query = { category: category.id, status: 'published' };
        result = await Post.find(query).sort(paginateOptions.sort).limit(postsLimit).populate(paginateOptions.populate);
    } catch (error) {
        throw error;
    }
    return result;
};

const getPostsByCreator = async (userId, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');
        const query = { createdBy: user._id, status: 'published' };
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

const getPostsByTag = async (tag, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    try {
        const query = { tags: { $elemMatch: { $eq: tag } }, status: 'published' };
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

const getPostsByPosition = async (position, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    let limitDate = new Date();
    try {
        limitDate.setDate(limitDate.getDate() - 15);
        limitDate.setUTCHours(0, 0, 0, 0);
        const query = { position, status: 'published', publicationDate: { $gte: limitDate } };
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

const getPostsByPositionLimited = async (position, postsLimit) => {
    let result;
    try {
        const query = { position, status: 'published' };
        result = await Post.find(query).sort(paginateOptions.sort).limit(postsLimit).populate(paginateOptions.populate);
    } catch (error) {
        throw error;
    }
    return result;
};

const getPostsByStatus = async (status, page) => {
    let result;
    paginateOptions.page = page ? page : 1;
    let limitDate = new Date();
    try {
        limitDate.setDate(limitDate.getDate() - 15);
        limitDate.setUTCHours(0, 0, 0, 0);
        const query = { status, publicationDate: { $gte: limitDate } };
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

const searchPosts = async (search) => {
    let result;
    let limitDate = new Date();
    paginateOptions.page = search.page ? search.page : 1;
    try {
        let query = {};
        query.status = 'published';
        if (search.title) {
            query.title = { $regex: new RegExp(search.title), $options: "i" };
        };
        if (search.content) {
            query.content = { $regex: new RegExp(search.content), $options: "i" };
        };
        if (search.dateFrom && search.dateUntil) {
            const dateFrom = new Date(search.dateFrom);
            dateFrom.setUTCHours(0, 0, 0, 0);
            const dateUntil = new Date(search.dateUntil);
            dateUntil.setUTCHours(23, 59, 59, 999);
            query.publicationDate = { $gte: dateFrom, $lte: dateUntil };
        } else if (search.dateFrom) {
            const date = new Date(search.dateFrom);
            date.setUTCHours(0, 0, 0, 0);
            limitDate.setDate(date.getDate() + 15);
            limitDate.setUTCHours(23, 59, 59, 999);
            query.publicationDate = { $gte: date, $lte: limitDate };
        } else if (search.dateUntil) {
            const date = new Date(search.dateUntil);
            date.setUTCHours(23, 59, 59, 999);
            limitDate.setDate(date.getDate() - 15);
            limitDate.setUTCHours(0, 0, 0, 0);
            query.publicationDate = { $lte: date, $gte: limitDate };
        } else if (!search.title && !search.content) {
            limitDate.setDate(limitDate.getDate() - 15);
            limitDate.setUTCHours(0, 0, 0, 0);
            query.publicationDate = { $gte: limitDate };
        };
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
    slug = slug.replace(/[^a-zA-Z0-9_-\s]/g, "");
    slug = slug.replace(/--+/g, '-');
    let slugFound = await Post.findOne({ slug });
    let count = 0;

    while (slugFound) {
        count++;
        if (count == 1) {
            slug = slug + '-' + count.toString();
        } else {
            words = slug.split('-');
            slug = words.slice(0, words.length - 1).join('-') + '-' + count.toString();
        };
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
    pdfId,
    sectionId,
    categoryId,
    tags,
    status,
    publicationDate
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
        const user = await User.findById(userId).populate('role');
        if (!user) throw new Error("User not found");

        post.slug = await getValidSlug(title);

        const section = await Section.findById(sectionId);
        const category = await Category.findById(categoryId);
        if (subtitle) post.subtitle = subtitle;
        if (flywheel) post.flywheel = flywheel;
        if (excerpt) post.excerpt = excerpt;
        if (liveSports) post.liveSports = liveSports;
        if (user.role.name == 'editor') {
            post.status = 'draft';
        } else {
            if (status) post.status = status;
        };
        if (comments !== undefined) post.comments = comments;
        if (type) post.type = type;
        if (position) post.position = position;
        if (publicationDate) post.publicationDate = publicationDate;
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
        if (post.images == false) throw new Error("You must upload at least one image");

        if (pdfId) {
            const file = await File.findById(pdfId);
            if (!file) throw new Error("File not found");
            file.postPDF = post._id;
            await file.save();
            post.pdf = pdfId;
        };

        if (!section) throw new Error("Section not found");
        if (!category) throw new Error("Category not found");

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
    pdfId,
    sectionId,
    categoryId,
    tags,
    status,
    publicationDate
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
        if (publicationDate) post.publicationDate = (post.publicationDate != publicationDate) ? (updatedProperties.push('publicationDate'), publicationDate) : post.publicationDate;

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
        };
        if (post.images == false) throw new Error("You must upload at least one image");

        if (pdfId) {
            if (post.pdf != pdfId) {
                const file = await File.findById(pdfId);
                if (!file) throw new Error("Image not found");
                await deleteFile(post.pdf, userId);
                file.postPDF = post._id;
                await file.save();
                post.pdf = pdfId;
                updatedProperties.push('pdf');
            };
        };

        if (sectionId) {
            if (post.section != sectionId) {
                const section = await Section.findById(sectionId);
                if (!section) throw new Error("Section not found");
                post.section = sectionId;
                updatedProperties.push('section');
            }
        };

        if (categoryId) {
            if (post.category != categoryId) {
                const category = await Category.findById(categoryId);
                if (!category) throw new Error("Category not found");
                post.category = categoryId;
                updatedProperties.push('category');
            }
        };

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

        //Delete all images and PDF
        if (post.images) {
            for (const imageId of post.images) {
                await deleteFile(imageId, userId);
            };
        };
        if (post.pdf) {
            await deleteFile(post.pdf, userId);
        };

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
    getPostBySlug,
    getPostsBySection,
    getPostsByCategory,
    getPostsByCategoryLimited,
    getPostsByCreator,
    getPostsByTag,
    getPostsByPosition,
    getPostsByPositionLimited,
    getPostsByStatus,
    createPost,
    searchPosts,
    updatePost,
    deletePost
};
