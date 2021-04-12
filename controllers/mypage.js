const { Location, User, UserLocation } = require("../models");
// console.log("model>>>", model);
//   Location: Location,
//   User: User,
//   UserLocation: UserLocation,

module.exports = {
  post: async (req, res) => {
    const id = req.session.userId;
    const { userId, prevLocation, location } = req.body;
    // console.log("userId>>>>", userId); // kimcodingzzang3
    // console.log("prevLocation>>>>", prevLocation); // seoul
    // console.log("location>>>>", location); // busan

    // ! req.session.userId 유효성 검사 추가
    if (!id) {
      res.status(404).json({
        message: "Not Found",
      });
    }

    const getUserInfo = await User.findOne({
      // 유저 ID 찾기
      where: { id },
    });
    console.log(
      "🚀 ~ file: mypage.js ~ line 18 ~ post: ~ getUserInfo",
      getUserInfo
    );

    // console.log("getUserInfo", getUserInfo);
    /*
    {
        dataValues: {
            id: 3,
            userId: 'kimcodingzzang3',
            password: 'abc123',
            email: 'kimcoding@google.com',
            username: 'kimcoding',
            createdAt: 2020-12-24T05:19:20.000Z,
            updatedAt: 2020-12-24T05:19:20.000Z
        },
        ...
    }
    */

    const getUserId = getUserInfo.dataValues.id; // 유저 ID 찾기 => 3

    // ! 이전 지역 아이디 찾기 위함
    const prevLocationInfo = await Location.findOne({
      // 새로 바꿀 지역의 정보
      where: { location: prevLocation }, // busan 들어감
    });

    // console.log("prevLocationInfo>>>", prevLocationInfo);
    /*
      {
           dataValues: {
          id: 5,
          location: 'busan',
          createdAt: 2020-12-24T04:48:26.000Z,
          updatedAt: 2020-12-24T04:48:26.000Z
          },
      }
      */
    const prevLocationId = prevLocationInfo.dataValues.id; // 새로 바꿀 지역의 아이디 => 5

    // ! 새로운 지역 아이디 찾기 위함
    const newLocationInfo = await Location.findOne({
      // 새로 바꿀 지역의 정보
      where: { location }, // busan 들어감
    });

    // console.log("newLocationInfo>>>", newLocationInfo);
    /*
    {
         dataValues: {
        id: 5,
        location: 'busan',
        createdAt: 2020-12-24T04:48:26.000Z,
        updatedAt: 2020-12-24T04:48:26.000Z
        },
    }
    */
    const newLocationId = newLocationInfo.dataValues.id; // 새로 바꿀 지역의 아이디 => 5

    // ! location 바꾸는 로직 함수화
    // ? 필요한 인자는 1.새로운 지역 아이디, 2.이전 지역 아이디, 3.유저 아이디
    const changeFunc = async (newLocationId, getUserId, prevLocationId) => {
      const changedLocation = await UserLocation.update(
        {
          locationId: newLocationId, // 새로 바꿀 로케이션 아이디
          updateAt: new Date(),
        },
        {
          where: {
            // 조건
            userId: getUserId, // 유저 아이디에 맞고,
            locationId: prevLocationId, // 이전 지역 아이디가 맞다면
          },
          returning: true,
        }
      );
      //   console.log("실행 완료");

      //   console.log("changedLocation", changedLocation); // ? changedLocation [ undefined, 1 ] // 1번 째 인자 : 0은  1은 업데이트 성공
      if (changedLocation[1] === 1) {
        res.status(200).json({
          location, // 새로 바뀐 지역 이름
        });
      } else {
        res.status(404).json({
          message: "Not authorized",
        });
      }
    };

    // 변경한 location 적용
    if (location === "seoul") {
      //   const locationId = 1;
      changeFunc(newLocationId, getUserId, prevLocationId);
    } else if (location === "incheon") {
      changeFunc(newLocationId, getUserId, prevLocationId);
    } else if (location === "daegu") {
      //   const locationId = 3;
      changeFunc(newLocationId, getUserId, prevLocationId);
    } else if (location === "gwangju") {
      //   const locationId = 4;
      changeFunc(newLocationId, getUserId, prevLocationId);
    } else if (location === "busan") {
      //   const locationId = 5;
      changeFunc(newLocationId, getUserId, prevLocationId);
    }
  },
};

// ? 세션 객체 받을까 말까
