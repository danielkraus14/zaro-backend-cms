const { funeralNoticeService } = require('../services');

const getFuneralNotices = async (req, res) => {
    try{
        const funeralNotices = await funeralNoticeService.getFuneralNotices();
        res.status(200).send(funeralNotices);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getFuneralNoticesByReligion = async (req, res) => {
    try{
        const funeralNotices = await funeralNoticeService.getFuneralNoticesByReligion(req.params.religion);
        res.status(200).send(funeralNotices);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getFuneralNoticesByDate = async (req, res) => {
    try{
        const funeralNotices = await funeralNoticeService.getFuneralNoticesByDate(req.params.date);
        res.status(200).send(funeralNotices);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getFuneralNoticesByStatus = async (req, res) => {
    try{
        const funeralNotices = await funeralNoticeService.getFuneralNoticesByStatus(req.params.status);
        res.status(200).send(funeralNotices);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createFuneralNotice = async (req, res) => {
    try{
        const {userId, title, deceased, client, date, religion, status, content} = req.body;
        const result = await funeralNoticeService.createFuneralNotice(userId, title, deceased, client, date, religion, status, content);
        res.status(201).send({funeralNotice: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updateFuneralNotice = async (req, res) => {
    try{
        const { userId, title, deceased, client, date, religion, status, content} = req.body;
        const result = await funeralNoticeService.updateFuneralNotice(req.params.funeralNoticeId, userId, title, deceased, client, date, religion, status, content);
        res.status(200).send({funeralNotice: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deleteFuneralNotice = async (req, res) => {
    try{
        const userId = req.body.userId;
        const result = await funeralNoticeService.deleteFuneralNotice(req.params.funeralNoticeId, userId);
        res.status(200).send({funeralNotice: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const searchFuneralNotice = async (req, res) => {
    try{
        const result = await funeralNoticeService.searchFuneralNotice(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when searching posts"});
    }
};

module.exports = {
    getFuneralNotices,
    getFuneralNoticesByReligion,
    getFuneralNoticesByDate,
    getFuneralNoticesByStatus,
    createFuneralNotice,
    updateFuneralNotice,
    deleteFuneralNotice,
    searchFuneralNotice
}