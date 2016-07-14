var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    username : {type: String, required: true},
    email    : {type: String, required: true},
});


module.exports = mongoose.model('Admin', adminSchema);

