const User = require('../models/user');

const signUpUser = async (email, username, password, role) => {
    let result;
    try{
        const candidateUser = new User( {
            email, 
            username, 
            password, 
            role} );
        
        User.findOne({email: candidateUser.email, username: candidateUser.username}, (error, user) => {
            if(error){
                throw error;
            }
            if(user){
                result = {error: 'User already exists'};
                return result;
            }
        })
        result = await candidateUser.save();
    }catch(error){
        throw error;
    }
    return result;
}

const signInUser = async (email, username, password) => {
    let result;
    try{
        const candidateUser = new User( {
            email, 
            username, 
            password
        } );

        const userFound = await User.findOne({email: candidateUser.email, username: candidateUser.username})
        if(!userFound){
            result = {error: 'User not found'};
            return result;
        }
        const isMatch = await userFound.comparePassword(candidateUser.password);
        if(!isMatch){
            result = {error: 'Email, username or password is incorrect'};
            return result;
        }

        result = userFound;
    }catch(error){
        throw error;
    }
    return result;
}



module.exports = {
    signUpUser,
    signInUser
}
