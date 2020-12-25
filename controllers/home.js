/* 지역별 현재 온도와 아이콘, 시간대별 온도와 아이콘을 응답해줘야 합니다 */
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const resData = {};

module.exports = {
  get: async (req, res) => {
    // ! 1. 09,12,18시 시간별 날씨 데이터 구하기

    // 함수화, 5개 지역의 데이터가 필요하니 5번 코드 작성하면 너무 기니까 함수화 함.
    const getIntervalData = async (cityID, cityName) => {
      const intervalData = await axios(
        `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${WEATHER_API_KEY}&units=metric`
      );

      for (let i = 0; i < intervalData.data.list.length; i++) {
        // 매일 09,12,18시 구함
        const format = moment().format("YYYY-MM-DD");
        const dt_nine = `${format} 09:00:00`; //  '2020-12-26 09:00:00'
        const dt_twelve = `${format} 12:00:00`; // '2020-12-26 12:00:00'
        const dt_eighteen = `${format} 18:00:00`; // '2020-12-26 18:00:00' (틀 일치)
        // API에서 제공하는 날짜 및 시간 : intervalData.data.list[0].dt_txt; // '2020-12-26 09:00:00' (틀 일치)

        // 온도 : intervalData.data.list[i].main.temp
        // 아이콘 : intervalData.data.list[i].weather[0].icon

        if (intervalData.data.list[i].dt_txt === dt_nine) {
          // resData[`nineTempIn${cityName}`] =
          //   intervalData.data.list[i].main.temp;
          // resData[`nineIconOf${cityName}`] =
          //   intervalData.data.list[i].weather[0].icon;
          // ! obj[a + 'b'] = 'bbb'
          resData["nineTempIn" + cityName] =
            intervalData.data.list[i].main.temp;
          resData["nineTempIn" + cityName] =
            intervalData.data.list[i].weather[0].icon;
        }
        // 제공한 날씨 정보가 12시냐? -> 맞다면 오늘 12시 날씨라고 응답해줘야함.
        if (intervalData.data.list[i].dt_txt === dt_twelve) {
          resData["twelveTempIn" + cityName] =
            intervalData.data.list[i].main.temp;
          resData["twelveTempIn" + cityName] =
            intervalData.data.list[i].weather[0].icon;
        }
        // 제공한 날씨 정보가 18시냐? -> 맞다면 오늘 18시 날씨라고 응답해줘야함.
        if (intervalData.data.list[i].dt_txt === dt_eighteen) {
          resData["eighteenTempIn" + cityName] =
            intervalData.data.list[i].main.temp;
          resData["eighteenTempIn" + cityName] =
            intervalData.data.list[i].weather[0].icon;
        }
      }
    };
    // 함수 만드는 로직 끝

    // 함수 실행
    // getIntervalData (cityID, cityName)
    // 1. 서울
    getIntervalData("1835847", "Seoul");
    // 2. 인천
    getIntervalData("1843561", "Incheon");
    // 3. 대구
    getIntervalData("1835327", "Daegu");
    // 4. 광주
    getIntervalData("1841808", "Gwangju");
    // 5. 부산
    getIntervalData("1838519", "Busan");

    // ! 오늘의 09,12,18시 날씨
    /* 
      resData {
        nineTempInSeoul: 2.99,
        nineIconOfSeoul: '01n',
        twelveTempInSeoul: 2.32,
        twelveIconOfSeoul: '03n',
        eighteenTempInSeoul: 1.88,
        eighteenIconOfSeoul: '04n'
      }
    */

    // ! 2. 현재 날씨 구하기
    // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
    // 1.서울
    const currentWeatherSeoul = await axios.get(
      "http://api.openweathermap.org/data/2.5/weather?id=1835847&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
    );
    resData.tempOfSeoul = currentWeatherSeoul.data.main.temp;
    resData.IconOfSeoul = currentWeatherSeoul.data.weather[0].icon;

    // 2.인천
    const currentWeatherIncheon = await axios(
      "http://api.openweathermap.org/data/2.5/weather?id=1843561&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
    );
    resData.tempOfIncheon = currentWeatherIncheon.data.main.temp;
    resData.IconOfIncheon = currentWeatherIncheon.data.weather[0].icon;

    // 3.대구
    const currentWeatherDaegu = await axios(
      "http://api.openweathermap.org/data/2.5/weather?id=1835327&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
    );
    resData.tempOfDaegu = currentWeatherDaegu.data.main.temp;
    resData.IconOfDaegu = currentWeatherDaegu.data.weather[0].icon;

    // 4.광주
    const currentWeatherGwangju = await axios(
      "http://api.openweathermap.org/data/2.5/weather?id=1841808&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
    );
    resData.tempOfGwangju = currentWeatherGwangju.data.main.temp;
    resData.IconOfGwangju = currentWeatherGwangju.data.weather[0].icon;

    // 5.부산
    const currentWeatherBusan = await axios(
      "http://api.openweathermap.org/data/2.5/weather?id=1838519&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
    );
    resData.tempOfBusan = currentWeatherBusan.data.main.temp;
    resData.IconOfBusan = currentWeatherBusan.data.weather[0].icon;

    // ! 필요한 정보 resData변수에 다 담음.
    // console.log("🚀 ~ file: home.js ~ line 35 ~ get: ~ resData", resData);
    /*
                  {
          nineTempInSeoul: '01n',
          twelveTempInSeoul: '03n',
          eighteenTempInSeoul: '04n',
          tempOfSeoul: -3.3,
          IconOfSeoul: '01n',
          nineTempInDaegu: '01n',
          twelveTempInDaegu: '03n',
          eighteenTempInDaegu: '04n',
          nineTempInIncheon: '01n',
          twelveTempInIncheon: '03n',
          eighteenTempInIncheon: '04n',
          nineTempInGwangju: '01n',
          twelveTempInGwangju: '04n',
          eighteenTempInGwangju: '04n',
          nineTempInBusan: '01n',
          twelveTempInBusan: '03n',
          eighteenTempInBusan: '04n',
          tempOfIncheon: -1.17,
          IconOfIncheon: '01n',
          tempOfDaegu: -6,
          IconOfDaegu: '01n',
          tempOfGwangju: -1,
          IconOfGwangju: '04n',
          tempOfBusan: -3,
          IconOfBusan: '01n'
        }
    */
    // ! API문서 형태 맞추기 위해 다시 작업, 리팩토링 날에 이 작업이랑 resData작업이랑 합쳐서 한 번에 resData를 응답하게끔 변경
    const weatherData = {
      // 현재 날씨
      currentWeather: [
        {
          id: 1,
          location: "seoul",
          currentTemp: resData.tempOfSeoul,
          currentWeatherIcon: resData.IconOfSeoul,
        },
        {
          id: 2,
          location: "incheon",
          currentTemp: resData.tempOfIncheon,
          currentWeatherIcon: resData.IconOfIntempOfIncheon,
        },
        {
          id: 3,
          location: "daegu",
          currentTemp: resData.tempOfDaegu,
          currentWeatherIcon: resData.IconOfDaegu,
        },
        {
          id: 4,
          location: "gwangju",
          currentTemp: resData.tempOfGwangju,
          currentWeatherIcon: resData.IconOfGwtempOfGwangju,
        },
        {
          id: 5,
          location: "busan",
          currentTemp: resData.tempOfBusan,
          currentWeatherIcon: resData.IconOfBusan,
        },
      ],
      // 인터벌 날씨
      intervalWeather: [
        {
          seoul: [
            {
              id: "1",
              time: "nine",
              temp: resData.nineTempInSeoul,
              icon: resData.nineIconOfSeoul,
            },
            {
              id: "2",
              time: "twelve",
              temp: resData.twelveTempInSeoul,
              icon: resData.twelveIconOfSeoul,
            },
            {
              id: "3",
              time: "eighteen",
              temp: resData.eighteenTempInSeoul,
              icon: resData.eighteenIconOfSeoul,
            },
          ],
          // 인천
          incheon: [
            {
              id: "1",
              time: "nine",
              temp: resData.nineTempInSeoul,
              icon: resData.nineIconOfSeoul,
            },
            {
              id: "2",
              time: "twelve",
              temp: resData.twelveTempInSeoul,
              icon: resData.twelveIconOfSeoul,
            },
            {
              id: "3",
              time: "eighteen",
              temp: resData.eighteenTempInSeoul,
              icon: resData.eighteenIconOfSeoul,
            },
          ],
          // 대구
          daegu: [
            {
              id: "1",
              time: "nine",
              temp: resData.nineTempInSeoul,
              icon: resData.nineIconOfSeoul,
            },
            {
              id: "2",
              time: "twelve",
              temp: resData.twelveTempInSeoul,
              icon: resData.twelveIconOfSeoul,
            },
            {
              id: "3",
              time: "eighteen",
              temp: resData.eighteenTempInSeoul,
              icon: resData.eighteenIconOfSeoul,
            },
          ],
          // 광주
          gwangju: [
            {
              id: "1",
              time: "nine",
              temp: resData.nineTempInSeoul,
              icon: resData.nineIconOfSeoul,
            },
            {
              id: "2",
              time: "twelve",
              temp: resData.twelveTempInSeoul,
              icon: resData.twelveIconOfSeoul,
            },
            {
              id: "3",
              time: "eighteen",
              temp: resData.eighteenTempInSeoul,
              icon: resData.eighteenIconOfSeoul,
            },
          ],
          // 부산
          busan: [
            {
              id: "1",
              time: "nine",
              temp: resData.nineTempInSeoul,
              icon: resData.nineIconOfSeoul,
            },
            {
              id: "2",
              time: "twelve",
              temp: resData.twelveTempInSeoul,
              icon: resData.twelveIconOfSeoul,
            },
            {
              id: "3",
              time: "eighteen",
              temp: resData.eighteenTempInSeoul,
              icon: resData.eighteenIconOfSeoul,
            },
          ],
        },
      ],
    };
    console.log(
      "🚀 ~ file: home.js ~ line 244 ~ get: ~ weatherData",
      weatherData
    );
    res.status(200).json(weatherData);
  },
};

