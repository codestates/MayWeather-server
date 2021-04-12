const { User, Location, User_Location } = require('../models');

module.exports = {
    get: async (req, res) => {
        const { userId } = req.session
        // console.log("🚀 ~ file: userInfo.js ~ line 6 ~ get: ~ userId", userId)
        try{
            const userInfo = await User.findOne({                
                include:[{
                    model: User_Location,
                    attributes: ['locationId']
                }],
                where: {
                    id: userId
                },
            })
            // console.log("🚀 ~ file: userInfo.js ~ line 17 ~ get: ~ userInfo", userInfo.User_Locations)

            const locationIdArr = [];

            // 지역 2개 고른 유저
            if (userInfo.User_Locations.length === 2) {
                locationIdArr.push(userInfo.User_Locations[0].dataValues.locationId)    
                locationIdArr.push(userInfo.User_Locations[1].dataValues.locationId)    
                const getLocation = await Location.findAll({
                    where: {
                        id: locationIdArr
                    }
                })
                console.log("🚀 ~ file: userInfo.js ~ line 31 ~ get: ~ getLocation", getLocation[0])
                
                if (userInfo.dataValues) {
                    res.status(200).json({                
                        email: userInfo.dataValues.email,
                        name: userInfo.dataValues.name,
                        cityName1: getLocation[0].dataValues.name,
                        cityName2: getLocation[1].dataValues.name
                    })
                } else {
                     res.status(401).json({
                        message: "Unauthorized"
                    })
                }
            } // 지역 1개 고른 유저
             else {
                const getLocation = await Location.findAll({
                    where: {
                        id: userInfo.User_Locations[0].dataValues.locationId
                    }
                })
                
                if (userInfo.dataValues) {
                    res.status(200).json({                
                        email: userInfo.dataValues.email,
                        name: userInfo.dataValues.name,
                        cityName1: getLocation[0].dataValues.name,
                    })
                } else {
                     res.status(401).json({
                        message: "Unauthorized"
                    })
                }
            }

        }
        catch(err) {
            console.error(err)
        }
    }
}