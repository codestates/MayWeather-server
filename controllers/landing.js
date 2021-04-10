const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const SEOUL_ID = process.env.SEOUL_ID;
const SEOUL_LON = process.env.SEOUL_LON;
const SEOUL_LAT = process.env.SEOUL_LAT;

module.exports = {
  get: async (req, res) => {
    try{
      // ! 현재 날씨 구하기, 섭씨 온도(&units=metric) (강수량 안 나옴)
      // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}&lang={lang}&units=metric
      
        const getPresentWeather = await axios(
          `http://api.openweathermap.org/data/2.5/weather?id=${SEOUL_ID}&appid=${WEATHER_API_KEY}&lang=kr&units=metric`
          );                
        console.log("🚀 ~ file: landing.js ~ line 19 ~ get: ~ getPresentWeather", getPresentWeather.data)
        
      //!  전 날 온도 구하기 (강수량 안 나옴)
      // https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
          const unixTime = parseInt(new Date().getTime() / 1000) - 86400;
          console.log("🚀 ~ file: landing.js ~ line 23 ~ get: ~ unixTime", unixTime)

          const getYesterdayWeather = await axios(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${SEOUL_LAT}&lon=${SEOUL_LON}&dt=${unixTime}&appid=${WEATHER_API_KEY}&lang=kr&units=metric`            
          )
          
          // console.log("🚀 ~ file: landing.js ~ line 26 ~ get: ~ getYesterdayWeather", getYesterdayWeather.data.current.temp)
          
          


      // ! 현재 대기 오염
      // http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}

          const getPresentAirPollution = await axios(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${SEOUL_LAT}&lon=${SEOUL_LON}&appid=${WEATHER_API_KEY}&lang=kr`
          );
          // console.log("🚀 ~ file: landing.js ~ line 26 ~ get: ~ getPresentAirPollution", getPresentAirPollution.data.list)
          // main
            // main.aqi대기 질 지수. 가능한 값 : 1, 2, 3, 4, 5. 여기서 1 = 좋음, 2 = 보통, 3 = 보통, 4 = 나쁨, 5 = 매우 나쁨.
          // components
            // components.coCO 농도 ( 일산화탄소 ), μg / m 3
            // components.noNO 농도 ( 일산화 질소 ), μg / m 3
            // components.no2NO 2 농도 ( 이산화질소 ), μg / m 3
            // components.o3O 3 농도 ( 오존 ), μg / m 3
            // components.so2SO 2 농도 ( 이산화황 ), μg / m 3
            // components.pm2_5PM 2.5 농도 ( 미립자 물질 ), μg / m 3
            // components.pm10PM 10 농도 ( 거친 입자상 물질 ), μg / m 3
            // components.nh3NH 3 농도 ( 암모니아 ), μg / m 3
          
      // ! 지도
      // https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}
      // layer: temp_new
      // {z}	필수	줌 레벨 수
      // {x}	필수	x 타일 좌표의 수
      // {y}	필수	y 타일 좌표의 수

            // const getWeatherMap = await axios(
            //   `https://tile.openweathermap.org/map/temp_new/10/10/10.png?appid=${WEATHER_API_KEY}`
            // )
            // console.log("🚀 ~ file: landing.js ~ line 50 ~ get: ~ getWeatherMap", getWeatherMap)

      if (getPresentWeather.data) {
        res.status(200).json({
          temp: getPresentWeather.data.main.temp,
          feelLike: getPresentWeather.data.main.feels_like,
          humidity: getPresentWeather.data.main.humidity,
          tempMin: getPresentWeather.data.main.temp_min,
          tempMax: getPresentWeather.data.main.temp_max,
          weatherDescription: getPresentWeather.data.weather[0].description,
          weatherIcon: getPresentWeather.data.weather[0].icon,
          windSpeed: getPresentWeather.data.wind.speed,
          windDeg: getPresentWeather.data.wind.deg,
          tempDifferenceYesterday: getYesterdayWeather.data.current.temp - getPresentWeather.data.main.temp,
          airQualityIndex: getPresentAirPollution.data.list[0].main.aqi,
          // getWeatherMap: getWeatherMap.data
        });
      } else {
        res.status(507).json({
          message: "There is an error with the API used by the server.",
        });
      }
    } catch(err) {
      console.error(err)
    }
  },
};
