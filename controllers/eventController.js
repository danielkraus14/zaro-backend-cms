const { eventService } = require('../services');

const getEvents = async (req, res) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).send(events);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await eventService.getEventById(eventId);
        res.status(200).send(event);
    } catch(error) {
        res.status(400).send({error, message: 'Event not found'});
    }
};

const getEventsByVenue = async (req, res) => {
    try {
        const events = await eventService.getEventsByVenue(req.params.venueSlug);
        res.status(200).send(events);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, billboardId, dateStarts, dateEnds, venueId, userId } = req.body;
        const result = await eventService.createEvent(title, description, billboardId, dateStarts, dateEnds, venueId, userId);
        res.status(201).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params
        const { title, description, billboardId, dateStarts, dateEnds, venueId, userId } = req.body;
        const result = await eventService.updateEvent(eventId, title, description, billboardId, dateStarts, dateEnds, venueId, userId);
        res.status(200).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;
        const result = await eventService.deleteEvent(eventId, userId);
        res.status(204).send({event: result});
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong"});
    }
};

const searchEvents = async (req, res) => {
    try {
        const result = await eventService.searchEvents(req.query);
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send({error, message: "Something went wrong when searching events"});
    }
};

module.exports = {
    getEvents,
    getEventById,
    getEventsByVenue,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents
};
