const { Location, User, UserLocation } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op; //

module.exports = {
  get: async (req, res) => {
    // session.userId 가 일치하지 않는 경우
    if (req.session.userId) {
      res.status(401).json("who are you?");

      //----------------------------------------------------------------------
      // session.userId 가 일치하는 경우
    } else {
      // 유저정보 -> User 테이블에서
      const userInfo = await User.findOne({
        attributes: ["userId", "email", "username"],
        where: {
          id: 1,
          //id : req.session.userId
        },
      });
      //----------------------------------------------------------------------

      //유저가 선택한 지역 모두 가져오기 -> favoriteAreaArr

      // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
      const locaId = await UserLocation.findAll({
        attributes: ["locationId"],
        where: {
          userId: 1,
          //userId : req.session.userId
        },
      });

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
        },
      });

      // ex) [ "seoul", "busan" ]
      let favoriteAreaArr = favoriteArea.map((el) => {
        return el.dataValues.location;
      });
      //---------------------------------------------------------------------
      res.status(200).json({ userInfo, favoriteAreaArr });
    }
  },
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
