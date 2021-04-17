const crypto = require("crypto");

module.exports = {
  post: (req, res) => {
    // console.log(
    //   "base64:",
    //   crypto.createHash("sha512").update("비밀번호").digest("base64")
    // ); // base64: dvfV6nyLRRt3NxKSlTHOkkEGgqW2HRtfu19Ou/psUXvwlebbXCboxIPmDYOFRIpqav2eUTBFuHaZri5x+usy1g==
    // console.log("body", req.body); //  { prevPassword: '123123123', newPassword: '123123123' }

    crypto.randomBytes(64, (err, buf) => {
      const salt = buf.toString("base64");
      console.log("salt:", salt); // salt: o5i6IqKcAgdmtgNeWX6PUIYmk0UrBbTUixf0JLnmw9ec6UpYMBiEX5xvirA2SBGxFxAMSPM9vEdwyPBMW3lxZg==
      crypto.pbkdf2("비밀번호", salt, 100000, 64, "sha512", (err, key) => {
        console.log("password:", key.toString("base64"));
        //   password: pXvdGSCAQe +
        // RKW9mxGL +
        // TTqFfZ9n2Ugh0XcujchxEhkjY7iwv +
        // eT3e +
        // nn0ZmtQdQ4PCTCxWApsfpsaGhjNfzTA ==
      });
    });
  },
};
