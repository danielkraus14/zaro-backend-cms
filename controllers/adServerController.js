const { adServerService } = require('../services');

const getAdServers = async (req, res) => {
    try {
        const { page } = req.query;
        const adServers = await adServerService.getAdServers(page);
        res.status(200).send(adServers);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const getAdServerById = async (req, res) => {
    try {
        const { adServerId } = req.params;
        const adServer = await adServerService.getAdServerById(adServerId);
        res.status(200).send(adServer);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const searchAdServers = async (req, res) => {
    try {
        const adServers = await adServerService.searchAdServers(req.query);
        res.status(200).send(adServers);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const getAdServersByPosition = async (req, res) => {
    try {
        const { page } = req.query;
        const { position } = req.params;
        const adServers = await adServerService.getAdServersByPosition(position, page);
        res.status(200).send(adServers);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const getAdServersByStatus = async (req, res) => {
    try {
        const { page } = req.query;
        const { status } = req.params;
        const adServers = await adServerService.getAdServersByStatus(status, page);
        res.status(200).send(adServers);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const createAdServer = async (req, res) => {
    try {
        const { userId, position, site, dateStarts, dateEnds, unlimited, title, htmlContent, desktopImageId, mobileImageId, url, client, status } = req.body;
        const result = await adServerService.createAdServer(
            userId,
            position,
            site,
            dateStarts,
            dateEnds,
            unlimited,
            title,
            htmlContent,
            desktopImageId,
            mobileImageId,
            url,
            client,
            status
        );
        res.status(201).send({adServer: result});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const updateAdServer = async (req, res) => {
    try {
        const { adServerId } = req.params
        const { userId, position, site, dateStarts, dateEnds, unlimited, title, htmlContent, desktopImageId, mobileImageId, url, client, status } = req.body;
        const result = await adServerService.updateAdServer(
            adServerId,
            userId,
            position,
            site,
            dateStarts,
            dateEnds,
            unlimited,
            title,
            htmlContent,
            desktopImageId,
            mobileImageId,
            url,
            client,
            status
        );
        res.status(200).send({adServer: result});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

const deleteAdServer = async (req, res) => {
    try {
        const { adServerId } = req.params;
        const { userId } = req.body;
        const result = await adServerService.deleteAdServer(adServerId, userId);
        res.status(204).send({post: result});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
};

module.exports = {
    getAdServers,
    getAdServerById,
    getAdServersByPosition,
    getAdServersByStatus,
    searchAdServers,
    createAdServer,
    updateAdServer,
    deleteAdServer
};
