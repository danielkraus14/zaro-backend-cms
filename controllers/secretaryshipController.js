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

module.exports = {
    getSecretaryships,
    createSecretaryship
}