const { User, UserLocation, Location } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op; //

module.exports = {
  post: async (req, res) => {
    const { userId } = req.session;
    console.log("🚀 ~ file: friends.js ~ line 8 ~ post: ~ userId", userId); // 5
    const { location } = req.body;
    console.log("🚀 ~ file: friends.js ~ line 10 ~ post: ~ location", location); // seoul

    // 아래 로직 가기 전에 user가 찾는 location이 user가 선택한 지역이 맞는지 확인해야함.

    const isUserLocation = await UserLocation.findAll({
      attributes: ["locationId"],
      where: {
        userId,
      },
    });
    // console.log(
    //   "🚀 ~ file: friends.js ~ line 20 ~ post: ~ isUserLocation",
    //   isUserLocation
    // );
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
    // 지역이 1개만 있을 경우를 대비해 if문을 사용할 것이고, if문을 사용하면 스코프 안에서만 사용 가능하니 바깥에서 미리 변수를 만들어 둠

    if (isUserLocation[1]) {
      makeArr.push(isUserLocation[1].dataValues.locationId);
    }
    // console.log("🚀 ~ file: friends.js ~ line 40 ~ post: ~ makeArr", makeArr);  // [4, 3]

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

    //  locationName[0],[1] 여기 든 이름이랑 req.body.location이랑 같은게 있나 없나 확인

    const getLocationArr = locationName.map((location) => {
      return location.dataValues.location; // 값 잘나오고 typeof도 스트링이지만, 만들어진 getLocationArr를 콘솔에 찍으면 [ undefined, undefined ]가 나온다.
    });
    // console.log(
    //   "🚀 ~ file: friends.js ~ line 78 ~ getLocationArr ~ getLocationArr",
    //   getLocationArr // ['daegu', 'gwangju']
    // );

    let hasUserLocation = false;

    for (let i = 0; i < getLocationArr.length; i++) {
      if (getLocationArr[i] === location) {
        // if ("daegu" === location) {
        //   // 배열이 안되나?
        // if (getLocationArr[i] === "daegu") {
        // location이 안되나?
        console.log(">>>>>>>>>>>>>>>맞나요?");
        hasUserLocation = true;
      }
    }

    console.log(
      "🚀 ~ file: friends.js ~ line 93 ~ post: ~ hasUserLocation",
      hasUserLocation
    );

    //---------------
    // 유저가 자신의 지역으로 선택했던 지역의 친구를 찾는게 아닌 경우 &&  userId 없는 경우 (로그인이 안된 경우)
    if (!hasUserLocation) {
      //   res.status(401).send("who are you?");
      res.status(404).json({
        message: "Not Found",
      });
    } else if (!userId) {
      //   res.status(401).send("who are you?");
      res.status(404).json({
        message: "Not Found",
      });
    } else if (hasUserLocation && userId) {
      // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
      const locationInfo = await Location.findOne({
        where: {
          location,
        },
      });
      console.log(
        "🚀 ~ file: friends.js ~ line 22 ~ get: ~ locationInfo",
        locationInfo
      );
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
        // attributes: ["locationId"], // ! 우리가 찾아야 하는 컬럼은 userId 컬럼임 친구를 찾는 것이기 때문
        attributes: ["userId"],
        where: {
          //   userId,   // ! 조인 테이블에서는 유저가 고른 로케이션과 같은 사람들을 찾아야 하기 때문에 이 코드는 없어야 함. 이 코드가 있으면 잘못된 친구 찾아옴.
          locationId: locationInfo.dataValues.id,
        },
      });
      console.log("🚀 ~ file: friends.js ~ line 21 ~ get: ~ locaId", locaId);
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
        // ! return el.dataValues.locationId; 동일한 이유로 수정
        return el.dataValues.userId;
      });
      console.log(
        "🚀 ~ file: friends.js ~ line 66 ~ locaIdArr ~ locaIdArr",
        locaIdArr,
        typeof locaIdArr // object
      );

      //2. 조인테이블에서 locationId 와 같은 row에 있는 userId를 3개만 고르는데 userId 중에 req.session.userId 와 같은 값은 필터
      // ! 지역 친구 찾을 때, 3명 이상인데 항상 동일한 친구 나오면 다른 친구 못보니까 찾기 버튼 시 랜덤으로 나오게끔 기능 추가하기
      const friendId = await UserLocation.findAll({
        attributes:
          // ["userId"],
          [sequelize.fn("DISTINCT", sequelize.col("userId")), "userId"],
        where: {
          locationId: { [Op.or]: locaIdArr },
          // .ne 는 '같지 않은 것' 을 의미한다. -> userId !== req.session.userId
          userId: { [Op.ne]: userId },
        },
        //3개 이하의 row만 주세요.
        order: sequelize.literal("rand()"), // ? 중복 제거 어떻게?
        limit: 3,
      });
      console.log(
        "🚀 ~ file: friends.js ~ line 85 ~ post: ~ friendId",
        friendId
      );

      // ex) [ 2, 3, 4]

      let friendIdArr = friendId.map((el) => {
        return el.dataValues.userId;
      });
      console.log(
        "🚀 ~ file: friends.js ~ line 95 ~ friendIdArr ~ friendIdArr",
        friendIdArr
      );

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
        console.log(
          "🚀 ~ file: friends.js ~ line 113 ~ friendNameArr=friendName.map ~ friendNameArr",
          friendNameArr
        );

        res.status(200).json({ friendNameArr }); // ? 포스트맨에서 정상적으로 응답했으니까 클라이언트에서도 쓸 수 있겠지?
      } else {
        res.status(404).json({ message: "Not found" });
      }
    }
  },
};
