var mongoose = require('mongoose');
var request = require('request');
var PuzzleController = {}
var respondWithError = require('../utils/helpers').respondWithError;
var SLACK_WEBHOOK = require('../config').slackWebhook;
var SPAM_WEBHOOK = require('../config').spamWebhook;
var PUBLIC_HOST_URL = require('../config').publicHostUrl;
var PUZZLES = require('../config').puzzles;

var convertToReadableFormat = function(timeout) {
    if (timeout == 0) return 0;
    seconds = parseInt(timeout % 60);
    minutes = parseInt(timeout / 60);
    time = minutes == 0 ? String(seconds) + " seconds" : String(minutes) + " minutes and " + String(seconds) + " seconds";
    return time;
}

var postCompletionToSlack = function(username, callback){
    var options = {
      method: 'post',
      body: {"text": ":tada: <" + PUBLIC_HOST_URL +
                     "/admin/users/" + username + "|" + username + "> has solved the puzzle!",
             "channel": "#puzzle-2016",
             "username": "Puzzle Monitor",
             "icon_emoji": ":haxkcd:" },
      json: true,
      url: SLACK_WEBHOOK
    }
    request(options, function(err, httpResponse, body){
        callback(err, true);
    });
}

var postGuessToSlack = function(username, guess, correct, number) {
    var correctly = correct ? ":white_check_mark:" : ":x:";
    var options = {
      method: 'post',
      body: {"text": correctly + " <" + PUBLIC_HOST_URL +
          "/admin/users/" + username + "|" + username + "> guessed \"" +
          guess + "\" for puzzle " + PUZZLES[number].name,
             "username": "Puzzle Monitor",
             "icon_emoji": ":haxkcd:" },
      json: true,
      url: SPAM_WEBHOOK
    }
    request(options);
}

PuzzleController.createNew = function(req, res){
    mongoose.model('PuzzlePart').count({ user: req.user._id }, function(err, count){
        if (err){
            respondWithError(err, res);
        } else if (count != 0){
            res.status(200).send({message: "You've already started the puzzle!"});
        } else {
            mongoose.model('PuzzlePart').createPart(req.user._id, req.user.githubUsername, 0, function(err, puzzlePart){
                if (err){
                    respondWithError(err, res);
                } else {
                    res.status(201).send({message: "Ok."});
                }
            });
        }
    });
}

PuzzleController.makeGuess = function(req, res){
    mongoose.model('PuzzlePart').findOne({ user: req.user._id, number: req.body.puzzleNumber }
        , function(err, puzzlePart){
            if (err){
                respondWithError(err, res);
            } else if (!puzzlePart) {
                res.status(200).send({ "message": "Could not find this puzzle part." });
            } else {
                puzzlePart.getTimeout(function(err, timeout){
                    if (err){
                        respondWithError(err, res);
                    } else if (timeout != 0) {
                        res.status(200).send({ "message": "You're doing that too fast. This incident will be reported. Please wait "+ convertToReadableFormat(timeout) + " before guessing again." })
                    } else if (puzzlePart.completionTimestamp) {
                        res.status(200).send({ "message": "You already finished this part of the puzzle." });
                    } else {
                        puzzlePart.makeGuess(req.user.githubUsername, req.body.guess, function(err, correct, slack){
                            if (err){
                                respondWithError(err, res);
                            } else {
                                res.status(200).send({ "correct": correct });
                                postGuessToSlack(req.user.githubUsername, req.body.guess, correct, puzzlePart.number);
                                if (slack == "slack") {
                                    postCompletionToSlack(req.user.githubUsername, function(err) {
                                        if (err) {
                                            console.log("Something went wrong with the Slack Webhook.");
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    );
}

//////////////// ADMIN ONLY ////////////////
PuzzleController.getStats = function(req, res) {
    mongoose.model('PuzzlePart').aggregate({
            $group : { _id : "$number" , count: { $sum: 1 }}
        },  function(err, stats){
                if (err){
                    res.status(500).send(err);
                } else {
                    res.status(200).render('admin', { "stats": stats });
                }
            });
}

module.exports = PuzzleController;
