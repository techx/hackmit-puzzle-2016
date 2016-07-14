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

userSchema.methods.genPassword = function(password) {
    var salt = "12345";
    var key  = "puzzle solution"; //TODO change salt and key
    return binToHex(xorString(password+salt,key));
}

userSchema.methods.createFakeAccount = function(username, password, callback) {
    console.log("creating fake user");

    var fakeUser = {
        username : username,
        password : this.genPassword(password)
    };

    this.accounts.push(fakeUser);
    this.save(callback);
};


function xorString(a,b) {
    return xor(textToBin(a), textToBin(b));
}

function xor(password, key) {
    var xor = '';
    for(var i=0;i<password.length;i++) {
        xor += (password[i]^key[i]);
    }
    return xor;
}
function textToBin(text) {
  var length = text.length,
      output = [];
  for (var i = 0;i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    output.push(Array(8-bin.length+1).join("0") + bin);
  }
  return output.join("");
}

function binToHex(bin) {
    return bin.replace(/\s*[01]{4}\s*/g, function(bin) {
      return parseInt(bin,2).toString(16);
    });
}

function binToString(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
      return String.fromCharCode(parseInt(bin, 2))
    })
  }


module.exports = mongoose.model('User', userSchema);

