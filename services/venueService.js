const venue = require('../models/venue');
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

const createVenue = async (name, description, address) => {
    let result;
    try{
        const candidateVenue = new Venue({
            name,
            description,
            address,
        });
        result = await candidateVenue.save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateVenue = async (venueId, name, description, address) => {
    let result;
    try{
        const candidateVenue = await Venue.findById(venueId);
        candidateVenue.name = name;
        candidateVenue.description = description;
        candidateVenue.address = address;
        result = await candidateVenue.save();
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
