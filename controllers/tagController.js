const { tagService } = require('../services');

const getTags = async (req, res) => {
    try {
        const tags = await tagService.getTags();
        res.status(200).send(tags);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getTagsByName = async (req, res) => {
    try {
        const tags = await tagService.getTagsByName(req.params.tagName);
        res.status(200).send(tags);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await tagService.createTag(name);
        res.status(201).send({tag: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};


module.exports  =  {
    getTags,
    getTagsByName,
    createTag
};
