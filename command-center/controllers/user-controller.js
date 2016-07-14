var mongoose = require('mongoose');
var UserController = {}
var respondWithError = require('../utils/helpers').respondWithError;

UserController.areThereSpotsLeft = function(req, res) {
    mongoose.model('User').count({ "completionTime" : { $ne: null}, "isSuspicious": false }
        , function(err, count){
            if (err) {
                respondWithError(err);
            } else {
                res.status(200).send( count < 50 );
            }
        });
}

UserController.getIndex = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            respondWithError(err, res);
        } else if (!user) {
            res.status(404).send({ "error": "This user does not exist." });
        } else {
            res.render('main', {
                currentUser: user.githubUsername,
            });
        }
    });
};

UserController.listPuzzles = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            respondWithError(err, res);
        } else if (!user) {
            res.status(404).send({ "error": "This user does not exist." });
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err) {
                    respondWithError(err, res);
                } else if (puzzleParts.length != 0) {
                    if (err) {
                        respondWithError(err, res);
                    } else {
                        res.status(200).send({
                            puzzleParts: puzzleParts,
                            done: user.completionTime
                        });
                    }
                } else {
                    res.status(200).send({
                        puzzleParts: [],
                        done: false
                    });
                }
            });
        }
    });
}

UserController.finish = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            respondWithError(err, res);
        } else if (!user) {
            res.status(404).send({ "error": "This user does not exist." });
        } else if (!user.completionTime) {
            res.status(200).send({ "message": "You haven't finished all the puzzles yet!" });
        } else {
            if (!req.body.email) {
                res.status(200).send({"message": "Email cannot be empty." });
                return;
            }
            user.githubEmail = req.body.email;
            user.save(function(err){
                if (err) {
                    respondWithError(err, res);
                } else {
                    res.status(200).send({ "message": "Congrats, you finished the puzzle!\nDon't forget to register at my.hackmit.org.\n\n(email recorded as <" + user.githubEmail + ">)" });
                }
            });
        }
    });
}

//////////////////////////////////////////
// Below here only accessible by admins //
//////////////////////////////////////////

UserController.getUserInfo = function(req, res) {
    mongoose.model('User').findOne({ "githubUsername": req.params.githubUsername}, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({ "error": "User not found." });
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err){
                    res.status(500).send(err);
                } else {
                    user.getSubmissionLogs(function(err, logs){
                        if (err){
                            res.status(500).send(err);
                        } else {
                            res.status(200).render("user", { user: user,
                                                             puzzleParts: puzzleParts,
                                                             logs: logs });
                        }
                    });
                }
            });
        }
    });
}

UserController.flagUser = function(req, res) {
    mongoose.model('User').findOne({ "githubUsername": req.params.githubUsername }, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({ "error": "User not found." });
        } else {
            if (req.query.flag == "y") {
                user.flag(req.query.reason, req.user.githubUsername, function(err){
                    if (err){
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({ "message": "Successfully flagged user." });
                    }
                });
            } else {
                user.unflag(function(err){
                    if (err){
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({ "message": "Successfully flagged user." });
                    }
                });
            }
        }
    });
}

UserController.getAllUsers = function(req, res) {
    mongoose.model('User').find({ "completionTime": { $ne: null }}, "githubUsername completionTime isSuspicious created")
        .sort({ "completionTime": 1 })
        .exec(function(err, completedUsers) {
            if (err) {
                res.status(500).send(err);
            } else {
                mongoose.model('User').find({ "completionTime": null}, "githubUsername completionTime isSuspicious")
                .exec(function(err, otherUsers) {
                    if (err){
                        res.status(500).send(err);
                    } else {
                        var users = completedUsers.concat(otherUsers);
                        res.status(200).render("userList", { users: users });
                    }
                });
            }
    });
}

module.exports = UserController;
