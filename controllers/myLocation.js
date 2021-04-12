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
    get: async (req, res) => {
        try{
            console.log('session', req.session.userId)
            const { userId } = req.session;
            const getUserInfo = await User.findOne({
                include:[{
                    model: User_Location
                }],
                where: {
                    id: userId
                }
            })
            console.log("🚀 ~ file: myLocation.js ~ line 41 ~ get: ~ getUserInfo", getUserInfo.dataValues.User_Locations[0]) 
            console.log('getUserInfo.dataValues.User_Locations[1]',getUserInfo.dataValues.User_Locations[1])
            // ! 지역 2개 선택 유저
            if (getUserInfo.dataValues.User_Locations[1]) {
                const locationId_1 = getUserInfo.dataValues.User_Locations[0].locationId;
                const locationId_2 = getUserInfo.dataValues.User_Locations[1].locationId;
                const getLocationData = await Location.findAll({
                    where:{
                        id: [locationId_1, locationId_2]
                    }
                })
                // console.log("🚀 ~ file: myLocation.js ~ line 53 ~ get: ~ getLocationData", getLocationData)
                // const getWeather = async (cityId, cityLat, cityLon, weatherApiKey) => {
                
                const getWeatherData_1 = await getWeather(getLocationData[0].dataValues.number, getLocationData[0].dataValues.latitude, getLocationData[0].dataValues.longitude, WEATHER_API_KEY )
                console.log("🚀 ~ file: myLocation.js ~ line 58 ~ //getWeather ~ getWeatherData_1", getWeatherData_1)
                const getWeatherData_2 = await getWeather(getLocationData[1].dataValues.number, getLocationData[1].dataValues.latitude, getLocationData[1].dataValues.longitude, WEATHER_API_KEY )
                console.log("🚀 ~ file: myLocation.js ~ line 60 ~ //getWeather ~ getWeatherData_2", getWeatherData_2)
                // temp: 13.02,
                // feelLike: 11.79,
                // humidity: 54,
                // tempMin: 12,
                // tempMax: 14,
                // weatherDescription: '튼구름',
                // weatherIcon: '04n',
                // windSpeed: 0.51,
                // windDeg: 280,
                // tempDifferenceYesterday: -7.05
                

                if (getLocationData) {
                    res.status(200).json({
                        // 1
                        cityName1: getLocationData[0].dataValues.name,
                        temp1: getWeatherData_1.temp,
                        feelLike1: getWeatherData_1.feelLike,
                        humidity1: getWeatherData_1.humidity,
                        tempMin1: getWeatherData_1.tempMin,
                        tempMax1: getWeatherData_1.tempMax,
                        weatherDescription1: getWeatherData_1.weatherDescription,
                        weatherIcon1: getWeatherData_1.weatherIcon,
                        windSpeed1: getWeatherData_1.windSpeed,
                        windDeg1: getWeatherData_1.windDeg,
                        tempDifferenceYesterday1: getWeatherData_1.tempDifferenceYesterday,
                        // 2
                        cityName2: getLocationData[1].dataValues.name,
                        temp2: getWeatherData_2.temp,
                        feelLike2: getWeatherData_2.feelLike,
                        humidity2: getWeatherData_2.humidity,
                        tempMin2: getWeatherData_2.tempMin,
                        tempMax2: getWeatherData_2.tempMax,
                        weatherDescription2: getWeatherData_2.weatherDescription,
                        weatherIcon2: getWeatherData_2.weatherIcon,
                        windSpeed2: getWeatherData_2.windSpeed,
                        windDeg2: getWeatherData_2.windDeg,
                        tempDifferenceYesterday2: getWeatherData_2.tempDifferenceYesterday,
                        
                    })
                } else {
                    res.status(400).json({
                        message: "Bad request"
                    })
                }
            } //! 지역 1개 선택 유저 
            else {
                const locationId_1 = getUserInfo.dataValues.User_Locations[0].locationId;
                const getLocationData = await Location.findOne({
                    where:{
                        id: locationId_1
                    }
                })
                console.log("🚀 ~ file: myLocation.js ~ line 114 ~ get: ~ getLocationData", getLocationData)
                
                const getWeatherData = await getWeather(getLocationData.dataValues.number, getLocationData.dataValues.latitude, getLocationData.dataValues.longitude, WEATHER_API_KEY )
                console.log("🚀 ~ file: myLocation.js ~ line 58 ~ //getWeather ~ getWeatherData", getWeatherData)
                
                // temp: 13.02,
                // feelLike: 11.79,
                // humidity: 54,
                // tempMin: 12,
                // tempMax: 14,
                // weatherDescription: '튼구름',
                // weatherIcon: '04n',
                // windSpeed: 0.51,
                // windDeg: 280,
                // tempDifferenceYesterday: -7.05
                
                if (getWeatherData) {
                    res.status(200).json({
                        // 1
                        cityName1: getLocationData.dataValues.name,
                        temp1: getWeatherData.temp,
                        feelLike1: getWeatherData.feelLike,
                        humidity1: getWeatherData.humidity,
                        tempMin1: getWeatherData.tempMin,
                        tempMax1: getWeatherData.tempMax,
                        weatherDescription1: getWeatherData.weatherDescription,
                        weatherIcon1: getWeatherData.weatherIcon,
                        windSpeed1: getWeatherData.windSpeed,
                        windDeg1: getWeatherData.windDeg,
                        tempDifferenceYesterday1: getWeatherData.tempDifferenceYesterday,
                    })
                } else {
                    res.status(400).json({
                        message: "Bad request"
                    })
                }
            }

        } catch(err) {
            console.error(err)
        }
    },
    post: async (req, res) => {
        try{ 
            const { userId } = req.session
            const { city } = req.body
            console.log("🚀 ~ file: myLocation.js ~ line 36 ~ post: ~ userId", userId)
            console.log("🚀 ~ file: myLocation.js ~ line 38 ~ post: ~ city", city)
            if (userId && city) {
                // ! 1. 도시 아이디 찾기        
                const getLocation = await Location.findOne({
                    where: {
                        name: city
                    }
                }) 
    
                const createUserLocation = await User_Location.create({
                    userId,
                    locationId: getLocation.dataValues.id
                })

                console.log("🚀 ~ file: myLocation.js ~ line 53 ~ post: ~ createUserLocation", createUserLocation)
                
                if (createUserLocation) {
                    res.status(201).json({
                        city
                    })
                } else {
                    res.status(404).json({
                        message: 'Not found'
                    })              
                }
            } else {
                res.status(400).json({
                        message: 'Bad request'
                    })        
            }
        } catch(err) {
        console.error(err)
        }
    }
}