var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    password : {type: String, required: true},
    username : {type: String, required: true},
});


module.exports = mongoose.model('Admin', adminSchema);

