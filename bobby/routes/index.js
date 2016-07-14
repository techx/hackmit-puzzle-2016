var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated())
        console.log(req.user)
        res.render('index', {title: req.user.githubUsername});
    }
    else res.redirect('/auth');
});

module.exports = router;
