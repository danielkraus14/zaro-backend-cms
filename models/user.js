const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
});

UserSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified('password')){
        return next();
    };

    bcrypt.genSalt(10, (error, salt) => {
        if(error){
            return next(error);
        }
        bcrypt.hash(user.password, salt, null, (error, hash) => {
            if(error){
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
})

UserSchema.methods.comparePassword = function (candidatePassword){
    let user = this;
    return bcrypt.compareSync(candidatePassword, user.password);
}


module.exports = mongoose.model('User', UserSchema);