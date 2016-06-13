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

        user.createFakeAccount(username, password, function(err){
            if (err) return next(err);
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
    //TODO Check login
    res.render('student',{username:req.body.username});
};



module.exports = UserController;
