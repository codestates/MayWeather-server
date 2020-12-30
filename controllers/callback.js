// OAuth
require("dotenv").config();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
const axios = require("axios");

// 1. Authorization Code가 왔는지 확인한다.
// 2. 클라이언트 아이디, 비번, 코드 세 개를 주면서, 깃허브에게 말한다.
// 3. 서버 : 깃허브야 너가 준 어써라이제이션 코드야! 나 알지? OAuth 등록했잖아~~~ 토큰 좀 줘봐
// 4. 깃허브 : ㅇㅇ 너 걔구나 너의 액세스 토큰을 줄게!
// 5. 서버 : 액세스 토큰을 발급 받았다! 이제 클라이언트 줘야지

module.exports = {
  post: async (req, res) => {
    //1.
    const code = req.body.authorizationCode;
    console.log("🚀 ~ file: callback.js ~ line 20 ~ post: ~ code", code);

    //2,3. POST https://github.com/login/oauth/access_token
    const accessToken = await axios.post(
      // 4. accessToken에 담김
      "https://github.com/login/oauth/access_token",
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: {
          accept: "application/json", // 이 코드의 당위성을 스스로에게 설명하지 못한다면 지워보기도 하고, 찾아보기도 하고, 콘솔도 찍어보고 하면 좋을 거 같아요
        },
      }
    );
    console.log("accessToken>>>>", accessToken);

    //5.
    if (!accessToken) {
      res.status(404).json({ message: "Not found accessToken" });
    } else {
      res.status(200).json({ accessToken: accessToken.data.access_token });
    }
  },
};
