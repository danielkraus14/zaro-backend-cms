const Venue = require('../models/venue');

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

const getVenueById = async (venueId) => {
    let result;
    try{
        result = await Venue.findById(venueId);
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

const updateVenue = async (venueId, name, description, address, userId) => {
    let result;
    try{
        const venue = await Venue.findById(venueId);
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

module.exports = {
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
};
