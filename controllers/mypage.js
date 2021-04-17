const crypto = require("crypto");
const e = require("express");
const { Location, User, User_Location } = require("../models");

const updateLocation = async (userId, prevLocation, newLocation) => {
  const getPrevLocationId = await Location.findOne({
    where: {
      name: prevLocation,
    },
  });

  const getNewLocationId = await Location.findOne({
    where: {
      name: newLocation,
    },
  });

  const changeLocation = await User_Location.update(
    {
      locationId: getNewLocationId.dataValues.id,
    },
    {
      where: {
        userId,
        locationId: getPrevLocationId.dataValues.id,
      },
    }
  );
  if (changeLocation) {
    return true;
  }
};

module.exports = {
  post: async (req, res) => {
    try {
      const { userId } = req.session;
      const { category } = req.params;
      console.log(
        "🚀 ~ file: mypage.js ~ line 10 ~ post: ~ category",
        category
      );
      const {
        email,
        prevPassword,
        newPassword,
        newName,
        prevLocation,
        newLocation,
      } = req.body;

      //! 비밀번호 변경
      if (category === "password") {
        const getUserInfo = await User.findOne({
          where: {
            email,
          },
        });

        let salt = getUserInfo.dataValues.salt;

        crypto.pbkdf2(
          prevPassword,
          salt,
          100000,
          64,
          "sha512",
          async (err, key) => {
            // console.log("password:", key.toString("base64"));
            let password = key.toString("base64");

            // ! 새로운 비밀번호 해싱
            crypto.randomBytes(64, (err, buf) => {
              const salt = buf.toString("base64");
              crypto.pbkdf2(
                newPassword,
                salt,
                100000,
                64,
                "sha512",
                async (err, key) => {
                  let getNewPassword = key.toString("base64");
                  const getUser = await User.update(
                    {
                      password: getNewPassword,
                      salt,
                    },
                    {
                      where: {
                        email,
                        password,
                      },
                    }
                  );
                  console.log(
                    "🚀 ~ file: mypage.js ~ line 51 ~ getUser",
                    getUser
                  );
                  res.status(200).json({
                    message: "OK",
                  });
                }
              );
            });
          }
        );
      }
      // ! 이름 변경
      else if (category === "username") {
        console.log("newName", newName);
        const changeUserName = await User.update(
          {
            name: newName,
          },
          {
            where: {
              id: userId,
            },
          }
        );
        if (changeUserName) {
          res.status(200).json({
            message: "OK",
          });
        }
      }
      // ! 지역 1 변경
      else if (category === "location1") {
        const isUpdated = updateLocation(userId, prevLocation, newLocation);
        if (isUpdated) {
          res.status(200).json({
            message: "OK",
          });
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      }
      //! 지역 2 변경
      else if (category === "location2") {
        // 지역2가 있다면 update
        if (prevLocation) {
          const isUpdated = updateLocation(userId, prevLocation, newLocation);
          if (isUpdated) {
            res.status(200).json({
              message: "OK",
            });
          } else {
            res.status(401).json({ message: "Unauthorized" });
          }
        }
        // 지역2가 없다면 create
        else {
          const getNewLocationId = await Location.findOne({
            where: {
              name: newLocation,
            },
          });

          const createLocation = await User_Location.create({
            userId,
            locationId: getNewLocationId.dataValues.id,
          });
          if (createLocation) {
            res.status(200).json({
              message: "OK",
            });
          } else {
            res.status(401).json({ message: "Unauthorized" });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
