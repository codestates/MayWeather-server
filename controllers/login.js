/* 회원,비회원,소셜 */

// ! 1,비회원

// ? 비회원 로그인 -> 회원가입 -> 유저 로그인시 세션 값 덮어씌워질까? => 세션 값은 추가 됨.
// req.ssession.locationName = location / seoul,
// 논멤버 로그인 했을 때 // ! req.ssession.userId
// 비회원이 만약 회원가입을 한다면?
// 회원가입 -> 로그인 // ! 다시 세션 또 받잖아요. (회원 로그인 시 덮어씌울 수 도 있겠네요.)
// req.ssession.userId = 'seoul' -> req.ssession.userId = 1
// -> 멤버 // ! req.ssession.userId
const { User } = require("../models");

module.exports = {
  post: async (req, res) => {
    try {
      // ! 1.비회원 세션 로그인 /피쳐 8!
      // ? 클라이언트가 맨 처음에 상태 다 달라고 했으니까, 응답할게 딱히 없네요.
      const { location, userId, password } = req.body; // 1개 선택 seoul or 2개 선택 'incheon,daegu'
      console.log("location>>>>", location);

      if (location) {
        const locationArr = location.split(","); // 문자열 -> 배열 만듦 ['incheon','daegu']
        console.log("locationArr>>>>", locationArr);
        if (locationArr.length === 1) {
          // ! 비회원 세션 객체 구분하기 위해 userId + 숫자 형식을 취하겠습니다.
          req.session.userId1 = locationArr[0]; // seoul,
          res.status(200).json({
            message: "Ok",
          });
        } else if (locationArr.length === 2) {
          // express.session 라이브러리를 사용하면, 자동으로 세이브 메서드가 요청 끝날 때 마다 호출됨.
          // save메서드 사용안해도 req.세션.키 = 값 꼴로 사용가능.
          req.session.userId1 = locationArr[0]; // seoul,
          req.session.userId2 = locationArr[1]; // busan,
          res.status(200).json({
            message: "Ok",
          });
        }
      }
      // ! 비회원 로그인시 지역 정보 없는 경우 (비회원 로그인 시 클라이언트에서 유효성 검사를 실행하지만, 직접 주소창에 /login입력한다면 지역정보가 body에 없는 경우가 생김)
      else if (!location && !userId && !password) {
        res.status(400).json({
          message: "Not authorized",
        });
      } else if (userId && password) {
        // ! 2.회원 세션 로그인  // 피쳐 9!
        const userInfo = await User.findOne({
          where: { userId: userId, password: password },
        });

        if (!userInfo) {
          res.status(400).json({ message: "Not authorized" });
        } else {
          req.session.userId = userInfo.dataValues.id;
          res.status(200).json({
            message: "Ok",
          });
        }
      }
    } catch (err) {
      console.log(err);
    } // catch 안하면 에러가 나네요?
  },
};

// 컨텐트 겟 요청을 보내서 회원정보를 가지고 오는데 돌려달라고 하는 정보 중에 페이보릿 지역도 돌려달라고 함.
// 비회원도 돌려줘야할까요?
// 비회원 로그인 setState( { 비회원의 로케이션 : res.body.location } )
// 상태를 다 갖고 있으니까
// 셀렉트 박스 e.target.value // input
// 셀렉트 박스 네임 값을 this.state.비회원의 로케이션 : 셀렉트박스 네임 값

// <div> {this.state.비회원의 로케이션} </div>
