const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
module.exports = mongoose.model('Cafe', new mongoose.Schema({
    name: String,
    description: String
}));