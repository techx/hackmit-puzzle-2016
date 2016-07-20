var User = require('../models/User.js');

UserController = {};

UserController.renderRegister = function(req, res, next) {
    res.render('student-register');
};


UserController.register = function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;
    User.findOne({githubUsername: req.user.githubUsername}, function(err, user){
        if (err) return next(err);
        if (!user) return res.send(404);

        if (user.accounts.length > 500) {
            return res.send("woah. You are making way too many accounts and have been blocked. This is not part of the puzzle. Please email us with an explanation");
        }

        user.createFakeAccount(username, password, function(err){
            if (err) return next(err);
            if (user.accounts.length > 200) {
                return res.send("OK \n Looks like you are making a bunch of accounts. Hint: You don't need to.");
            }
            res.send("OK");
        });
    });

};


UserController.renderLogin = function(req, res, next) {
    res.render('student-login');
};

UserController.login = function(req, res, next) {
    console.log(req.body);
    console.log(req.params);

    User.findOne({githubUsername: req.user.githubUsername}, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);
        var found = false;
        user.accounts.forEach(function(account) {
            if (account.username == req.body.username && account.password == user.genFakeUserPassword(req.body.password)){
                console.log("sending");
                found = true
                return res.render('student',{username:req.body.username});
            }
        });
        if (!found) res.send("WRONG CREDENTIALS. Do you even go here?");
    });
    //TODO Check login
};



module.exports = UserController;
