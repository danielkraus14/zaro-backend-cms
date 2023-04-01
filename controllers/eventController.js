const { eventService } = require('../services');
const { uploadBillboard } = require('../s3');

const getEvents = async (req, res) => {
    try{
        const events = await eventService.getEvents();
        res.status(200).send(events);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getEventsByVenue = async (req, res) => {
    try{
        const events = await eventService.getEventsByVenue(req.params.venueId);
        res.status(200).send(events);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getEventsByDate = async (req, res) => {
    try{
        const events = await eventService.getEventsByDate(req.params.dateFrom, req.params.dateUntil);
        res.status(200).send(events);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createEvent = async (req, res) => {
    try{
        const { title, description, image, dateStarts, dateEnds, venue } = req.body;
        const result = await eventService.createEvent(title, description, image, dateStarts, dateEnds, venue);
        res.status(201).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updateEvent = async (req, res) => {
    try{
        const { title, description, image, dateStarts, dateEnds, venue } = req.body;
        const result = await eventService.updateEvent(req.params.eventId, title, description, image, dateStarts, dateEnds, venue);
        res.status(200).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deleteEvent = async (req, res) => {
    try{
        const result = await eventService.deleteEvent(req.params.eventId);
        res.status(200).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const searchEvents = async (req, res) => {
    try{
        const result = await eventService.searchEvents(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when searching events"});
    }
};

//Media controller

const uploadBillboard = async (req, res) => {
    try{
        const file = req.files.file;
        const result = await uploadBillboard(file);
        res.status(200).send({message: "Media uploaded", file: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when uploading media"});
    }
};

module.exports = {
    getEvents,
    getEventsByVenue,
    getEventsByDate,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    uploadBillboard,
};