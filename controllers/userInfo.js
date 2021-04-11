const { User, Pet } = require('../models');

module.exports = {
    get: async (req, res) => {
        const { userId } = req.session
        console.log("🚀 ~ file: userInfo.js ~ line 6 ~ get: ~ userId", userId)
        try{
            const userInfo = await User.findOne({                
                where: {
                    id: userId
                }
            })
            console.log("🚀 ~ file: userInfo.js ~ line 12 ~ get: ~ userInfo", userInfo)
            
            if (userInfo.dataValues) {
                res.status(200).json({
                    email: userInfo.dataValues.email,
                    name: userInfo.dataValues.name,
                })
            } else {
                 res.status(404).json({
                    message: "Not found"
                })
            }
        }
        catch(err) {
            console.error(err)
        }
    }
}