var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    githubUsername : {type: String, required: true},
    githubEmail    : {type: String, required: true},
    accounts       : [{
                    username : {type: String, required: true},
                    password : {type: String, required: true}
    }],

});

userSchema.statics.findOrCreate = function(parameters, callback){
    mongoose.model('User').findOne({"githubUsername": parameters.githubUsername}, function(err, user){
        if (err) return callback(err);
        if(user) return callback(null, user);
        mongoose.model('User').create(parameters, callback);
    });
};

module.exports = mongoose.model('User', userSchema);

