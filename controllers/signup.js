

module.exports = {}
// req.body // 아이디, 비밀번호, 이름, 이메일, 지역아이디 (1,2,3,4,5) 1

// const userInfo = await User.findOrCreate( // 유저 만드는 건 ㅇㅋ
//    넣을 게 아이디, 비밀번호, 이름, 이메일
//    김코딩 id 1  PK
// )

// const userPk = userInfo.dataValues.id  // 변수에 1 담겼습니다. -> 두 번째 가입자는 2 ... 반복

// if (req.body.locationId.length === 1) // else는 .. 머리 굴려봐야 겠씁니다

// const locationPK = req.body.locationID // 로케이션 두 개라면, Create 두 번 해야하는데..

// // 컬럼 넣을 겁니다.
// UserLocation.Create(
// where:{
//   userInfo.dataValues.id : userPk // 김코딩
// }
//   컬럼 userid : userPk,
//   컬럼 locationId : locationPK 1

//     김코딩이 서울이랑 인천을 설정한 것을 넣어야 겠네요?
//     유저테이블 id 참조 <- userid(FK) 1 : locationid(FK) :1 -> 로케이션 테이블 id 참조
// )

// location // 처음에 5개 지역 만들어 두겠네요
// id:1 PK
// locationName:서울,
// id:2
// locationName:인천
// ...
