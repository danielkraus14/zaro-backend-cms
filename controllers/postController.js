const { postService } = require('../services');

const getPosts = async (req, res) => {
    try {
        const { page } = req.query;
        const posts = await postService.getPosts(page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        res.status(200).send(post);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostBySlug = async (req, res) => {
    try {
        const { postSlug } = req.params;
        const post = await postService.getPostBySlug(postSlug);
        res.status(200).send(post);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const searchPosts = async (req, res) => {
    try {
        const result = await postService.searchPosts(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsBySection = async (req, res) => {
    try {
        const { page } = req.query;
        const { sectionSlug } = req.params;
        const posts = await postService.getPostsBySection(sectionSlug, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsByCategory = async (req, res) => {
    try {
        let posts;
        const { page, postsLimit } = req.query;
        const { categorySlug } = req.params;
        if (postsLimit) {
            posts = await postService.getPostsByCategoryLimited(categorySlug, postsLimit);
        } else {
            posts = await postService.getPostsByCategory(categorySlug, page);
        };
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsByCreator = async (req, res) => {
    try {
        const { page } = req.query;
        const { userId } = req.params;
        const posts = await postService.getPostsByCreator(userId, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsByTag = async (req, res) => {
    try {
        const { page } = req.query;
        const { tag } = req.params;
        const posts = await postService.getPostsByTag(tag, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsByPosition = async (req, res) => {
    try {
        let posts;
        const { page, postsLimit } = req.query;
        const { position } = req.params;
        if (postsLimit) {
            posts = await postService.getPostsByPositionLimited(position, postsLimit);
        } else {
            posts = await postService.getPostsByPosition(position, page);
        };
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const getPostsByStatus = async (req, res) => {
    try {
        const { page } = req.query;
        const { status } = req.params;
        const posts = await postService.getPostsByStatus(status, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const {
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
        } = req.body;
        const result = await postService.createPost(
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
        );
        res.status(201).send({ post: result });
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params
        const {
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
        } = req.body;
        const result = await postService.updatePost(
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
        );
        res.status(200).send({ post: result });
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const result = await postService.deletePost(postId, userId);
        res.status(204).send({ post: result });
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = {
    getPosts,
    getPostById,
    getPostBySlug,
    searchPosts,
    getPostsBySection,
    getPostsByCategory,
    getPostsByCreator,
    getPostsByTag,
    getPostsByPosition,
    getPostsByStatus,
    createPost,
    updatePost,
    deletePost
};
