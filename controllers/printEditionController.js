const { printEditionService } = require('../services');
const { uploadFrontPage, uploadNewsletterPDF } = require('../s3');

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

//Media controller

const uploadFrontPage = async (req, res) => {
    try{
        const file = req.files.file;
        const result = await uploadFrontPage(file);

        res.status(200).send({message: "Front page uploaded", file: result});

    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when uploading media"});
    }
};

const uploadNewsletterPDF = async (req, res) => {
    try{
        const file = req.files.file;
        const result = await uploadNewsletterPDF(file);

        res.status(200).send({message: "Newsletter PDF uploaded", file: result});

    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when uploading media"});
    }
};

module.exports = {
    getPrintEditions,
    getPrintEditionsByDate,
    createPrintEdition,
    updatePrintEdition,
    deletePrintEdition,
    uploadFrontPage,
    uploadNewsletterPDF,
};
