const { printEditionService } = require('../services');

const getPrintEditions = async (req, res) => {
    try {
        const { page } = req.query;
        const printEditions = await printEditionService.getPrintEditions(page);
        res.status(200).send(printEditions);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPrintEditionById = async (req, res) => {
    try {
        const { printEditionId } = req.params;
        const printEdition = await printEditionService.getPrintEditionById(printEditionId);
        res.status(200).send(printEdition);
    } catch(error) {
        res.status(400).send({error, message: 'Print edition not found'});
    }
};

const getPrintEditionsByDate = async (req, res) => {
    try {
        const { page } = req.query;
        const { date } = req.params;
        const printEditions = await printEditionService.getPrintEditionsByDate(date, page);
        res.status(200).send(printEditions);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPrintEditionsByTag = async (req, res) => {
    try {
        const { page } = req.query;
        const { tag } = req.params;
        const posts = await printEditionService.getPrintEditionsByTag(tag, page);
        res.status(200).send(posts);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPrintEdition = async (req, res) => {
    try {
        const { date, frontPageId, newsletterPDFId, body, tags, userId } = req.body;
        const result = await printEditionService.createPrintEdition(date, frontPageId, newsletterPDFId, body, tags, userId);
        res.status(201).send({printEdition: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePrintEdition = async (req, res) => {
    try {
        const { printEditionId } = req.params;
        const { date, frontPageId, newsletterPDFId, body, tags, userId } = req.body;
        const result = await printEditionService.updatePrintEdition(printEditionId, date, frontPageId, newsletterPDFId, body, tags, userId);
        res.status(200).send({printEdition: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deletePrintEdition = async (req, res) => {
    try {
        const { printEditionId } = req.params;
        const { userId } = req.body;
        const result = await printEditionService.deletePrintEdition(printEditionId, userId);
        res.status(204).send({printEdition: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

module.exports = {
    getPrintEditions,
    getPrintEditionById,
    getPrintEditionsByDate,
    getPrintEditionsByTag,
    createPrintEdition,
    updatePrintEdition,
    deletePrintEdition,
};
