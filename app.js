const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("반갑습니다 해돋이님 리모트 주소가 바껴도 잘 작동할까요?");
});

app.listen(5000, () => {
  console.log("서버 온 5000");
});
