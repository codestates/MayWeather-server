const { Location, User, User_Location } = require("../models");
const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const SEOUL_ID = process.env.SEOUL_ID;
const SEOUL_LON = process.env.SEOUL_LON;
const SEOUL_LAT = process.env.SEOUL_LAT;

const getAirPollutionData = async (cityLat, cityLon, weatherApiKey) => {
    const result = {}       
    // ! 현재 대기 오염
    // http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
    const getPresentAirPollution = await axios(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${cityLat}&lon=${cityLon}&appid=${weatherApiKey}&lang=kr`
    );
    // console.log("🚀 ~ file: landing.js ~ line 17 ~ getAirPollutionData ~ getPresentAirPollution", getPresentAirPollution.data.list[0])
    // console.log("🚀 ~ file: landing.js ~ line 26 ~ get: ~ getPresentAirPollution", getPresentAirPollution.data.list)
    // main
      // main.aqi대기 질 지수. 가능한 값 : 1, 2, 3, 4, 5. 여기서 1 = 좋음, 2 = 보통, 3 = 보통, 4 = 나쁨, 5 = 매우 나쁨.
    // components
      // components.co CO 농도 ( 일산화탄소 ), μg / m 3
      // components.no NO 농도 ( 일산화 질소 ), μg / m 3
      // components.no2 NO 2 농도 ( 이산화질소 ), μg / m 3
      // components.o3 O 3 농도 ( 오존 ), μg / m 3
      // components.so2 SO 2 농도 ( 이산화황 ), μg / m 3
      // components.pm2_5 PM 2.5 농도 ( 미립자 물질 ), μg / m 3
      // components.pm10 PM 10 농도 ( 거친 입자상 물질 ), μg / m 3
      // components.nh3 NH 3 농도 ( 암모니아 ), μg / m 3
    let aqi;
    if(getPresentAirPollution.data.list[0].main.aqi === 1) {
        aqi = '좋음';
    } else if (getPresentAirPollution.data.list[0].main.aqi === 2 || getPresentAirPollution.data.list[0].main.aqi === 3) {
        aqi = '보통';
    } else if (getPresentAirPollution.data.list[0].main.aqi === 4) {
        aqi = '나쁨';
    } else {
        aqi = '매우 나쁨';
    }

    result['airQualityIndex'] = aqi;
    result['co'] = getPresentAirPollution.data.list[0].components.co;
    result['no'] = getPresentAirPollution.data.list[0].components.no;
    result['no2'] = getPresentAirPollution.data.list[0].components.no2;
    result['o3'] = getPresentAirPollution.data.list[0].components.o3;
    result['so2'] = getPresentAirPollution.data.list[0].components.so2;
    result['pm2_5'] = getPresentAirPollution.data.list[0].components.pm2_5;
    result['pm10'] = getPresentAirPollution.data.list[0].components.pm10;
    result['nh3'] = getPresentAirPollution.data.list[0].components.nh3;
    
    return result
    }

module.exports = {
    get: async (req, res) => {
        try{
            const airPollutionData = await getAirPollutionData(SEOUL_LAT, SEOUL_LON, WEATHER_API_KEY)
            console.log("🚀 ~ file: fineDust.js ~ line 52 ~ getWeather ~ airPollutionData", airPollutionData)
            
            if(airPollutionData) {
                res.status(200).json({
                    cityName: '서울',
                    airQualityIndex: airPollutionData.airQualityIndex,
                    co: airPollutionData.co,
                    no: airPollutionData.no,
                    no2: airPollutionData.no2,
                    o3: airPollutionData.o3,
                    so2: airPollutionData.so2,
                    pm2_5: airPollutionData.pm2_5,
                    pm10: airPollutionData.pm10,
                    nh3: airPollutionData.nh3
                })
            } else {
                res.status(500).json({
                    message: "Server Error"
                })
            }
        } catch(err) {
            console.error(err)
        }
    },
    post: async (req, res) => {
        try{
            // console.log("🚀 ~ file: landing.js ~ line 11 ~ get: ~ req", req.body)
            const { city } = req.body
            if (city) {
                const getLocation = await Location.findOne({
                    where:{
                    name: city
                    }
                })  
                // console.log("🚀 ~ file: landing.js ~ line 98 ~ post: ~ getLocation", getLocation)
                const { name, latitude, longitude } = getLocation.dataValues;
                const airPollutionData = await getAirPollutionData(latitude, longitude, WEATHER_API_KEY)
                console.log("🚀 ~ file: fineDust.js ~ line 94 ~ airPollutionData", airPollutionData)
                if(airPollutionData) {
                    res.status(200).json({
                        cityName: name,
                        airQualityIndex: airPollutionData.airQualityIndex,
                        co: airPollutionData.co,
                        no: airPollutionData.no,
                        no2: airPollutionData.no2,
                        o3: airPollutionData.o3,
                        so2: airPollutionData.so2,
                        pm2_5: airPollutionData.pm2_5,
                        pm10: airPollutionData.pm10,
                        nh3: airPollutionData.nh3
                    })
                } else {
                    res.status(404).json({
                        message: "Not Found"
                    })
                }
            } else {
                res.status(400).json({
                        message: "Bad Request"
                })
            }
        } catch(err) {
            console.error(err)
        }
    }
}