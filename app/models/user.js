const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const bcryptjs = require('bcryptjs');


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
    let salt = bcrypt.genSaltSync(10);
    bcrypt.hash(user.password, salt, null, function(err, hash){
        if (err) return next(err);
        user.password = hash;
        next(user.password);
    })

    // //proba so bcryptJS - still not working ..
    // bcryptjs.genSalt(10, (err, salt) => {
        
    //     bcryptjs.hash(user.password, salt, (err, hash) => {
    //         if (err) return next(err);
    //         user.password = hash;
    //         next();
    //     })
    // });
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
