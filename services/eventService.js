const Event = require("../models/event");
const Venue = require("../models/venue");
const { deleteFile } = require('../s3');


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

const getEventsByDate = async (date) => {
    let result;
    try {
        let query = {};
        if (date.dateFrom) {
            date.dateFrom.setUTCHours(0, 0, 0, 0);
            query.dateEnds = { $gte: dateFrom };
        };
        if (date.dateUntil) {
            date.dateUntil.setUTCHours(23, 59, 59, 999);
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

const searchEvents = async (search) => {
    let result;
    try {
        let query = {};
        if (search.title) {
            query.title = { $regex: new RegExp(search.title), $options: "i" };
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
    image,
    dateStarts,
    dateEnds,
    venueId
) => {
    let result;
    try {
        const imagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${image}`
        const event = new Event({
            title,
            description,
            image: imagePath,
            dateStarts,
            dateEnds,
            venueId,
        });

        const venue = await Venue.findById(venueId);
        if (!venue) throw new Error("Venue not found");

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
    image,
    dateStarts,
    dateEnds,
    venueId
) => {
    let result;
    try {
        const event = await Event.findById(eventId);
        if (!event) throw new Error("Event not found");

        if (title) event.title = title;
        if (description) event.description = description;
        if (image) {
            const imagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${image}`
            event.image = imagePath;
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

        //Find the venue and delete the event._id from the venue's events array
        const venue = await Venue.findById(event.venue);
        venue.events.pull(event._id);
        await venue.save();

        //Delete image from S3 server
        if (event.image) {
            await deleteFile(event.image);
        }

        result = await event.remove();
    } catch (error) {
        throw error;
    }
    return result;
};

module.exports = {
    getEvents,
    getEventsByVenue,
    getEventsByDate,
    searchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
