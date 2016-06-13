var User = require('../models/User.js');

AdminController = {};

AdminController.renderLogin = function(req, res, next) {
    res.render('admin-login');
};

AdminController.login = function(req, res, next) {
    //TODO Check login

    User.findOne({githubUsername: req.user.githubUsername}, function(err, user){
        console.log("admin login");
        if(err) return next(err);
        if(!user) return res.send(404);
        console.log(user.accounts);
        res.render('admin-panel', {students:user.accounts});

    });
};


module.exports = AdminController;
