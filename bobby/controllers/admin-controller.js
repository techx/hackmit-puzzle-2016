var User = require('../models/User.js');
var Admin = require('../models/Admin.js');

AdminController = {};

AdminController.renderLogin = function(req, res, next) {
    res.render('admin-login');
};

AdminController.login = function(req, res, next) {
    console.log("a")
    console.log("admin login");
    console.log(req.body);
    console.log(typeof(req.body.username));

    //Try to parse the payload. This make it easier for them since they can login with the www-form
    //instead of sending their own post request with content-type: application/json
    try {
        var username = JSON.parse(req.body.username);
        var password = JSON.parse(req.body.password);
    } catch(err) {
        var username = req.body.username;
        var password = req.body.password;
    }
    User.findOne({githubUsername: req.user.githubUsername}, function(err, user){
        if(err) return next(err);
        if(!user) return res.send(404);

        if (user.accounts.length > 200) {
            return res.send("woah. You are making way too many accounts and have been blocked. This is not part of the puzzle. Please email us with an explanation");
        }

        //Succeptable to noSQL injection by entering {"$gt": ""} for username and password!
        //For attack to work an admin user with an int username and pass needs to exist.
        Admin.findOne({username: username, password: password}).maxTime(1000).exec(function(err,admin){
            if (err) return next(err);
            if (!admin) return res.send("ACCOUNT NOT FOUND");

            console.log(admin);

            console.log(user.accounts);
            res.render('admin-panel', {students:user.accounts});


        });


    });
};


module.exports = AdminController;
