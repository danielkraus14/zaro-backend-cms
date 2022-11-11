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
        console.log(error);;
        //throw error;
    }
    return result;
};

module.exports = {
    getSecretaryships,
    createSecretaryship
}
