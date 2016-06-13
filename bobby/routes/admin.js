var express = require('express');
var router = express.Router();

var adminController = require('../controllers/admin-controller');


router.get('/login', adminController.renderLogin);
router.post('/login', adminController.login);

module.exports = router;
