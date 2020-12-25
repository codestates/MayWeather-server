/* 
회원
비회원
소셜

로그인 요청에 응답을 해야 합니다.
*/

// ! 1,비회원
/*
비회원을 받을 수 있는 테이블은 없는 상태. ㅇㅋ
지역만 선택한다고 했던 걸로 기억합니다. ㅇㅋ
비회원 로그인 된 상태는 세션으로 확인합니다.
로그아웃 할 때 세션 비회원도 회원과 동일하게 합니다.
 */
// ? 비회원 로그인 -> 회원가입 -> 유저 로그인시 세션 값 덮어씌워질까?
// req.ssession.locationName = location / seoul,
// 논멤버 로그인 했을 때 // ! req.ssession.userId
// 비회원이 만약 회원가입을 한다면?
// 회원가입 -> 로그인 // ! 다시 세션 또 받잖아요. (회원 로그인 시 덮어씌울 수 도 있겠네요.)
// req.ssession.userId = 'seoul' -> req.ssession.userId = 1
// -> 멤버 // ! req.ssession.userId

module.exports = {
  post: (req, res) => {
    // ! 1.비회원 세션 로그인 // 피쳐 8!
    // ? 클라이언트가 맨 처음에 상태 다 달라고 했으니까, 응답할게 딱히 없네요.
    const { location } = req.body; // 1개 선택 seoul or 2개 선택 'incheon,daegu'

    const locationArr = location.split(","); // ['incheon','daegu']

    if (locationArr.length === 1) {
      req.ssession.userId = locationArr[0]; // seoul,
      res.status(200).json({
        message: "ok",
      });
    } else if (locationArr.length === 2) {
      // express.session 라이브러리를 사용하면, 자동으로 세이브 메서드가 요청 끝날 때 마다 호출됨.
      // save메서드 사용안해도 req.세션.키 = 값 꼴로 사용가능.
      req.ssession.userId1 = locationArr[0]; // seoul,
      req.ssession.userId2 = locationArr[1]; // seoul,
      res.status(200).json({
        message: "ok",
      });
    }

    // ! 2.회원 세션 로그인  // 피쳐 9!
  },
};

// 컨텐트 겟 요청을 보내서 회원정보를 가지고 오는데 돌려달라고 하는 정보 중에 페이보릿 지역도 돌려달라고 함.
// 비회원도 돌려줘야할까요?
// 비회원 로그인 setState( { 비회원의 로케이션 : res.body.location } )
// 상태를 다 갖고 있으니까
// 셀렉트 박스 e.target.value // input
// 셀렉트 박스 네임 값을 this.state.비회원의 로케이션 : 셀렉트박스 네임 값

// <div> {this.state.비회원의 로케이션} </div>
