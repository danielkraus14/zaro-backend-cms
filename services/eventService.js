const Event = require("../models/event");
const Venue = require("../models/venue");
const User = require("../models/user");
const File = require("../models/file");

const { deleteFile } = require('../services/fileService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
};

const getEvents = async () => {
    let result;
    try {
        await Event.paginate({}, paginateOptions, function(err, res){
            if (err) {
                throw err;
            };
            result = res;
        })
    } catch (error) {
        throw error;
    }
    return result;
};

const getEventsByVenue = async (venueId) => {
    let result;
    try {
        await Event.paginate({ venue: venueId }, paginateOptions, function(err, res){
            if (err) {
                throw err;
            }
            result = res;
        })
    } catch (error) {
        throw error;
    }
    return result;
};

const searchEvents = async (search) => {
    let result;
    try {
        let query = {};
        if (search.title) {
            query.title = { $regex: new RegExp(search.title), $options: "i" };
        };
        if (search.dateFrom) {
            search.dateFrom.setUTCHours(0, 0, 0, 0);
            query.dateEnds = { $gte: dateFrom };
        };
        if (search.dateUntil) {
            search.dateUntil.setUTCHours(23, 59, 59, 999);
            query.dateStarts = { $lte: dateUntil };
        };
        await Event.paginate(query, paginateOptions, function(err, res){
        if (err) {
            throw err;
        }
        result = res;
        })
    } catch (error) {
        throw error;
    }
    return result;
};

const createEvent = async (
    title,
    description,
    billboardId,
    dateStarts,
    dateEnds,
    venueId,
    userId
) => {
    let result;
    try {
        const event = new Event({
            title,
            description,
            billboard: billboardId,
            dateStarts,
            dateEnds,
            venue: venueId,
            createdBy: userId
        });
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const venue = await Venue.findById(venueId);
        if (!venue) throw new Error("Venue not found");

        if (billboardId) {
            const file = await File.findById(billboardId);
            if (!file) throw new Error("File not found");
            file.event = event._id;
            await file.save();
        };

        user.events.push(event._id);
        await user.save();
        venue.events.push(event._id);
        await venue.save();
        result = await event.save();
    } catch (error) {
    throw error;
    }
    return result;
};

const updateEvent = async (
    eventId,
    title,
    description,
    billboardId,
    dateStarts,
    dateEnds,
    venueId,
    userId
) => {
    let result;
    try {
        const event = await Event.findById(eventId);
        if (!event) throw new Error("Event not found");

        if (title) event.title = title;
        if (description) event.description = description;

        if (billboardId) {
            if (event.billboard != billboardId) {
                const file = await File.findById(billboardId);
                if (!file) throw new Error("Image not found");
                file.event = event._id;
                await file.save();
                event.billboard = billboardId;
            }
        };

        if (dateStarts) event.dateStarts = dateStarts;
        if (dateEnds) event.dateEnds = dateEnds;
        if (venueId) {
            if (event.venue != venueId) {
                const oldVenue = await Venue.findById(event.venue);
                const newVenue = await Venue.findById(venueId);
                if (!newVenue) throw new Error("Venue not found");
                newVenue.events.push(event._id);
                await newVenue.save();
                oldVenue.events.pull(event._id);
                await oldVenue.save();
                event.venue = venueId;
            }
        };

        event.lastUpdatedBy = userId;
        event.lastUpdatedAt = new Date.now();

        result = await event.save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deleteEvent = async (eventId) => {
    let result;
    try {
        const event = await Event.findById(eventId);
        if (!event) throw new Error("Event not found");

        //Find the user and delete the event._id from the user's events array
        const user = await User.findById(event.createdBy);
        if (!user) throw new Error("User not found");
        user.events.pull(event._id);
        await user.save();

        //Find the venue and delete the event._id from the venue's events array
        const venue = await Venue.findById(event.venue);
        if (!venue) throw new Error("Venue not found");
        venue.events.pull(event._id);
        await venue.save();

        //Delete image from S3 server
        if (event.billboard) {
            await deleteFile(event.billboard);
        };

        result = await event.remove();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getEvents,
    getEventsByVenue,
    searchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
