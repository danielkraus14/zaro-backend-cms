const Venue = require('../models/venue');
const Record = require('../models/record');

const { deleteEvent } = require('../services/eventService');

const paginateOptions = {
    page: 1,
    limit: 15,
    sort: { date: -1 },
}

const getVenues = async () => {
    let result;
    try{
        await Venue.paginate({}, paginateOptions, function(err, res){
            if (err) {
                throw err;
            }
            result = res;
        })
    }catch(error){
        throw error;
    }
    return result;
};

const getVenueBySlug = async (venueSlug) => {
    let result;
    try{
        const venue = await Venue.findOne({ slug: venueSlug });
        if(!venue) throw new Error('Venue not found');
        result = venue;
    }catch(error){
        throw error;
    }
    return result;
};

const createVenue = async (name, description, address, userId) => {
    let result;
    try{
        const rawSlug = name.replace(/ /g, '_').toLowerCase();
        const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const venue = new Venue({
            name,
            description,
            address,
            slug,
            createdBy: userId
        });
        result = await venue.save();
        await new Record({ description: venue.name, operation: 'create', collectionName: 'venue', objectId: venue._id, user: userId}).save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateVenue = async (venueSlug, name, description, address, userId) => {
    let result;
    try{
        const venue = await Venue.findOne({ slug: venueSlug });
        if (!venue) throw new Error("Venue not found");

        venue.name = name;
        venue.description = description;
        venue.address = address;
        venue.lastUpdatedAt = Date.now();
        venue.lastUpdatedBy = userId;

        result = await venue.save();
        await new Record({ description: venue.name, operation: 'update', collectionName: 'venue', objectId: venue._id, user: userId}).save();
    }catch(error){
        throw error;
    }
    return result;
};

const deleteVenue = async (venueSlug, userId) => {
    let result;
    try{
        const venue = await Venue.findOne({ slug: venueSlug });
        if(!venue) throw new Error('Venue not found');

        for (const eventId of venue.events) {
            await deleteEvent(eventId);
        };

        const delVenueId = venue._id;
        const description = venue.name;
        result = await venue.remove();
        await new Record({ description, operation: 'delete', collectionName: 'venue', objectId: delVenueId, user: userId}).save();
    } catch(error) {
        throw error;
    }
    return result;
};

module.exports = {
    getVenues,
    getVenueBySlug,
    createVenue,
    updateVenue,
    deleteVenue
};
