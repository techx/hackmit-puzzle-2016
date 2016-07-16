module.exports = (function () {
  "use strict";
  var crypto = require('crypto'),
      fs = require('fs'),
      path = require('path');

  var Promise = require("bluebird");

  var Redis = require('ioredis');
  var redis = new Redis();

  var config = require('./config.json');

  var VALID_LEVELS = fs.readdirSync(path.join(__dirname, "public", "levels"))
    .filter(function(name) { return name.endsWith(".json"); })
    .map(function(name) { return name.substring(0, name.length - 5); });

  var LEVELS = {};
  VALID_LEVELS.forEach(function(levelId) {
    LEVELS[levelId] = require('./public/levels/'+levelId+'.json');
  });

  function getLevelConfig(levelId) {
    return LEVELS[levelId];
  }

  function isValidLevel(levelId) {
    return  VALID_LEVELS.indexOf(levelId) !== -1;
  }

  function getUserKey(username) {
    return 'user:' + username;
  }

  function User(name) {
    this.name = name;
    this.nameKey = getUserKey(name);
  }

  User.prototype.completedLevel = function(levelId) {
    if(isValidLevel(levelId)) return redis.sadd(this.nameKey, levelId);
    return Promise.resolve();
  };

  User.prototype.hasCompletedLevel = function(levelId) {
    if(isValidLevel(levelId)){
      return redis.sismember(this.nameKey, levelId);
    } else {
      return Promise.resolve(true);
    }
  };

  User.prototype.remainingLevels = function() {
    return redis.smembers(this.nameKey).then(function(levelIds) {
      var remaining = [];
      VALID_LEVELS.forEach(function(levelId) {
        if(levelIds.indexOf(levelId) == -1) remaining.push(levelId);
      });
      return remaining;
    });
  };

  User.prototype.generateHash = function() {
    var hex = crypto.createHash('sha256').update(this.name.toLowerCase() + config.secret).digest('hex');
    var index = hex.split("").reduce(function(a,b){return a + b.charCodeAt(0)},0);
    var answer = config.colors[index % config.colors.length];
    return answer;
  };

  return {
    User: User,
    isValidLevel: isValidLevel,
    getLevelConfig: getLevelConfig,
    getValidLevels: function() {
      return VALID_LEVELS
    }};
})();
