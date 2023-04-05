const { venueService } = require('../services');

const getVenues = async (req, res) => {
    let result;
    try{
        result = await venueService.getVenues();
    }catch(error){
        throw error;
    }
    res.status(200).send(result);
};

const getVenueById = async (req, res) => {
    try{
        const { venueId } = req.params;
        const venue = await venueService.getVenueById(venueId);
        res.status(200).send(venue);
    }catch(error){
        res.status(400).send({error, message: 'Section not found'});
    }
};

const createVenue = async (req, res) => {
    const {name, description, address} = req.body;
    let result;
    try{
        result = await venueService.createVenue(name, description, address);
    }catch(error){
        console.log(error);
    }
    res.status(201).send(result);
};

const updateVenue = async (req, res) => {
    try{
        const { venueId } = req.params;
        const { name, description, address } = req.body;
        const result = await venueService.updateVenue(venueId, name, description, address);
        res.status(200).send({venue: result});
    }catch(error){
        res.status(400).send({error, message: 'Section not found'});
    }
};

module.exports = {
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
};