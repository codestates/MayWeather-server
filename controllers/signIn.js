const crypto = require("crypto");
const { User } = require("../models");

module.exports = {
  post: async (req, res) => {
    try {
      const { email, password } = req.body;
      const getUserInfo = await User.findOne({
        where: {
          email,
        },
      });

      let salt = getUserInfo.dataValues.salt;

      crypto.pbkdf2(password, salt, 100000, 64, "sha512", async (err, key) => {
        //   console.log("password:", key.toString("base64"));
        let getPassword = key.toString("base64");

        if (email && getPassword) {
          const userInfo = await User.findOne({
            where: {
              email,
              password: getPassword,
            },
          });
          console.log(
            "🚀 ~ file: signIn.js ~ line 14 ~ post: ~ userInfo",
            userInfo
          );

          if (!userInfo) {
            res.status(401).json({ message: "Unauthorized" });
          } else {
            req.session.userId = userInfo.dataValues.id; // primary key
            res.status(200).json({
              message: "OK",
              // message: userInfo.dataValues.id
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
};
