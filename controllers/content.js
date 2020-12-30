const { Location, User, UserLocation } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op; //

module.exports = {
  get: async (req, res) => {
    console.log("req.session.userId in content.js>>>>", req.session.userId);

    // session 대신 req.body.userId로 대체

    // 비회원, 회원 둘 중 하나도 로그인 안해서 세션 객체 없을 때
    // if (!req.session.userId && !req.session.userId1) {
    // ! 12번 임시 대체
    if (!req.body.nonMember1 && !req.body.nonMember2) {
      res.status(401).json("Not authorized");
    }

    // ! 비회원 로그인 했을 때 로직 시작
    // else if (!req.session.userId && req.session.userId1) {
    else if (!req.body.userId && req.body.nonMember1) {
      // !회원x  비회원o
      // 비회원 세션 아이디에는 지역이름이 들어있음.
      // location = req.session.userId1; // ex) location = 'seoul' 담아줌
      // ! 22번 줄 임시 대체
      location = req.body.nonMember1;
      // 비회원이 지역 2개 선택했다면?
      // if (req.session.userId2) {
      // location = location + "," + req.session.userId2;
      // ! 26~27 임시 대체
      if (req.body.nonMember2) {
        location = location + "," + req.body.nonMember2;
      }
      res.status(200).json({
        location, // ex) 'seoul' or 'seoul, incheon'
      });
    }
    //---------------------------------------------------------------------
    // ! 회원 로그인 했을 때 로직 시작
    // ! session.userId 가 있는 경우
    // else if (req.session.userId) {
    // ! 39 임시대체
    else if (req.body.userId) {
      const userInfo = await User.findOne({
        attributes: ["userId", "email", "username"],
        where: {
          // id: req.session.userId,
          // ! 임시대체
          id: req.body.userId,
        },
      });
      // console.log(userInfo)
      /* 
        {
          dataValues: {
            userId: 'kimcodingzzang3',
            email: 'kimcoding@google.com',
            username: 'sana'
          },
          ...
      */

      //유저가 선택한 지역 모두 가져오기 -> favoriteAreaArr

      // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
      const locaId = await UserLocation.findAll({
        attributes: ["locationId"],
        where: {
          // userId: req.session.userId,
          // !임시대체
          userId: req.body.userId,
        },
      });
      // console.log("🚀 ~ file: content.js ~ line 52 ~ get: ~ locaId", locaId);
      // console.log("locaId[0].dataValues>>>>>", locaId[0].dataValues);  // { locationId: 3 }
      // console.log("locaId[1].dataValues>>>>>", locaId[1].dataValues); // { locationId : 1 }
      /*
        [
          UserLocation {
            dataValues: { locationId: 3 },
            ...
          }
          ...
        ]
      */

      // 다른 정보들을 잘라낸 locationId 값만으로 이루어진 배열 생성 -> ex) [ 1, 2 ]
      let locaIdArr = locaId.map((el) => {
        return el.dataValues.locationId;
      });

      // location 찾기 Location테이블에서 locationId 와 일치하는 location 명을 모두 찾아 보냄
      const favoriteArea = await Location.findAll({
        attributes: ["location"],
        where: {
          // Op는 시퀄라이즈를 require 해야 사용가능한 메소드 .or 은 or 연산자 역할 값은 배열형태로 들어가야한다.
          id: { [Op.or]: locaIdArr },
        },
      });
      // console.log(
      //   "🚀 ~ file: content.js ~ line 80 ~ get: ~ favoriteArea",
      //   favoriteArea
      // );
      /*
        [
          Location {
            dataValues: { location: 'seoul' },
            ..
          },
          Location {
            dataValues: { location: 'daegu' },
            ..
          },
        ]
      */

      // ! 주석 처리한 이유 : [ "seoul", "busan" ] -> "seoul, busan"이 안됨.
      // ex) [ "seoul", "busan" ]
      // let favoriteAreaArr = favoriteArea.map((el) => {
      //   return JSON.stringify(el.dataValues.location);
      // });

      // let resLocations = favoriteArea.join(",");
      // console.log(
      //   "🚀 ~ file: content.js ~ line 122 ~ get: ~ resLocations",
      //   resLocations // object SequelizeInstance:Location],[object SequelizeInstance:Location]
      // );

      // ! 응답할 때 사용될 String 타입의 지역
      let testRes = favoriteArea[0].dataValues.location;

      if (favoriteArea[1]) {
        testRes = testRes + "," + favoriteArea[1].dataValues.location;
      }

      //---------------------------------------------------------------------

      const { userId, username, email } = userInfo;

      res.status(200).json({
        userId,
        username,
        email,
        location: testRes,
      });
    }
  },
};
