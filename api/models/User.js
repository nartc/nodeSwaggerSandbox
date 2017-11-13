const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        set: toLower
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

//Set email to lowerCase for future use
function toLower(str) {
    return str.toLowerCase();
}

//Set User Model
const User = module.exports = mongoose.model('User', UserSchema);

