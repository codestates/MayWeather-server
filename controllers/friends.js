const { User, UserLocation } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op; // 

module.exports = {
    get: async(req, res) => {

        if (req.session.userId) {
            res.status(401).send('who are you?')

        } else {
            // locationId 찾기 (조인테이블에서 req.session.userId 와 userId가 같은 경우의 locationId 를 탐색)
            const locaId = await UserLocation.findAll({
                attributes: ['locationId'],
                where: {
                    userId: 1
                    //userId : req.session.userId
                },
            })

            // 다른 정보들을 잘라낸 locationId 값만으로 이루어진 배열 생성 -> ex) [ 1, 2 ]
            let locaIdArr = locaId.map((el) => { return el.dataValues.locationId })

            //2. 조인테이블에서 locationId 와 같은 row에 있는 userId를 3개만 고르는데 userId 중에 req.session.userId 와 같은 값은 필터
            const friendId = await UserLocation.findAll({
                attributes: ['userId'],
                where: {
                    locationId: { [Op.or]: locaIdArr },
                    // .ne 는 '같지 않은 것' 을 의미한다. -> userId !== req.session.userId
                    userId: { [Op.ne]: 1 }
                    //userId: { [Op.ne]: req.session.userId }
                },
                //3개 이하의 row만 주세요.
                limit: 3
            });

            // ex) [ 2, 3, 4]
            let friendIdArr = friendId.map(el => { return el.dataValues.userId })
            console.log('?', friendIdArr)

            let friendNameArr

            if (friendIdArr.length !== 0) {
                //User테이블에서 userId 와 일치하는 row 에서 username만 골라냄
                const friendName = await User.findAll({
                    attributes: ['username'],
                    where: {
                        id: { [Op.or]: friendIdArr }
                    }

                })

                // ex) ["coco","sana"]
                friendNameArr = friendName.map(el => { return el.dataValues.username })

                res.status(200).json({ friendNameArr })
            } else {
                res.status(404).json({ message: 'Not found' })
            }
        }
    }
}