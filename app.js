const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser"); // 바디파서 라이브러리 사용 안하고도 도전해보기
const morgan = require("morgan");
const app = express();
const https = require("https"); // install
const fs = require("fs"); // 내장되있는 걸로 기억
//const dotenv = require("dotenv")
//dotenv.config() 는 아래와 같다.
require("dotenv").config(); //

app.use(
  session({
    secret: "djfkladfj", // 암호화할 때 사용되는 salt
    resave: false,
    saveUninitialized: true, //
  })
);

app.use(morgan("dev")); // 개발환경 -> dev, 배포 -> combine 등등

console.log("환경변수 넌 누구냐", process.env.HI);
app.use(bodyParser.json()); //bodyParser 라이브러리 버전 추후 내장기능으로 변경해볼 예정

app.use(
  cors({
    origin: "http://localhost:3000",
    method: "GET,POST",
    credentials: true, // 무슨 기능인지 공부필요..
  })
);

console.log("__dirname", __dirname); // /Users/minwoopark/Desktop/im24project11-server + app.js
console.log("__filename", __filename); // /Users/minwoopark/Desktop/im24project11-server/app.js

https
  .createServer(
    {
      key: fs.readFileSync(__dirname + "/key.pem", "utf-8"), // /Users/minwoopark/Desktop/im24project11-server/key.pem
      cert: fs.readFileSync(__dirname + "/cert.pem", "utf-8"),
    },
    app.use("/", (req, res) => {
      res.send("반갑습니다 해돋이님 리모트 주소가 바껴도 잘 작동할까요?");
    })
  )
  .listen(5000, () => {
    console.log("server on 5000");
  });

/*
const https = require('https'); // install
const fs = require('fs'); // 내장되있는 걸로 기억
const express = require('express');  // dd 

const app = express();

https
  .createServer(
    {
      key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
      cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8'),
    },
    app.use('/', (req, res) => {
      res.send('Congrats! You made https server now :)');
    })
  )
  .listen(3001);

*/
