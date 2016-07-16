/*
 * Setup Libraries and routes
 * @author - Patrick Insinger
 * @author - Anthony Liu
 * @author - Mac Liu
 */

// imports
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    Promise = require('bluebird'),
    model = require('./model'),
    gameValidator = require('./gameValidator'),
    User = model.User;

// variables
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/:userName/status', function(req, res){
  var user = new User(req.params.userName);
  var levelId = req.params.levelId;

  user.remainingLevels().then(function(remaining) {
    var verify = null;
    if (remaining.length === 0) verify = user.generateHash();
    res.json({
      "verify": verify,
      "remaining": remaining
    });
  });
});

app.get('/play/:userName/:levelId', function(req, res) {
  res.sendfile('game.html');
});

app.get('/play/:userName', function(req, res) {
  res.redirect('/play/'+req.params.userName+'/' + model.getValidLevels()[0]);
});

app.post('/api/:userName/:levelId/validate', function(req, res) {
  var user = new User(req.params.userName);
  var levelId = req.params.levelId;

  var programText = req.body.text;

  if(programText == null) {
    res.status(400).end("bad request");
    return;
  }

  if(!model.isValidLevel(levelId)){
    res.status(400).end("bad request");
    return;
  }

  user.hasCompletedLevel(levelId).then(function(hasCompletedLevel) {
    if(
      !hasCompletedLevel &&
      gameValidator.validate(
        programText,
        model.getLevelConfig(levelId)
      )
    ) {
      return user.completedLevel(levelId);
    } else {
      return Promise.resolve();
    }
  }).then(function() {
     return user.remainingLevels();
  }).then(function(remaining) {
    var verify = null;
    if (remaining.length === 0) verify = user.generateHash();
    res.json({
      "verify": verify,
      "remaining": remaining
    });
  });
});

app.use(function(req,res){
    res.redirect('/');
});

module.exports = app;
