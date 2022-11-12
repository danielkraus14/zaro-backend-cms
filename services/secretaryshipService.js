const Secretaryship = require('../models/secretaryship');

const getSecretaryships = async () => {
    let result;
    try{
        result = await Secretaryship.find({});
    }catch(error){
        throw error;
    }
    return result;
};

const getSecretaryshipById = async (secretaryshipId) => {
    let result;
    try{
        result = await Secretaryship.findById(secretaryshipId);
    }catch(error){
        throw error;
    }
    return result;
};

const createSecretaryship = async (name, description, image) => {
    let result;
    try{
        const candidateSecretaryship = new Secretaryship( {
            name, 
            description, 
            image
        } );
        result = await candidateSecretaryship.save();
    }catch(error){
        throw error;
    }
    return result;
};

const updateSecretaryship = async (secretaryshipId, name, description, image) => {
    let result;
    try{
        const candidateSecretaryship = await Secretaryship.findById(secretaryshipId);
        candidateSecretaryship.name = name;
        candidateSecretaryship.description = description;
        candidateSecretaryship.image = image;
        result = await candidateSecretaryship.save();
    }catch(error){
        throw error;
    }
    return result;
};


module.exports = {
    getSecretaryships,
    createSecretaryship
}
