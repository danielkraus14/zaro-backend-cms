const Event = require("../models/event");
const Venue = require("../models/venue");
const User = require("../models/user");
const File = require("../models/file");
const Record = require("../models/record");

const { deleteFile } = require('../services/fileService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
    populate: [
        {
            path: 'billboard',
            select: 'url'
        },
        {
            path: 'venue',
            select: ['name', 'address', 'slug']
        }
    ]
};

const getEvents = async () => {
    let result;
    try {
        await Event.paginate({}, paginateOptions, function(err, res) {
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

const getEventById = async (eventId) => {
    let result;
    try {
        result = await Event.findById(eventId).populate(paginateOptions.populate);
    } catch(error) {
        throw error;
    }
    return result;
};

const getEventsByVenue = async (venueSlug) => {
    let result;
    try {
        const venue = await Venue.findOne({ slug: venueSlug });
        if (!venue) throw new Error("Venue not found");
        await Event.paginate({ venue: venue._id }, paginateOptions, function(err, res) {
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
            const date = new Date(search.dateFrom);
            date.setUTCHours(0, 0, 0, 0);
            query.dateEnds = { $gte: date };
        };
        if (search.dateUntil) {
            const date = new Date(search.dateUntil);
            date.setUTCHours(23, 59, 59, 999);
            query.dateStarts = { $lte: date };
        };
        await Event.paginate(query, paginateOptions, function(err, res) {
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
            event.billboard = billboardId;
        };
        if (dateStarts) event.dateStarts = dateStarts;
        if (dateEnds) event.dateEnds = dateEnds;

        user.events.push(event._id);
        await user.save();
        venue.events.push(event._id);
        await venue.save();
        const venueName = venue.name;
        result = (await event.save()).populate(paginateOptions.populate);
        await new Record({ description: `${event.title} at ${venueName}`, operation: 'create', collectionName: 'event', objectId: event._id, user: userId }).save();
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
        const event = await Event.findById(eventId).populate(paginateOptions.populate);
        if (!event) throw new Error("Event not found");
        let venueName = event.venue.name;

        if (title) event.title = title;
        if (description) event.description = description;

        if (billboardId) {
            if (event.billboard != billboardId) {
                const file = await File.findById(billboardId);
                if (!file) throw new Error("Image not found");
                await deleteFile(event.billboard, userId);
                file.event = event._id;
                await file.save();
                event.billboard = billboardId;
            }
        };

        if (dateStarts) event.dateStarts = dateStarts;
        if (dateEnds) event.dateEnds = dateEnds;
        if (venueId) {
            if (event.venue._id != venueId) {
                const oldVenue = await Venue.findById(event.venue);
                const newVenue = await Venue.findById(venueId);
                if (!newVenue) throw new Error("Venue not found");
                newVenue.events.push(event._id);
                await newVenue.save();
                oldVenue.events.pull(event._id);
                await oldVenue.save();
                event.venue = venueId;
                venueName = newVenue.name;
            }
        };

        event.lastUpdatedBy = userId;
        event.lastUpdatedAt = Date.now();

        result = (await event.save()).populate(paginateOptions.populate);
        await new Record({ description: `${event.title} at ${venueName}`, operation: 'update', collectionName: 'event', objectId: event._id, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

const deleteEvent = async (eventId, userId) => {
    let result;
    try {
        const event = await Event.findById(eventId);
        if (!event) throw new Error("Event not found");

        //Find the user and delete the event._id from the user's events array
        const user = await User.findById(event.createdBy);
        if (!user) throw new Error("User not found");
        if (user.events.indexOf(event._id) != -1) user.events.pull(event._id);

        //Find the venue and delete the event._id from the venue's events array
        const venue = await Venue.findById(event.venue);
        if (!venue) throw new Error("Venue not found");
        const venueName = venue.name;
        if (venue.events.indexOf(event._id) != -1) venue.events.pull(event._id);

        //Delete image from S3 server
        if (event.billboard) {
            await deleteFile(event.billboard, userId);
        };

        const delEventId = event._id;
        const description = `${event.title} at ${venueName}`;

        await user.save();
        await venue.save();
        result = await event.remove();
        await new Record({ description, operation: 'delete', collectionName: 'event', objectId: delEventId, user: userId }).save();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getEvents,
    getEventById,
    getEventsByVenue,
    searchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
