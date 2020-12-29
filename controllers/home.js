/* 지역별 현재 온도와 아이콘, 시간대별 온도와 아이콘을 응답해줘야 합니다 */
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const weatherData = {
  currentWeather: [
    {
      id: 1,
      location: "seoul",
      currentTemp: null,
      currentWeatherIcon: null,
    },
    {
      id: 2,
      location: "incheon",
      currentTemp: null,
      currentWeatherIcon: null,
    },
    {
      id: 3,
      location: "daegu",
      currentTemp: null,
      currentWeatherIcon: null,
    },
    {
      id: 4,
      location: "gwangju",
      currentTemp: null,
      currentWeatherIcon: null,
    },
    {
      id: 5,
      location: "busan",
      currentTemp: null,
      currentWeatherIcon: null,
    },
  ],
  intervalWeather: [
    {
      Seoul: [
        {
          id: 1,
          time: "nine",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 2,
          time: "twelve",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 3,
          time: "eighteen",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
      ],
    },
    {
      Incheon: [
        {
          id: 1,
          time: "nine",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 2,
          time: "twelve",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 3,
          time: "eighteen",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
      ],
    },
    {
      Daegu: [
        {
          id: 1,
          time: "nine",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 2,
          time: "twelve",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 3,
          time: "eighteen",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
      ],
    },
    {
      Gwangju: [
        {
          id: 1,
          time: "nine",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 2,
          time: "twelve",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 3,
          time: "eighteen",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
      ],
    },
    {
      Busan: [
        {
          id: 1,
          time: "nine",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 2,
          time: "twelve",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
        {
          id: 3,
          time: "eighteen",
          temp: null,
          icon: null,
          month: null,
          date: null,
        },
      ],
    },
  ],
};

module.exports = {
  get: async (req, res) => {
    // ! 1. 09,12,18시 시간별 날씨 데이터 구하기
    // 3시간 간격 API 요청
    const getIntervalData = async (cityID, cityName, locationNum) => {
      const intervalData = await axios(
        `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${WEATHER_API_KEY}&units=metric`
      );

      for (let i = 0; i < intervalData.data.list.length; i++) {
        // 오늘 09,12,18시 구함
        const format = moment().format("YYYY-MM-DD");
        const dt_nine = `${format} 09:00:00`; //  '2020-12-26 09:00:00'
        const dt_twelve = `${format} 12:00:00`; // '2020-12-26 12:00:00'
        const dt_eighteen = `${format} 18:00:00`; // '2020-12-26 18:00:00' (API 날짜틀과 일치하게 만듦)
        // API에서 제공하는 날짜 및 시간 : intervalData.data.list[0].dt_txt; // '2020-12-26 09:00:00' (틀 일치)

        // 다음 날 09시,12 시 구함
        const today = new Date();
        const year = today.getFullYear(); // 2020
        const month = today.getMonth() + 1; // 12 (월은 0부터 셈)
        const date = today.getDate(); // 26

        const nextNine = `${year}-${month}-${date + 1} 09:00:00`; // 2020-12-27 09:00:00
        const nextTwelve = `${year}-${month}-${date + 1} 12:00:00`; // 2020-12-27 12:00:00

        // 온도 : intervalData.data.list[i].main.temp
        // 아이콘 : intervalData.data.list[i].weather[0].icon

        // ! 함수화
        const setUpIntervalData = (cityName, locationNum, timeNum) => {
          //weatherData.intervalWeather[0][도시이름(cityName변수 넣기)][0] : 앞의 0(서울)은 지역, 뒤의 0(9시)은 시간대

          // 키가 너무 길어서 변수에 담음
          const intervaltemplate =
            weatherData.intervalWeather[locationNum][cityName];
          // 인터벌 온도
          intervaltemplate[timeNum].temp = intervalData.data.list[i].main.temp;
          // 인터벌 아이콘
          intervaltemplate[timeNum].icon =
            intervalData.data.list[i].weather[0].icon;
          //! 추가 month
          intervaltemplate[timeNum].month = month;
          //! 추가 date
          intervaltemplate[timeNum].date = date;
        };

        // ? 제공한 날씨 정보가 09시냐? -> 맞다면 오늘 09시 날씨라고 응답해줘야함.
        // 오늘 9시 정보 있을 때
        if (intervalData.data.list[i].dt_txt === dt_nine) {
          // obj[a + 'b'] = 'bbb'
          setUpIntervalData(cityName, locationNum, 0);
        }
        // ? 24시 기준 : 과거 21,18,15시까지 제공, 21시 기준 : 과거 18,15,12시까지 제공
        // 오늘 9시 정보 없을 때(당일 21시부터 없음), 다음 날 9시 정보 주기
        else if (intervalData.data.list[i].dt_txt === nextNine) {
          setUpIntervalData(cityName, locationNum, 0);
        }

        // ? 제공한 날씨 정보가 12시냐? -> 맞다면 오늘 12시 날씨라고 응답해줘야함.
        // 오늘 12시 정보 있을 때
        if (intervalData.data.list[i].dt_txt === dt_twelve) {
          setUpIntervalData(cityName, locationNum, 1);
        }
        // ? 24시 기준 : 과거 21,18,15시까지 제공
        // 오늘 12시 정보 없을 때(당일 24시부터 없음), 다음 날 9시 정보 주기
        else if (intervalData.data.list[i].dt_txt === nextTwelve) {
          setUpIntervalData(cityName, locationNum, 1);
        }

        // ? 제공한 날씨 정보가 18시냐? -> 맞다면 오늘 18시 날씨라고 응답해줘야함. 18시는 항상 있어서 다음 날꺼 구할 필요 없음
        if (intervalData.data.list[i].dt_txt === dt_eighteen) {
          setUpIntervalData(cityName, locationNum, 2);
        }
      }
    };

    // 함수 실행 // getIntervalData (cityID, cityName, locationNum)
    // 1. 서울
    getIntervalData("1835847", "Seoul", 0);
    // 2. 인천
    getIntervalData("1843561", "Incheon", 1);
    // 3. 대구
    getIntervalData("1835327", "Daegu", 2);
    // 4. 광주
    getIntervalData("1841808", "Gwangju", 3);
    // 5. 부산
    getIntervalData("1838519", "Busan", 4);

    // ! 2. 현재 날씨 구하기
    // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}

    // ! 함수화
    const setupCurrentData = (num, cityName) => {
      // console.log("?!?!?!?!?!??", "currentWeather" + cityName.data.main.temp);
      weatherData.currentWeather[num].currentTemp =
        // ! 여기 수정해야함. 다 서울로 현재 날씨 나옴
        currentWeatherSeoul.data.main.temp;
      weatherData.currentWeather[num].currentWeatherIcon =
        currentWeatherSeoul.data.weather[0].icon;
    };

    // 1.서울
    const currentWeatherSeoul = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?id=1835847&appid=${WEATHER_API_KEY}&units=metric`
    );

    setupCurrentData(0, "Seoul");

    // 2.인천
    const currentWeatherIncheon = await axios(
      `http://api.openweathermap.org/data/2.5/weather?id=1843561&appid=${WEATHER_API_KEY}&units=metric`
    );
    setupCurrentData(1, "Incheon");

    // 3.대구
    const currentWeatherDaegu = await axios(
      `http://api.openweathermap.org/data/2.5/weather?id=1835327&appid=${WEATHER_API_KEY}&units=metric`
    );
    setupCurrentData(2, "Daegu");

    // 4.광주
    const currentWeatherGwangju = await axios(
      `http://api.openweathermap.org/data/2.5/weather?id=1841808&appid=${WEATHER_API_KEY}&units=metric`
    );
    setupCurrentData(3, "Gwangju");

    // 5.부산
    const currentWeatherBusan = await axios(
      `http://api.openweathermap.org/data/2.5/weather?id=1838519&appid=${WEATHER_API_KEY}&units=metric`
    );
    setupCurrentData(4, "Busan");

    // ! if문 조건에 모든 API요청이 성공, weatherDat에 필요한 데이터 다 담았냐는 물음을 써야하는데 복잡해서 일단 weatherData가 있냐 없냐로 구분
    if (weatherData) {
      res.status(200).json(weatherData);
    } else {
      res.status(507).json({
        message: "There is an error with the API used by the server.",
      });
    }
  },
};

// !!!!!!! 리팩토링 전

// /* 지역별 현재 온도와 아이콘, 시간대별 온도와 아이콘을 응답해줘야 합니다 */
// const axios = require("axios");
// const moment = require("moment");
// require("dotenv").config();

// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// const resData = {};

// module.exports = {
//   get: async (req, res) => {
//     // ! 1. 09,12,18시 시간별 날씨 데이터 구하기
//     const getIntervalData = async (cityID, cityName) => {
//       const intervalData = await axios(
//         `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${WEATHER_API_KEY}&units=metric`
//       );

//       for (let i = 0; i < intervalData.data.list.length; i++) {
//         // 매일 09,12,18시 구함
//         const format = moment().format("YYYY-MM-DD");
//         const dt_nine = `${format} 09:00:00`; //  '2020-12-26 09:00:00'
//         const dt_twelve = `${format} 12:00:00`; // '2020-12-26 12:00:00'
//         const dt_eighteen = `${format} 18:00:00`; // '2020-12-26 18:00:00' (API 날짜틀과 일치하게 만듦)
//         // API에서 제공하는 날짜 및 시간 : intervalData.data.list[0].dt_txt; // '2020-12-26 09:00:00' (틀 일치)

//         // 다음 날 09시,12 시 구함
//         const today = new Date();
//         const year = today.getFullYear(); // 2020
//         const month = today.getMonth() + 1; // 12 (월은 0부터 셈)
//         const date = today.getDate(); // 27
//         const nextNine = year + "-" + month + "-" + date + 1 + "-" + "09:00:00"; // 2020-12-27 09:00:00
//         const nextTwelve =
//           year + "-" + month + "-" + date + 1 + "-" + "09:00:00"; // 2020-12-27 12:00:00

//         // 온도 : intervalData.data.list[i].main.temp
//         // 아이콘 : intervalData.data.list[i].weather[0].icon

//         // ! 제공한 날씨 정보가 09시냐? -> 맞다면 오늘 09시 날씨라고 응답해줘야함.
//         // 오늘 9시 정보 있을 때
//         if (intervalData.data.list[i].dt_txt === dt_nine) {
//           // obj[a + 'b'] = 'bbb'
//           // temp
//           resData["nineTempIn" + cityName] =
//             intervalData.data.list[i].main.temp;
//           // icon
//           resData["nineIconOf" + cityName] =
//             intervalData.data.list[i].weather[0].icon;
//           //! 추가 month
//           resData["month"] = month;
//           //! 추가 date
//           resData["date"] = date;
//         }
//         // ? 24시 기준 : 과거 21,18,15시까지 제공, 21시 기준 : 과거 18,15,12시까지 제공
//         // 오늘 9시 정보 없을 때(당일 21시부터 없음), 다음 날 9시 정보 주기
//         else if (intervalData.data.list[i].dt_txt === nextNine) {
//           resData["nineTempIn" + cityName] =
//             intervalData.data.list[i].main.temp;
//           // icon
//           resData["nineIconOf" + cityName] =
//             intervalData.data.list[i].weather[0].icon;
//           //! 추가 month
//           resData["month"] = month;
//           //! 추가 date
//           resData["date"] = date + 1;
//         }

//         // ! 제공한 날씨 정보가 12시냐? -> 맞다면 오늘 12시 날씨라고 응답해줘야함.
//         // 오늘 12시 정보 있을 때
//         if (intervalData.data.list[i].dt_txt === dt_twelve) {
//           resData["twelveTempIn" + cityName] =
//             intervalData.data.list[i].main.temp;
//           resData["twelveIconOf" + cityName] =
//             intervalData.data.list[i].weather[0].icon;
//           //! 추가 month
//           resData["month"] = month;
//           //! 추가 date
//           resData["date"] = date;
//         }
//         // ? 24시 기준 : 과거 21,18,15시까지 제공
//         // 오늘 12시 정보 없을 때(당일 24시부터 없음), 다음 날 9시 정보 주기
//         else if (intervalData.data.list[i].dt_txt === nextTwelve) {
//           resData["twelveTempIn" + cityName] =
//             intervalData.data.list[i].main.temp;
//           resData["twelveIconOf" + cityName] =
//             intervalData.data.list[i].weather[0].icon;
//           //! 추가 month
//           resData["month"] = month;
//           //! 추가 date
//           resData["date"] = date + 1;
//         }

//         // ! 제공한 날씨 정보가 18시냐? -> 맞다면 오늘 18시 날씨라고 응답해줘야함. 18시는 항상 있어서 다음 날꺼 구할 필요 없음
//         if (intervalData.data.list[i].dt_txt === dt_eighteen) {
//           resData["eighteenTempIn" + cityName] =
//             intervalData.data.list[i].main.temp;
//           resData["eighteenIconOf" + cityName] =
//             intervalData.data.list[i].weather[0].icon;
//           //! 추가 month
//           resData["month"] = month;
//           //! 추가 date
//           resData["date"] = date;
//         }
//       }
//     };
//     // 함수 만드는 로직 끝

//     // 함수 실행 // getIntervalData (cityID, cityName)
//     // 1. 서울
//     getIntervalData("1835847", "Seoul");
//     // 2. 인천
//     getIntervalData("1843561", "Incheon");
//     // 3. 대구
//     getIntervalData("1835327", "Daegu");
//     // 4. 광주
//     getIntervalData("1841808", "Gwangju");
//     // 5. 부산
//     getIntervalData("1838519", "Busan");

//     // ! 2. 현재 날씨 구하기
//     // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
//     // 1.서울
//     const currentWeatherSeoul = await axios.get(
//       `http://api.openweathermap.org/data/2.5/weather?id=1835847&appid=${WEATHER_API_KEY}&units=metric`
//     );
//     resData.tempOfSeoul = currentWeatherSeoul.data.main.temp;
//     resData.IconOfSeoul = currentWeatherSeoul.data.weather[0].icon;

//     // 2.인천
//     const currentWeatherIncheon = await axios(
//       `http://api.openweathermap.org/data/2.5/weather?id=1843561&appid=${WEATHER_API_KEY}&units=metric`
//     );
//     resData.tempOfIncheon = currentWeatherIncheon.data.main.temp;
//     resData.IconOfIncheon = currentWeatherIncheon.data.weather[0].icon;

//     // 3.대구
//     const currentWeatherDaegu = await axios(
//       `http://api.openweathermap.org/data/2.5/weather?id=1835327&appid=${WEATHER_API_KEY}&units=metric`
//     );
//     resData.tempOfDaegu = currentWeatherDaegu.data.main.temp;
//     resData.IconOfDaegu = currentWeatherDaegu.data.weather[0].icon;

//     // 4.광주
//     const currentWeatherGwangju = await axios(
//       `http://api.openweathermap.org/data/2.5/weather?id=1841808&appid=${WEATHER_API_KEY}&units=metric`
//     );
//     resData.tempOfGwangju = currentWeatherGwangju.data.main.temp;
//     resData.IconOfGwangju = currentWeatherGwangju.data.weather[0].icon;

//     // 5.부산
//     const currentWeatherBusan = await axios(
//       `http://api.openweathermap.org/data/2.5/weather?id=1838519&appid=${WEATHER_API_KEY}&units=metric`
//     );
//     resData.tempOfBusan = currentWeatherBusan.data.main.temp;
//     resData.IconOfBusan = currentWeatherBusan.data.weather[0].icon;

//     // ! 필요한 정보 resData변수에 다 담음.
//     // console.log("🚀 ~ file: home.js ~ line 35 ~ get: ~ resData", resData);
//     /*
//                   {
//           nineTempInSeoul: '01n',
//           twelveTempInSeoul: '03n',
//           eighteenTempInSeoul: '04n',
//           tempOfSeoul: -3.3,
//           IconOfSeoul: '01n',
//           nineTempInDaegu: '01n',
//           twelveTempInDaegu: '03n',
//           eighteenTempInDaegu: '04n',
//           nineTempInIncheon: '01n',
//           twelveTempInIncheon: '03n',
//           eighteenTempInIncheon: '04n',
//           nineTempInGwangju: '01n',
//           twelveTempInGwangju: '04n',
//           eighteenTempInGwangju: '04n',
//           nineTempInBusan: '01n',
//           twelveTempInBusan: '03n',
//           eighteenTempInBusan: '04n',
//           tempOfIncheon: -1.17,
//           IconOfIncheon: '01n',
//           tempOfDaegu: -6,
//           IconOfDaegu: '01n',
//           tempOfGwangju: -1,
//           IconOfGwangju: '04n',
//           tempOfBusan: -3,
//           IconOfBusan: '01n'
//         }
//     */
//     // ! API문서 형태 맞추기 위해 다시 작업, 리팩토링 날에 이 작업이랑 resData작업이랑 합쳐서 한 번에 resData를 응답하게끔 변경
//     console.log("resData.month>>>", resData.month, typeof resData.month);
//     const weatherData = {
//       // 현재 날씨
//       currentWeather: [
//         {
//           id: 1,
//           location: "seoul",
//           currentTemp: resData.tempOfSeoul, // typeof number
//           currentWeatherIcon: resData.IconOfSeoul,
//         },
//         {
//           id: 2,
//           location: "incheon",
//           currentTemp: resData.tempOfIncheon,
//           currentWeatherIcon: resData.IconOfIntempOfIncheon,
//         },
//         {
//           id: 3,
//           location: "daegu",
//           currentTemp: resData.tempOfDaegu,
//           currentWeatherIcon: resData.IconOfDaegu,
//         },
//         {
//           id: 4,
//           location: "gwangju",
//           currentTemp: resData.tempOfGwangju,
//           currentWeatherIcon: resData.IconOfGwtempOfGwangju,
//         },
//         {
//           id: 5,
//           location: "busan",
//           currentTemp: resData.tempOfBusan,
//           currentWeatherIcon: resData.IconOfBusan,
//         },
//       ],
//       // 인터벌 날씨
//       intervalWeather: [
//         {
//           seoul: [
//             {
//               id: 1,
//               time: "nine",
//               temp: resData.nineTempInSeoul, // typeof number
//               icon: resData.nineIconOfSeoul,
//               month: resData.month, // typeof number
//               date: resData.date, // typeof number
//             },
//             {
//               id: 2,
//               time: "twelve",
//               temp: resData.twelveTempInSeoul,
//               icon: resData.twelveIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 3,
//               time: "eighteen",
//               temp: resData.eighteenTempInSeoul,
//               icon: resData.eighteenIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//           ],
//           // 인천
//           incheon: [
//             {
//               id: 1,
//               time: "nine",
//               temp: resData.nineTempInSeoul,
//               icon: resData.nineIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 2,
//               time: "twelve",
//               temp: resData.twelveTempInSeoul,
//               icon: resData.twelveIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 3,
//               time: "eighteen",
//               temp: resData.eighteenTempInSeoul,
//               icon: resData.eighteenIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//           ],
//           // 대구
//           daegu: [
//             {
//               id: 1,
//               time: "nine",
//               temp: resData.nineTempInSeoul,
//               icon: resData.nineIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 2,
//               time: "twelve",
//               temp: resData.twelveTempInSeoul,
//               icon: resData.twelveIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 3,
//               time: "eighteen",
//               temp: resData.eighteenTempInSeoul,
//               icon: resData.eighteenIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//           ],
//           // 광주
//           gwangju: [
//             {
//               id: 1,
//               time: "nine",
//               temp: resData.nineTempInSeoul,
//               icon: resData.nineIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 2,
//               time: "twelve",
//               temp: resData.twelveTempInSeoul,
//               icon: resData.twelveIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 3,
//               time: "eighteen",
//               temp: resData.eighteenTempInSeoul,
//               icon: resData.eighteenIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//           ],
//           // 부산
//           busan: [
//             {
//               id: 1,
//               time: "nine",
//               temp: resData.nineTempInSeoul,
//               icon: resData.nineIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 2,
//               time: "twelve",
//               temp: resData.twelveTempInSeoul,
//               icon: resData.twelveIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//             {
//               id: 3,
//               time: "eighteen",
//               temp: resData.eighteenTempInSeoul,
//               icon: resData.eighteenIconOfSeoul,
//               month: resData.month,
//               date: resData.date,
//             },
//           ],
//         },
//       ],
//     };
//     // console.log(
//     //   "🚀 ~ file: home.js ~ line 244 ~ get: ~ weatherData",
//     //   weatherData
//     // );

//     // ! if문 조건에 모든 API요청이 성공, weatherDat에 필요한 데이터 다 담았냐는 물음을 써야하는데 복잡해서 일단 weatherData가 있냐 없냐로 구분
//     if (weatherData) {
//       res.status(200).json(weatherData);
//     } else {
//       res.status(507).json({
//         message: "There is an error with the API used by the server.",
//       });
//     }
//   },
// };

// // ! 지나간 시간 데이터 못구할 때 과거 날씨 데이터 구하기 -> 유료라서 못씀
// // // 1. 오늘 날짜 9시, 12시 구하기
// // const today = new Date();
// // const year = today.getFullYear();
// // const month = today.getMonth();
// // const date = today.getDate();

// // const gmtNine = new Date(year, month, date, 9);
// // const gmtTwelve = new Date(year, month, date, 12);
// // // 2. GMT -> UTC 변환
// // const utcNine = gmtNine.getTime() / 1000;
// // console.log("🚀 ~ file: home.js ~ line 99 ~ get: ~ utcNine", utcNine);
// // const utcTwelve = gmtTwelve.getTime() / 1000;
// // console.log("🚀 ~ file: home.js ~ line 101 ~ get: ~ utcTwelve", utcTwelve);

// http://history.openweathermap.org/data/2.5/history/city?id=1835847&type=hour&start=1608940800&cnt=1&appid=${WEATHER_API_KEY}

// const getHistoryData = async (cityID, cityName, start, end) => {
//  http://history.openweathermap.org/data/2.5/history/city?id={id}&type=hour&start={start}&end={end}&appid={API key}
// const historyWeatherData = await axios.get(
// `http://history.openweathermap.org/data/2.5/history/city?id=${cityID}&type=hour&start=${start}&end=${end}&appid=${WEATHER_API_KEY}`
// `http://history.openweathermap.org/data/2.5/history/city?id=${cityID}&type=hour&start=${start}&cnt=1&appid=${WEATHER_API_KEY}`
// );
// console.log(
// "🚀 ~ file: home.js ~ line 109 ~ getHistoryData ~ historyWeatherData",
// historyWeatherData
// );
// };
// 서울
// getHistoryData("1835847", "Seoul", 1608940800, 1608951600);
// !
