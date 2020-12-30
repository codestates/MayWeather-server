const { User, UserLocation, Location } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = {
  post: async (req, res) => {
    // const { userId } = req.session;
    // ! test
    const { userId } = req.body;
    console.log("🚀 ~ file: friends.js ~ line 8 ~ post: ~ userId", userId); // 5
    const { location } = req.body;
    console.log("🚀 ~ file: friends.js ~ line 10 ~ post: ~ location", location); // seoul

    // ! 유저가 고른 로케이션만 찾기 가능

    if (!userId) {
      res.status(404).json({
        message: "Not Found",
      });
    }
    // 조인테이블에서 유저가 고른 지역 찾기
    const isUserLocation = await UserLocation.findAll({
      attributes: ["locationId"],
      where: {
        userId,
      },
    });
    // console.log(
    //   "🚀 ~ file: friends.js ~ line 29 ~ post: ~ isUserLocation",
    //   isUserLocation
    // );

    // !  유저가 회원가입 시 선택했던 지역 아이디 구함
    /* 
      [
        UserLocation {
          dataValues: { locationId: 4 },
          ..
        },
        UserLocation {
          dataValues: { locationId: 3 },
      ]
    */

    // 로케이션 이름 찾을 때 Op.or 의 값에 넣을 [4,3] 만들기.
    let makeArr = [isUserLocation[0].dataValues.locationId];

    if (isUserLocation[1]) {
      makeArr.push(isUserLocation[1].dataValues.locationId);
    }
    // console.log("makeArr>>>",makeArr);  // [4, 3]

    // ! 유저가 고른 지역 이름 구함.
    const locationName = await Location.findAll({
      attributes: ["location"],
      where: {
        id: { [Op.or]: makeArr },
      },
    });

    // console.log(
    //   "🚀 ~ file: friends.js ~ line 43 ~ post: ~ locationName",
    //   locationName
    // );
    /*
      [
        Location {
          dataValues: { location: 'daegu' },
          ...
        },
        Location {
          dataValues: { location: 'gwangju' },
          ...
        }
      ]
     */

    // !  locationName[0],[1] 여기 든 이름이랑 req.body.location이랑 같은 것만 필터
    const getLocation = locationName.filter((location) => {
      // console.log("same?", location.dataValues.location === req.body.location);
      return location.dataValues.location === req.body.location;
      // return location.dataValues.location; // 값 잘나오고 typeof도 스트링이지만, 만들어진 getLocationArr를 콘솔에 찍으면 [ undefined, undefined ]가 나온다.
    });
    // console.log(
    //   "🚀 ~ file: friends.js ~ line 86 ~ getLocation ~ getLocation",
    //   getLocation
    // );

    // ! 유저의 여러 지역 중, 선택한 지역만 찾음.

    //---------------
    // 유저가 자신의 지역으로 선택했던 지역의 친구를 찾는게 아닌 경우 &&  userId 없는 경우 (로그인이 안된 경우)
    if (getLocation.length === 0) {
      //   res.status(401).send("who are you?");
      res.status(404).json({
        message: "Not Found",
      });
    } else if (getLocation.length > 0 && userId) {
      // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
      const locationInfo = await Location.findOne({
        where: {
          location,
        },
      });
      // console.log(
      //   "🚀 ~ file: friends.js ~ line 22 ~ get: ~ locationInfo",
      //   locationInfo
      // );
      /*
        {
            dataValues: {
                id: 1,
                location: 'seoul',
                ..
            }..
        }
      */

      const locaId = await UserLocation.findAll({
        attributes: ["userId"],
        where: {
          locationId: locationInfo.dataValues.id,
        },
      });
      // console.log("🚀 ~ file: friends.js ~ line 21 ~ get: ~ locaId", locaId);
      /*
        [
            UserLocation {
                dataValues: { userId: 1 },
                ...
            },
            UserLocation {
                dataValues: { userId: 2 },
                ...
            },
            UserLocation {
                dataValues: { userId: 3 },
                ...
            }
        ]
      */

      // 다른 정보들을 잘라낸 locationId 값만으로 이루어진 배열 생성 -> ex) [ 1, 2 ]
      let locaIdArr = locaId.map((el) => {
        return el.dataValues.userId;
      });
      // console.log(
      //   "🚀 ~ file: friends.js ~ line 66 ~ locaIdArr ~ locaIdArr",
      //   locaIdArr,
      //   typeof locaIdArr // object
      // );

      //2. 조인테이블에서 locationId 와 같은 row에 있는 userId를 3개만 고르는데 userId 중에 req.session.userId 와 같은 값은 필터
      // ! 지역 친구 찾을 때, 3명 이상인데 항상 동일한 친구 나오면 다른 친구 못보니까 찾기 버튼 시 랜덤으로 나오게끔 기능 추가하기
      const friendId = await UserLocation.findAll({
        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("userId")),
          "userId",
        ],
        where: {
          locationId: locationInfo.dataValues.id,
          // .ne 는 '같지 않은 것' 을 의미한다. -> userId !== req.session.userId
          userId: { [Op.ne]: userId }, // ! 이거로 바꿨습니다. 자신을 제외한 무조건 같은 지역 친구만 나올 수 있도록 하였습니다.
        },
        //3개 이하의 row만 주세요.
        order: sequelize.literal("rand()"),
        limit: 3,
      });
      // console.log(
      //   "🚀 ~ file: friends.js ~ line 85 ~ post: ~ friendId",
      //   friendId
      // );

      // ex) [ 2, 3, 4]

      let friendIdArr = friendId.map((el) => {
        return el.dataValues.userId;
      });
      // console.log(
      //   "🚀 ~ file: friends.js ~ line 95 ~ friendIdArr ~ friendIdArr",
      //   friendIdArr
      // );

      if (friendIdArr.length !== 0) {
        //User테이블에서 userId 와 일치하는 row 에서 username만 골라냄
        const friendName = await User.findAll({
          attributes: ["username"],
          where: {
            id: { [Op.or]: friendIdArr },
          },
        });

        // ex) ["coco","sana"]
        friendNameArr = friendName.map((el) => {
          return el.dataValues.username;
        });
        // console.log(
        //   "🚀 ~ file: friends.js ~ line 113 ~ friendNameArr=friendName.map ~ friendNameArr",
        //   friendNameArr
        // );

        res.status(200).json({ friendNameArr });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    }
  },
};
