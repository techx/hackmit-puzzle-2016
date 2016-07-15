var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: process.env.BOBBY_GITHUB_ID,
        clientSecret: process.env.BOBBY_GITHUB_SECRET,
        callbackURL: "http://66b2deab.ngrok.io" + "/auth/callback" }, function(accessToken, refreshToken, profile, done) {
            mongoose.model('User')
                .findOrCreate({ githubUsername: profile.username,
                                githubEmail: profile.emails ? profile.emails[0].value : "no@email.com",
                               },
                function (err, user) {
                    return done(err, user);
                });
        }
));

router.get('/',
    passport.authenticate('github'));

router.get('/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/');
        }
    );

router.post('/logout', function(req, res){
    req.session.destroy();
    res.status(200).send({ "message": "Logout successful" });
});

module.exports = router;
