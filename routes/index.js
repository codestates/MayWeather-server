var express = require('express');
var router = express.Router();

const { usersController } = require('../controllers'); // 변경이 필요.

// * GET /
router.get('/', usersController.login.post);

// * POST /signup
router.post('/signup', usersController.userinfo.get);

// * POST /login
router.post('/login', usersController.userinfo.get);

// * GET /content
router.get('/content', usersController.logout.post);

// * POST /mypage
router.post('/mypage', usersController.userinfo.get);

// * POST /logout
router.post('/logout', usersController.userinfo.get);

// * POST /callback Authorization
router.post('/callback', usersController.userinfo.get);


module.exports = router;
