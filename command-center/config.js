config = {}

var getOrDie = function(varName) {
    var variable = process.env[varName];
    if (!variable) {
        throw "You are missing the " + varName + " environment variable.";
    } else {
        return variable;
    }
}

function Puzzle(urlGenerationFunction, verifierFunction) {
    return {
      generateUrl: urlGenerationFunction,
      verifierFunction: verifierFunction
    }
}

config.githubClientId = getOrDie("GITHUB_CLIENT_ID");
config.githubClientSecret = getOrDie("GITHUB_CLIENT_SECRET");
config.publicHostUrl = getOrDie("PUBLIC_HOST_URL");

// Github usernames - feel free to add yourself
config.admins = [ "katexyu",
                  "anishathalye",
                  "kimberli",
                  "vervious",
                  "Detry322",
                  "lzhang124",
                  "ehzhang",
                  "jenniferjzhang",
                  "zareenc",
                  "Fertogo",
                  "mysticuno",
                  "cmnord",
                  "stefren"
                  ];

function check(answer) {
    return function(guess) {
        return guess.toLowerCase().replace(' ', '') ===
            answer.toLowerCase().replace(' ', '');
    };
}

var crypto = require('crypto');

function checkSports() {
  var base = 'thisisacoolsecret3456345keythatnoonewillguess3409582043svnsfduvla07348tsdfgsdh544927859||||';
  return function(guess, username) {
    var hash = crypto.createHash('sha256');
    hash.update(base + username);
    return guess == hash.digest('hex');
  };
}

config.puzzles = [
    /* puzzle 1 */
    Puzzle(function(username){ return "http://hackmit.org/";}, check('answer one')),
    /* puzzle 2 */
    Puzzle(function(username){ return "http://hackmit.org/";}, check('answer two')),
    /* puzzle 3 */
    Puzzle(function(username){ return "http://hackmit.org/";}, check('answer three')),
    /* puzzle 4 */
    Puzzle(function(username){ return "http://hackmit.org/";}, check('answer four')),
    /* puzzle 5 */
    Puzzle(function(username){ return "http://hackmit.org/";}, check('answer five')),
    /* puzzle 6 - Sports */
    Puzzle(function(username){ return "http://sports.haxkcd.com/" + username; }, checkSports()),
];

config.slackWebhook = "https://hooks.slack.com/services/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";

module.exports = config;
