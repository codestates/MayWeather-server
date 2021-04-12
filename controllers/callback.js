require("dotenv").config();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
const axios = require("axios");

module.exports = {
  post: async (req, res) => {
    const code = req.body.authorizationCode;
    console.log("🚀 ~ file: callback.js ~ line 20 ~ post: ~ code", code);

    
    const accessToken = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: {
          accept: "application/json", 
        },
      }
    );
    console.log("🚀 ~ file: callback.js ~ line 33 ~ post: ~ accessToken", accessToken)

    if (!accessToken) {
      res.status(404).json({ message: "Not found accessToken" });
    } else {
      res.status(200).json({ accessToken: accessToken.data.access_token });
    }
  },
};
