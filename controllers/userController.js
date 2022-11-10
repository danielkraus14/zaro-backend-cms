const User = require('../models/user');
const { validationResult } = require('express-validator');
const { authService, userService } = require('../services');

const signUpUser = async (req, res) => {
    try{
        const resulValidationReq = validationResult(req);
        const isValidReq = resulValidationReq.isEmpty();
        
        if(!isValidReq){
            return res.status(400).send({message: 'Invalid request', error: resulValidationReq.array()});
        }

        const { username, password, email, role } = req.body;
        const result = await userService.signUpUser( email, username, password, role );
        const token = authService.createToken(result);
        res.status(201).send({user: result, token});
    }catch(error){
        res.status(400).send(error);
    }
};

const signInUser = async (req, res) => {
    let result;
    try{
        const resulValidationReq = validationResult(req);
        const isValidReq = resulValidationReq.isEmpty();

        if(!isValidReq){
            return res.status(400).send({message: 'Invalid request', error: resulValidationReq.array()});
        }
    
        const { email, username, password} = req.body;
        result =  await userService.signInUser(email, username, password).catch(
            error => {
                return res.status(error.status).send({message: error.message});
            }
        )
        const token = authService.createToken(result);
        console.log(result, token);
        res.status(201).send({user: result, token});
    }catch(error){
        res.status(400).send(error);
    }
};

const deleteUser = (req, res) => {
    const {userId} = req.body;
    User.findByIdAndDelete(userId, (error, user) => {
        if(error){
            return res.status(500).send({message: 'Something went wrong', error});
        }
        if(!user){
            return res.status(404).send({message: 'User not found', error});
        }
        res.status(200).send({message: 'User deleted successfully'});
    });
};

const updateUser = async (req, res) => {
    const {userId} = req.params
    console.log(userId);
    User.findByIdAndUpdate(userId, req.body, {new: true}, (error, user) => {
        if(error){
            return res.status(500).send({message: 'Something went wrong', error});
        }
        if(!user){
            return res.status(404).send({message: 'User not found', error});
        }
        res.status(200).send({token: authService.createToken(user)});
    });
}


module.exports = {
    signUpUser,
    signInUser,
    deleteUser,
    updateUser
}