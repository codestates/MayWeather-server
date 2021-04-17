// ? 이 파일 실행시키면 models/index.js 실행되네??
const express = require("express");
const router = express.Router();

const {
  landing,
  myLocation,
  userInfo,
  signUp,
  signIn,
  logout,
  fineDust,
  mypage,
  // content,
  // friends,
  // mypage,
  // callback,
} = require("../controllers");

// * GET /
router.get("/", landing.get);

// * POST /
router.post("/", landing.post);

// GET /my-location
router.get("/my-location", myLocation.get);

// POST /my-location
router.post("/my-location", myLocation.post);

// * POST /sign-up
router.post("/sign-up", signUp.post);

// * POST /sign-in
router.post("/sign-in", signIn.post);

// * GET /userInfo
router.get("/user-info", userInfo.get);

// * POST /logout
router.post("/logout", logout.post);

// * GET /fineDust
router.get("/fine-dust", fineDust.get);

// * GET /fineDust
router.post("/fine-dust", fineDust.post);

// * POST /mypage
router.post("/mypage", mypage.post);

// // * POST /callback Authorization
// router.post("/callback", callback.post);

module.exports = router;
