const { recordService } = require('../services');

const getRecords = async (req, res) => {
    let result;
    try {
        result = await recordService.getRecords();
        res.status(200).send(result);
    } catch(error) {
        res.status(404).send({ error: error.message });
    }
};

const searchRecords = async (req, res) => {
    try {
        const records = await recordService.searchRecords(req.query);
        res.status(200).send(records);
    } catch(error) {
        res.status(404).send({ error: error.message });
    }
};

const getObjectOfRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const object = await recordService.getObjectOfRecord(recordId);
        res.status(200).send(object);
    } catch(error) {
        res.status(404).send({ error: error.message });
    }
};

module.exports = {
    getRecords,
    searchRecords,
    getObjectOfRecord
};
