const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const https = require("https");
const fs = require("fs");
const router = require("./routes");
require("dotenv").config();

app.use(
  session({
    secret: "djfkladfj", // 암호화할 때 사용되는 salt
    resave: false,
    saveUninitialized: true,
    //  쿠키 옵션, https일때 에러 확인하고 켜주기
    // cookie: {
    //   domain: "localhost", // 배포시 s3 도메인으로 변경
    //   path: "/", // 기본값 '/', 모든 URL에서 쿠기 전송 가능
    //   maxAge: 24 * 6 * 60 * 10000, // sec
    //   sameSite: "none", // none으로 설정하면 secure 강제됨, none은 모든 요청 서버 -> 클라이언트 보내주는데 안전한가?
    //   httpOnly: true, // No JS
    //   secure: true, // HTTPS Protocol
    // },
  })
);

app.use(morgan("dev")); // 개발환경 -> dev, 배포 -> combine 등등

app.use(express.json()); // 내장된 바디파서

app.use(
  cors({
    origin: "http://localhost:3000", // 배포시 https + s3 도메인으로 변경
    method: "GET,POST,OPTION",
    credentials: true, // 쿠키를 요청에 포함
  })
);

app.use("/", router);

// https
//   .createServer(
//     {
//       key: fs.readFileSync(__dirname + "/key.pem", "utf-8"),
//       cert: fs.readFileSync(__dirname + "/cert.pem", "utf-8"),
//     },
app
  // )
  .listen(443, () => {
    //  http : 80, https: 443 바꿔주기
    console.log("server on https 443");
  });
