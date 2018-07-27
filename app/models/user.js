const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    }
});

UserSchema.pre('save', (next) => {
    let user = this;
    bcrypt.hash(user.password, null, null, (err)=>{
        if (err) return next(err);
        user.password = hash;
        next();
    })
})

module.exports = mongoose.model('User', UserSchema);
