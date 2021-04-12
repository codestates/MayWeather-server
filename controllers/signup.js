const { Location, User, User_Location } = require("../models");

module.exports = {
  post: async (req, res) => {
    const { name, email, password, city1, city2 } = req.body;
    console.log("🚀 ~ file: signup.js ~ line 6 ~ post: ~ city1", city1)
    console.log("🚀 ~ file: signup.js ~ line 6 ~ post: ~ city2", city2)
  
    if (name && email && password && city1) {
      //! 지역 1개만 선택한 경우
      
      //! 1. User 테이블에 정보 입력
      const [user, created] = await User.findOrCreate({
        where: {
          email
        },
        defaults: {
          name,
          password,
          email,
        },
      });
      // console.log("🚀 ~ file: signup.js ~ line 20 ~ post: ~ user id>>>>", user.dataValues.id) // 3
      
      //! 2. get Location ID
      // 지역 1개 선택했을 경우
      if (!city2) {
        const getLocation = await Location.findOne({
          where: {
            name: city1
          }
        })
          // console.log("🚀 ~ file: signup.js ~ line 27 ~ post: ~ getLocation location id>>>", getLocation.dataValues.id)  // 1
        
          //! 3. create filed in User_Location
          const userLocation = await User_Location.create({
            userId: user.dataValues.id,
            locationId: getLocation.dataValues.id
          })
          console.log("🚀 ~ file: signup.js ~ line 35 ~ post: ~ userLocation", userLocation)
        
          if(created && userLocation) {
            res.status(201).json({
              message: 'Created'
          })
          } else {
            res.status(409).json({
              message: '"This account exists"'
            })
          }
        }
        //! 지역 2개 선택한 경우
         else {
          console.log('지역 2개')
      
        //! 2. get Location ID
        const getLocation = await Location.findAll({
          where: {
            name: [city1, city2]
          }
        })
        // console.log("🚀 ~ file: signup.js ~ line 60 ~ post: ~ getLocation", getLocation[0].dataValues.id) // 1
        // console.log("🚀 ~ file: signup.js ~ line 60 ~ post: ~ getLocation", getLocation[1].dataValues.id) // 14
        
        //! 3. create filed in User_Location
        const userLocation1 = await User_Location.create({
          userId: user.dataValues.id,
          locationId: getLocation[0].dataValues.id
        })
        
        //! 3. create filed in User_Location
        const userLocation2 = await User_Location.create({
          userId: user.dataValues.id,
          locationId: getLocation[1].dataValues.id
        })
        if(created && userLocation1 && userLocation2 ) {
          res.status(201).json({
           message: 'Created'
         })
        } else {
          res.status(409).json({
           message: "This account exists"
          })
        }
      }
    } else {
      res.status(400).json({
        messge: "Bad Request"
      })
    }
  }
}