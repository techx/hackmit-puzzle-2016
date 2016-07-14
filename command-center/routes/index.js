var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');
/* GET home page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        userController.getIndex(req, res);
    } else {
         res.render('index', { title: "haxkcd" });
    }
});

// disabled for now (why was this even here?
// router.get('/aretherespotsleft', userController.areThereSpotsLeft);

module.exports = router;
