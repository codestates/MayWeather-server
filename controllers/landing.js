const { Location, User, User_Location } = require("../models");
const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const SEOUL_ID = process.env.SEOUL_ID;
const SEOUL_LON = process.env.SEOUL_LON;
const SEOUL_LAT = process.env.SEOUL_LAT;

const getWeather = async (cityId, cityLat, cityLon, weatherApiKey) => {
    const result = {}
    // ! 현재 날씨 구하기, 섭씨 온도(&units=metric) 
    // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}&lang={lang}&units=metric      
    const getPresentWeather = await axios(
        `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${weatherApiKey}&lang=kr&units=metric`
        );                
    //!  전 날 온도 구하기 (강수량 안 나옴)
    // https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
        const unixTime = parseInt(new Date().getTime() / 1000) - 86400;
         const getYesterdayWeather = await axios(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${cityLat}&lon=${cityLon}&dt=${unixTime}&appid=${weatherApiKey}&lang=kr&units=metric`            
        )
        
      // ! 현재 대기 오염
      // http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
          const getPresentAirPollution = await axios(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${cityLat}&lon=${cityLon}&appid=${weatherApiKey}&lang=kr`
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
          result['temp'] = getPresentWeather.data.main.temp;
          result['feelLike'] = getPresentWeather.data.main.feels_like;
          result['humidity'] = getPresentWeather.data.main.humidity;
          result['tempMin'] = getPresentWeather.data.main.temp_min;
          result['tempMax'] = getPresentWeather.data.main.temp_max;
          result['weatherDescription'] = getPresentWeather.data.weather[0].description;
          result['weatherIcon'] = getPresentWeather.data.weather[0].icon;
          result['windSpeed'] = getPresentWeather.data.wind.speed;
          result['windDeg'] = getPresentWeather.data.wind.deg;
          result['tempDifferenceYesterday'] = getYesterdayWeather.data.current.temp - getPresentWeather.data.main.temp;
          result['airQualityIndex'] = getPresentAirPollution.data.list[0].main.aqi;
          return result
    }

module.exports = {
  get: async (req, res) => {
    try{
      // const getWeather = async (cityId, cityLat, cityLon, weatherApiKey) => {
        // const SEOUL_ID = process.env.SEOUL_ID;
        // const SEOUL_LAT = process.env.SEOUL_LAT;
        // const SEOUL_LON = process.env.SEOUL_LON;
        // const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
      const weatherData = await getWeather(SEOUL_ID, SEOUL_LAT, SEOUL_LON, WEATHER_API_KEY)
      console.log("🚀 ~ file: landing.js ~ line 63 ~ //getWeather ~ weatherData", weatherData)
      
       if (weatherData) {
        res.status(200).json({
          cityName: '서울',
          temp: weatherData.temp,
          feelLike: weatherData.feelLike,
          humidity: weatherData.humidity,
          tempMin: weatherData.tempMin,
          tempMax: weatherData.tempMax,
          weatherDescription: weatherData.weatherDescription,
          weatherIcon: weatherData.weatherIcon,
          windSpeed: weatherData.windSpeed,
          windDeg: weatherData.windDeg,
          tempDifferenceYesterday: weatherData.tempDifferenceYesterday,
          airQualityIndex: weatherData.airQualityIndex,
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
  post: async (req, res) => {
    try{
      // console.log("🚀 ~ file: landing.js ~ line 11 ~ get: ~ req", req.body)
      const { city } = req.body
      const getLocation = await Location.findOne({
        where:{
          name: city
        }
      })  
      // console.log("🚀 ~ file: landing.js ~ line 98 ~ post: ~ getLocation", getLocation)
      const { name, number, latitude, longitude } = getLocation.dataValues;
      const weatherData = await getWeather(number, latitude, longitude, WEATHER_API_KEY)
      console.log("🚀 ~ file: landing.js ~ line 63 ~ //getWeather ~ weatherData", weatherData)
      
       if (weatherData) {
        res.status(200).json({
          cityName: name,
          temp: weatherData.temp,
          feelLike: weatherData.feelLike,
          humidity: weatherData.humidity,
          tempMin: weatherData.tempMin,
          tempMax: weatherData.tempMax,
          weatherDescription: weatherData.weatherDescription,
          weatherIcon: weatherData.weatherIcon,
          windSpeed: weatherData.windSpeed,
          windDeg: weatherData.windDeg,
          tempDifferenceYesterday: weatherData.tempDifferenceYesterday,
          airQualityIndex: weatherData.airQualityIndex,
        });
      } else {
        res.status(507).json({
          message: "There is an error with the API used by the server.",
        });
      }
    } catch(err) {
      console.error(err)
    }
  }
};
