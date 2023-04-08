const { printEditionService } = require('../services');

const getPrintEditions = async (req, res) => {
    try{
        const printEditions = await printEditionService.getPrintEditions();
        res.status(200).send(printEditions);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getPrintEditionsByDate = async (req, res) => {
    try{
        const printEditions = await printEditionService.getPostsBySection(req.params.sectionId);
        res.status(200).send(printEditions);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createPrintEdition = async (req, res) => {
    try{
        const { date, frontPage, newsletterPDF, body, tags } = req.body;
        const result = await printEditionService.createPrintEdition(date, frontPage, newsletterPDF, body, tags);
        res.status(201).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updatePrintEdition = async (req, res) => {
    try{
        const { date, frontPage, newsletterPDF, body, tags } = req.body;
        const result = await printEditionService.updatePrintEdition(req.params.printEditionId, date, frontPage, newsletterPDF, body, tags);
        res.status(200).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deletePrintEdition = async (req, res) => {
    try{
        const result = await printEditionService.deletePrintEdition(req.params.printEditionId);
        res.status(204).send({post: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

module.exports = {
    getPrintEditions,
    getPrintEditionsByDate,
    createPrintEdition,
    updatePrintEdition,
    deletePrintEdition,
};
