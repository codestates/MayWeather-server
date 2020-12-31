module.exports = {
  post: (req, res) => {
    //세션아이디가 없다면 로그인한 적이 없으므로

    // 로그아웃을 한다는 전제는 로그인이 되어있는 상태이고
    // 로그인이 되어있다는 것은 세션을 갖고 있다는 것이기 때문입니다. (회원,비회원 한정)

    // 회원이든 비회원이든 로그아웃 버튼 누를 때, withCredentials - true해주면
    // 둘 다 session.userId가 자동으로 보내지니 서버에서는
    // session.userId이 존재하면 파괴해주면 회원이나 비회원이나 둘 다 같은 로직으로
    // 로그아웃 기능이 작동하지 않을까 싶습니다.
    // 유저가 로그아웃을 하지 않고 웹브라우저를 닫으면 세션은 종료된다고 들어서
    // ? (세션 파괴를 자동적으로 웹 브라우저가 해주나?)
    // 어떤 API 살펴봐야할까?

    // 1.클라이언트측에서 비동기적으로 작동하는 close를 찾아서 대체하거나
    // if(window.close()) {
    //   axios.post('/logou', null, { withCredentias : true } )
    // }

    //////////

    if (!req.session.userId && !req.session.userId1) {
      res.status(400).json({
        message: "Not authorized",
      });
    } else {
      // 세션을 파괴해준다.
      // 비회원 로그인 -> 회원 로그인 하면, 비회원, 회원 세션 둘 다 있는데, 회원 로그아웃하면 모든 세션 다 파괴해서 모든 상태 로그아웃 시킴
      req.session.destroy(() => {
        // ! test
        res.status(205).json({
          message: "Logout completed",
        });
      });
    }
  },
};
