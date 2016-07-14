var express = require('express');
var router = express.Router();

var adminController = require('../controllers/admin-controller');

var authenticate = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};

router.get('/login', authenticate, adminController.renderLogin);
router.post('/login', authenticate, adminController.login);

module.exports = router;
