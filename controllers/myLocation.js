const { Location, User, User_Location } = require("../models");
const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const getWeather = async (cityId, cityLat, cityLon, weatherApiKey) => {
                const result = {}
                // ! 현재 날씨 구하기, 섭씨 온도(&units=metric) 
                const getPresentWeather = await axios(
                    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${weatherApiKey}&lang=kr&units=metric`
                    );                
                //!  전 날 온도 구하기 (강수량 안 나옴)
                    const unixTime = parseInt(new Date().getTime() / 1000) - 86400;
                    const getYesterdayWeather = await axios(
                    `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${cityLat}&lon=${cityLon}&dt=${unixTime}&appid=${weatherApiKey}&lang=kr&units=metric`            
                    )
                
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
                    return result
            }

module.exports = {
    post: async (req, res) => {
        try{ 
            const { city } = req.body
            
            // ! 1. 도시 아이디 찾기        
            const getLocation = await Location.findOne({
                where: {
                    name: city
                }
            })
            const { name, number, latitude, longitude } = getLocation.dataValues;

            const weatherData = await getWeather(number, latitude, longitude, WEATHER_API_KEY)
            console.log("🚀 ~ file: myLocation.js ~ line 46 ~ post: ~ weaherData", weatherData)
            // temp: 15,
            // feelLike: 13.37,
            // humidity: 31,
            // tempMin: 15,
            // tempMax: 15,
            // weatherDescription: '맑음',
            // weatherIcon: '01n',
            // windSpeed: 2.57,
            // windDeg: 150,
            // tempDifferenceYesterday: -4
            if (weatherData) {
                res.status(200).json({
                    cityname: name,
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
                })
            } else {
                res.status(404).json({
                    message: 'Not found'
                })              
            }
        } catch(err) {
        console.error(err)
        }
    }
}