// ! 함수화 전 수동 로직 x 5 => 함수화 1번 실핼
// ! 1. 09,12,18시 로직

// const intervalData = await axios(
//   //! API 아직 안감춤 테스트 중, 서울의 인터벌 데이터
//   // api.openweathermap.org/data/2.5/forecast?id={city ID}&appid={API key}
//   "http://api.openweathermap.org/data/2.5/forecast?id=1835847&appid=b778f9c375c38e08212c40f3ffdf4927&units=metric"
// );

// // ! 매일 09,12,18시 구함
// const format = moment().format("YYYY-MM-DD");
// // 09시
// const dt_nine = `${format} 09:00:00`;
// // console.log("🚀 ~ file: home.js ~ line 47 ~ get: ~ dt_nine", dt_nine);
// // 12시
// const dt_twelve = `${format} 12:00:00`;
// // console.log("🚀 ~ file: home.js ~ line 49 ~ get: ~ dt_twelve", dt_twelve);
// // 18시
// const dt_eighteen = `${format} 18:00:00`;
// // console.log(
// //   "🚀 ~ file: home.js ~ line 51 ~ get: ~ dt_eighteen",
// //   dt_eighteen
// // );

// for (let i = 0; i < intervalData.data.list.length; i++) {
//   // API 제공

