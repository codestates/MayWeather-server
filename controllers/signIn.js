const { User } = require("../models");

module.exports = {
    post: async (req, res) => {
        try{
            const { userId, password } = req.body;
            console.log("🚀 ~ file: signIn.js ~ line 7 ~ post: ~ password", password)
            console.log("🚀 ~ file: signIn.js ~ line 7 ~ post: ~ userId", userId)
            

            if (userId && password) {
                const userInfo = await User.findOne({
                    where: { userId, password }
                  });
                console.log("🚀 ~ file: signIn.js ~ line 14 ~ post: ~ userInfo", userInfo)
                 

                if(!userInfo) {
                    res.status(400).json({ message: "Not authorized"})
                } else{
                    req.session.userId = userInfo.dataValues.id // primary key
                    res.status(200).json({
                        message: "OK"
                        // message: userInfo.dataValues.id
                    })
                }
            }
        }
        catch (err) {
            console.error(err)
        }
    }
}
