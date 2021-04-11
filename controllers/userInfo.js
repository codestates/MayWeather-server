const { User, Pet } = require('../models');

module.exports = {
    get: async (req, res) => {
        console.log('req.session.userId>>>>>', req.session.userId)
        try{
            const userInfo = await User.findOne({                
                where: {
                    id: req.session.userId
                }
            })
            console.log("🚀 ~ file: userInfo.js ~ line 12 ~ get: ~ userInfo", userInfo)
            
            if (userInfo.dataValues) {
                res.status(200).json({
                    id: userInfo.dataValues.userId,
                    name: userInfo.dataValues.username,
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