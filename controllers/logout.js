const { User } = require("../models");

module.exports = {
    post: async (req, res) => {
        try{
            const { userId } = req.session;    
            console.log("🚀 ~ file: logout.js ~ line 7 ~ post: ~ userId", userId)
            if (userId) {
                req.session.destroy((err) => {            
                    console.error('err',err)
                }) 
                res.status(200).json({
                    message: "Logout completed"
                });
            } else {
                res.status(400).json({
                    message: "Bad request",
                });
            }
        } catch(err) {
            console.error(err)
        }
    }
}