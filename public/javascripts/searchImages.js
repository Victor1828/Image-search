var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var searchSchema = new Schema({
    search_term: String,
    date: Date
}, {collection: 'images'});

var modelClass = mongoose.model('searchImage', searchSchema);

module.exports = modelClass;