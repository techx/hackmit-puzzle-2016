var express = require('express');
var router = express.Router();

var userController = require('../controllers/fake-user-controller');

var authenticate = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};

router.get('/login', authenticate, userController.renderLogin);
router.post('/login', authenticate,  userController.login);

router.get('/register', authenticate, userController.renderRegister);
router.post('/register', authenticate, userController.register);

module.exports = router;
