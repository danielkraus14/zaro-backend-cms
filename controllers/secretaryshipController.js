const { secretaryshipService } = require('../services');

const getSecretaryships = async (req, res) => {
    let result;
    try{
        result = await secretaryshipService.getSecretaryships();
    }catch(error){
        throw error;
    }
    res.status(200).send(result);
};

const getSecretaryshipById = async (req, res) => {
    try{
        const { secrecretaryshipId } = req.params;
        const secretaryship = await secretaryshipService.getSecretaryshipById(secrecretaryshipId);
        res.status(200).send(secretaryship);
    }catch(error){
        res.status(400).send({error, message: 'Secretaryship not found'});
    }
};

const createSecretaryship = async (req, res) => {
    const {name, description, image} = req.body;
    let result;
    try{
        result = await secretaryshipService.createSecretaryship(name, description, image);
    }catch(error){
        console.log(error);
    }
    res.status(201).send(result);
};

const updateSecretaryship = async (req, res) => {
    try{
        const { secretaryshipId } = req.params;
        const { name, description, image } = req.body;
        const result = await secretaryshipService.updateSecretaryship(secretaryshipId, name, description, image);
        res.status(200).send({secretaryship: result});
    }catch(error){
        res.status(400).send({error, message: 'Secretaryship not found'});
    }
};

const deleteSecretaryship = async (req, res) => {
    try{
        const { secretaryshipId } = req.params;
        const result = await secretaryshipService.deleteSecretaryship(secretaryshipId);
        res.status(200).send({secretaryship: result});
    }catch(error){
        res.status(400).send({error, message: 'Secretaryship not found'});
    }
};

module.exports = {
    getSecretaryships,
    getSecretaryshipById,
    createSecretaryship,
    updateSecretaryship,
    deleteSecretaryship  
}