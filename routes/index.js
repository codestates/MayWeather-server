// ? 이 파일 실행시키면 models/index.js 실행되네?
var express = require("express");
var router = express.Router();

const {
    login,
    logout,
    signup,
    home,
    content,
    mypage,
    callback,
    friends
} = require("../controllers"); // 변경이 필요.
//console.log("signup", signup);

// // * GET /
// router.get("/", usersController.login.post);

// * POST /signup
router.post("/signup", signup.post);

// // * POST /login
// router.post("/login", usersController.userinfo.get);

// * GET /content
router.get("/content", content.get);

// * GET /friends
router.get("/friends", friends.get);

// // * POST /mypage
// router.post("/mypage", usersController.userinfo.get);

 // * POST /logout
router.post("/logout", logout.post);

// // * POST /callback Authorization
// router.post("/callback", usersController.userinfo.get);

module.exports = router;
