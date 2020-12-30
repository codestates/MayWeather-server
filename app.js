const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const router = require("./routes");
require("dotenv").config();

const options = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: "mysql",
};

// const connection = mysql.createConnection(options);
// connection.connect();

// const sessionStore = new MySQLStore(connection);

app.use(
  session({
    // key: "session_cookie_name", // express-mysql-session 공식문서에 있어서 일단 가져와 뒀습니다.
    secret: "djfkladfj", // 암호화할 때 사용되는 salt
    resave: false,
    saveUninitialized: true,
    // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    //  쿠키 옵션, https일때 에러 확인하고 켜주기
    cookie: {
      domain: "localhost", // 배포시 s3 도메인으로 변경
      // domain: "d1mqftl0z0tfaj.cloudfront.net",
      path: "/", // 기본값 '/', 모든 URL에서 쿠기 전송 가능
      maxAge: 24 * 6 * 60 * 10000, // sec
      sameSite: "none", // none으로 설정하면 secure 강제됨, none은 모든 요청 서버 -> 클라이언트 보내주는데 안전한가?
      httpOnly: true, // No JS
      secure: true, // HTTPS Protocol
    },
    // store: sessionStore,
    // store : new RedisStore({})
  })
);

app.use(morgan("dev")); // 개발환경 -> dev, 배포 -> combine 등등

app.use(express.json()); // 내장된 바디파서

app.use(
  cors({
    origin: "https://localhost:3000", // 배포시s3 도메인으로 변경
    // origin: "https://d1mqftl0z0tfaj.cloudfront.net",
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
