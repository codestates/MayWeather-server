const { Location, User, UserLocation } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op; //

module.exports = {
  get: async (req, res) => {
    console.log("req.session.userId>>>>", req.session.userId); // ! 3

    // session.userId 가 일치하지 않는 경우 ->
    // ! 박민우 생각 : session.userUd 가 일치하지 않는 경우는 없는 거 같습니다. 로그인 시 서버에서 req.session.userID = User 테이블의 id를 담아주기 때문에
    // ! 컨텐트에서는 req.session.userId(1)가 있거나 ((회원or비회원)로그인 된 상태), 없거나 (로그인 하기 전) 상태로 구분 될 거 같습니다.
    if (!req.session.userId && !req.session.userId1) {
      // 비회원, 회원 둘 중 하나도 로그인 안해서 세션 객체 없을 때
      res.status(401).json("Not authorized"); // ! who are you라고 응답하였는데, API문서와 달라 클라이언트 측에서 혼란이 있을 수 있으니 API문서대로 응답하겠습니다.
    }

    // ! 비회원 로그인 했을 때 로직 시작
    // (모든 지역 정보 다 줘서 클라이언트에서 알아서 할 수 있으나 혹시 어려움을 겪는다면 서버에서 응답해주기 위해 미리 코드는 만들어둠)

    // 최초 조건문에선는 userId1만 확인, 처음부터 userId1만 있냐, userId2 둘 다 있냐 묻는 조건문을 작성하면 else if가 또 늘어남. 추후 로직에서 userId2도 있으면 지역 2개 응답.

    // ! 회원 세션은 없고 && 비회원 세션만 있을 때, 왜냐하면 1.비회원 로그인하고 2.회원가입해서 회원로그인 하면, 비회원,회원 세션 모두 존재함.
    // ! 그 때는 회원인 경우로 보여주기. 왜냐하면 회원 로그인하고 비회원 로그인 하려면 회원 로그아웃을 했기 때문에, 회원 세션이 파괴됨.
    // ! 비회원, 회원 세션 모두 존재하는 경우의 수는 1.비회원 로그인 -> 2.회원 로그인 밖에 없음. 그러니 회원 로그인이 마지막이기 때문에 회원 정보 보여주기
    else if (!req.session.userId && req.session.userId1) {
      // 비회원 세션 아이디에는 지역이름이 들어있음.
      location = req.session.userId1; // ex) location = 'seoul' 담아줌
      // 비회원이 지역 2개 선택했다면?
      if (req.session.userId2) {
        location = location + "," + req.session.userId2;
      }
      res.status(200).json({
        location,
      });
    }
    // ! 비회원 로그인 했을 때 로직 끝
    //----------------------------------------------------------------------
    // ! 회원 로그인 했을 때 로직 시작
    // ! session.userId 가 있는 경우
    else if (req.session.userId) {
      // 유저정보 -> User 테이블에서
      const userInfo = await User.findOne({
        attributes: ["userId", "email", "username"],
        where: {
          id: req.session.userId,
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

      //----------------------------------------------------------------------

      //유저가 선택한 지역 모두 가져오기 -> favoriteAreaArr

      // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
      const locaId = await UserLocation.findAll({
        attributes: ["locationId"],
        where: {
          userId: req.session.userId,
          // ! session.userId 줄 수 있는 버전으로 수정했습니다.
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

      //      if (locaIdArr !== 0) { <- 지역은 무조건 고르는 거 아닌가?
      //location 찾기 Location테이블에서 locationId 와 일치하는 location 명을 모두 찾아 보냄
      const favoriteArea = await Location.findAll({
        attributes: ["location"],
        where: {
          // Op는 시퀄라이즈를 require 해야 사용가능한 메소드 .or 은 or 연산자 역할 값은 배열형태로 들어가야한다.
          id: { [Op.or]: locaIdArr },
          // id: { [Op.or]: [1, 3] },
        },
      });
      console.log(
        "🚀 ~ file: content.js ~ line 80 ~ get: ~ favoriteArea",
        favoriteArea
      );
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

      // ex) [ "seoul", "busan" ]
      // let favoriteAreaArr = favoriteArea.map((el) => {
      //   return JSON.stringify(el.dataValues.location);
      // });

      // let resLocations = favoriteArea.join(",");
      // console.log(
      //   "🚀 ~ file: content.js ~ line 122 ~ get: ~ resLocations",
      //   resLocations // object SequelizeInstance:Location],[object SequelizeInstance:Location]
      // );
      // [ "seoul", "busan" ] -> "seoul, busan"이 안됨.

      // ! 응답할 때 사용될 String 타입의 지역
      let testRes = favoriteArea[0].dataValues.location;
      // 지역이 1개만 있을 경우를 대비해 if문을 사용할 것이고, if문을 사용하면 스코프 안에서만 사용 가능하니 바깥에서 미리 변수를 만들어 둠

      if (favoriteArea[1]) {
        testRes = testRes + "," + favoriteArea[1].dataValues.location;
      }

      //---------------------------------------------------------------------
      // res.status(200).json({ userInfo, favoriteAreaArr });
      // ! content에서 유저 정보만 주기로 수정했으니 응답에서 favoriteAreaArr 삭제하였습니다.

      const { userId, username, email } = userInfo;

      res.status(200).json({
        userId,
        username,
        email,
        location: testRes,
      });
    }
  },
  // ! 회원 로그인 했을 때 로직
};

/*
컨텐트 페이지에서 필요한 유저정보를 응답해줌 -> 지역
1.비회원 -> 필요한 정보는 날씨인데 이미 가지고 있음
2.회원 -> session id 일치하면 유저정보와 조인테이블의 지역정보
3.소셜
에 따라서 다른정보?

같은 지역의 친구 3명의 정보를 응답

req
로그인할 때 만들어준 세션 객체를 헤더에 담아서 자동으로 보냄.
크레덴셜 옵션 필요.

*/
