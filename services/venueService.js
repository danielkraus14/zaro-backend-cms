const Venue = require('../models/venue');

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
        const candidateVenue = new Venue({
            name,
            description,
            address,
            createdBy: userId
        });
        result = await candidateVenue.save();
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
    }catch(error){
        throw error;
    }
    return result;
};

const deleteVenue = async (venueSlug) => {
    let result;
    try{

        const venue = await Venue.findOne({ slug: venueSlug });
        if(!venue) throw new Error('Venue not found');

        for (const eventId of venue.events) {
            await deleteEvent(eventId);
        };

        result = await venue.remove();
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