//   // 내가 만든 시간
//   const dt_nine = `${format} 09:00:00`; //  '2020-12-26 09:00:00'
//   const dt_twelve = `${format} 12:00:00`; // '2020-12-26 12:00:00'
//   const dt_eighteen = `${format} 18:00:00`; // '2020-12-26 18:00:00'

//   // API에서 제공하는 날짜 및 시간 : intervalData.data.list[0].dt_txt; // '2020-12-26 09:00:00'
//   // 온도 : intervalData.data.list[i].main.temp
//   // 아이콘 : intervalData.data.list[i].weather[0].icon

//   // 제공한 날씨 정보가 09시냐? -> 맞다면 오늘 09시 날씨라고 응답해줘야함.
//   if (intervalData.data.list[i].dt_txt === dt_nine) {
//     resData.nineTempInSeoul = intervalData.data.list[i].main.temp;
//     resData.nineIconOfSeoul = intervalData.data.list[i].weather[0].icon;
//   }
//   // 제공한 날씨 정보가 12시냐? -> 맞다면 오늘 12시 날씨라고 응답해줘야함.
//   if (intervalData.data.list[i].dt_txt === dt_twelve) {
//     resData.twelveTempInSeoul = intervalData.data.list[i].main.temp;
//     resData.twelveIconOfSeoul = intervalData.data.list[i].weather[0].icon;
//   }
//   // 제공한 날씨 정보가 18시냐? -> 맞다면 오늘 18시 날씨라고 응답해줘야함.
//   if (intervalData.data.list[i].dt_txt === dt_eighteen) {
//     resData.eighteenTempInSeoul = intervalData.data.list[i].main.temp;
//     resData.eighteenIconOfSeoul = intervalData.data.list[i].weather[0].icon;
//   }
// }
// !
