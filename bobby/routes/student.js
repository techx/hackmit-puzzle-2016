var express = require('express');
var router = express.Router();

var userController = require('../controllers/fake-user-controller');


router.get('/login', userController.renderLogin);
router.post('/login', userController.login);

router.get('/register', userController.renderRegister);
router.post('/register', userController.register);

module.exports = router;
