// ? 이 파일 실행시키면 models/index.js 실행되네??
const express = require("express");
const router = express.Router();

const {
  landing,
  myLocation,
  // signup,
  // login,
  // content,
  // friends,
  // mypage,
  // logout,
  // callback,
} = require("../controllers");

// * GET /
router.get("/", landing.get);

// GET /my-location
router.post("/myLocation", myLocation.post)

// // * POST /signup
// router.post("/signup", signup.post);

// // * POST /login
// router.post("/login", login.post);

// // * GET /content
// router.get("/content", content.get);

// // * GET /friends
// router.post("/friends", friends.post);

// // * POST /mypage
// router.post("/mypage", mypage.post);

// // * POST /logout
// router.post("/logout", logout.post);

// // * POST /callback Authorization
// router.post("/callback", callback.post);

module.exports = router;
