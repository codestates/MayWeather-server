const { Location, User, UserLocation } = require("../models");
// console.log("model>>>", model);
//   Location: Location,
//   User: User,
//   UserLocation: UserLocation,

module.exports = {
  post: async (req, res) => {
    const { userId, password, email, username, location } = req.body;

    const [user, created] = await User.findOrCreate({
      where: {
        userId: userId,
      },
      defaults: {
        userId,
        password,
        email,
        username,
      },
    });
    // console.log("created", created); // boolean
    // console.log("user>>>>", user);
    /* 
    { 
        dataValues : { 
            id: 1, userId: 'kimcoding', password: 'abc123', email : 'kimcoding@google.com', 
            username: 'kimkim', updatedAt: 2020-12-23T15:59:25.832Z, createdAt: 2020-12-23T15:59:25.832Z
        },
        ...
    }
    */

    const userPk = user.dataValues.id; // 1

    // location 지역별 id 알아내기 위해

    const locationInArr = location.split(",");
    console.log("locationInArr>>>>", locationInArr);

    if (locationInArr.length === 1) {
      // 지역 1개일 때
      const getLocation = await Location.findOne({
        where: { location: locationInArr[0] },
      });
      // console.log("getLocation>>>", getLocation);
      /*
      {
          dataValues: {
              id: 1,
              location: 'seoul',
              createdAt: 2020-12-23T16:11:42.000Z,
              updatedAt: 2020-12-23T16:11:42.000Z
          },
          ...
      }
      */
      const locationPk = getLocation.dataValues.id; // 1 (seoul)
      // console.log("locationPk", locationPk);
      if (!created) {
        // 생성되지 않았다면
        res.status(409).json({
          message: "UserId exists",
        });
      } else {
        // ','가 없으면 location 1개 ,else는 .. 머리 굴려봐야 겠씁니다 // 여기서가 아니라 위에서 getLocation 값 구할 떄부터 처리해야겠네
        const joinTable = await UserLocation.create({
          userId: userPk,
          locationId: locationPk,
        });
        //   console.log("joinTable>>>", joinTable);
        /*
        {
          {
          dataValues: {
              id: 1,
              userId: 2,
              locationId: 1,
              updatedAt: 2020-12-23T16:23:10.223Z,
              createdAt: 2020-12-23T16:23:10.223Z
           },
        }
        */
        if (joinTable) {
          res.status(201).json({
            //    const { userId, password, email, username, location } = req.body;
            userId,
            email,
            username,
            location,
          });
        }
      }
    }
    // 지역 2개 일 때
    else if (locationInArr.length === 2) {
      const getLocation1 = await Location.findOne({
        where: { location: locationInArr[0] },
      });
      const getLocation2 = await Location.findOne({
        where: { location: locationInArr[1] },
      });
      console.log("getLocation1>>>>", getLocation1);
      console.log("getLocation2>>>>", getLocation2);
      const location1Pk = getLocation1.dataValues.id; // 1 (seoul)
      const location2Pk = getLocation2.dataValues.id; // 1 (seoul)
      //
      if (!created) {
        // 생성되지 않았다면
        res.status(409).json({
          message: "UserId exists",
        });
      } else {
        // ','가 없으면 location 1개 ,else는 .. 머리 굴려봐야 겠씁니다 // 여기서가 아니라 위에서 getLocation 값 구할 떄부터 처리해야겠네
        const joinTable1 = await UserLocation.create({
          userId: userPk,
          locationId: location1Pk,
        });
        const joinTable2 = await UserLocation.create({
          userId: userPk,
          locationId: location2Pk,
        });
        //   console.log("joinTable>>>", joinTable);
        /*
    {
      {
      dataValues: {
          id: 1,
          userId: 2,
          locationId: 1,
          updatedAt: 2020-12-23T16:23:10.223Z,
          createdAt: 2020-12-23T16:23:10.223Z
       },
    }
    */
        console.log;
        if (joinTable1 && joinTable2) {
          const locations =
            getLocation1.dataValues.location +
            "," +
            getLocation2.dataValues.location;
          res.status(201).json({
            //    const { userId, password, email, username, location } = req.body;
            userId,
            email,
            username,
            location: locations,
          });
        }
      }
    }
  },
};

// 중복 발생, 지역1개냐 2개냐 약간은 다르지만 함수화 시키는 리팩토링 필요할 듯 합니다.
// if (!created) {
//   // 생성되지 않았다면
//   res.status(409).json({
//     message: "UserId exists",
//   });
// } else {
//   // ','가 없으면 location 1개 ,else는 .. 머리 굴려봐야 겠씁니다 // 여기서가 아니라 위에서 getLocation 값 구할 떄부터 처리해야겠네
//   const joinTable = await UserLocation.create({
//     userId: userPk,
//     locationId: locationPk,
//   });
//   //   console.log("joinTable>>>", joinTable);
//   /*
//   {
//     {
//     dataValues: {
//         id: 1,
//         userId: 2,
//         locationId: 1,
//         updatedAt: 2020-12-23T16:23:10.223Z,
//         createdAt: 2020-12-23T16:23:10.223Z
//      },
//   }
//   */
//   if (joinTable) {
//     res.status(201).json({
//       //    const { userId, password, email, username, location } = req.body;
//       userId,
//       email,
//       username,
//       location,
//     });
//   }
//     }
//   },
// }
