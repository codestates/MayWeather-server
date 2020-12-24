/*
컨텐트 페이지에서 필요한 유저정보를 응답해줌 -> 지역
1.비회원
2.회원
3.소셜
에 따라서 다른정보?

같은 지역의 친구 3명의 정보를 응답

req
로그인할 때 만들어준 세션 객체를 헤더에 담아서 자동으로 보냄.
크레덴셜 옵션 필요.

*/
const { Location, User, UserLocation } = require("../models");
// console.log("model>>>", model);
//   Location: Location,
//   User: User,
//   UserLocation: UserLocation,

module.exports = {
  get: async (req, res) => {
    console.log("req.session", req.session);
    console.log("req.session.id", req.session.id);
    // const sess = req.session.userId; // 로그인할 때 유저의 PK 담아줬음.
    // console.log("sess", sess);
    // const userInfo = await User.findOne({
    //   where: {
    //     id: sess,
    //   },
    // });

    // console.log("userInfo", userInfo);

    // res.status(200).json({
    //   userId,
    //   username,
    //   email,
    //   location,
    // });
  },
};
