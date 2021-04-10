const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

module.exports = {
    post: async (req, res) => {
        console.log('req.body>>>>', req.body) // { cityId: 1835847 }
        const { cityId } = req.body
        
        // ! 현재 날씨 구하기, 섭씨 온도(&units=metric) (강수량 안 나옴)
        // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}&lang={lang}&units=metric
        const getPresentWeather = async (cityId) => {
            const PresentWeather = await axios(
            `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${WEATHER_API_KEY}&lang=kr&units=metric`
            );                
            console.log("🚀 ~ file: weather.js ~ line 16 ~ getPresentWeather ~ PresentWeather", PresentWeather)
            if (PresentWeather.data) {
               res.status(200).json({
                   temp: PresentWeather.data.main.temp,
                   feelLike: PresentWeather.data.main.feels_like,
                   humidity: PresentWeather.data.main.humidity,
                   tempMin: PresentWeather.data.main.temp_min,
                   tempMax: PresentWeather.data.main.temp_max,
                   weatherDescription: PresentWeather.data.weather[0].description,
                   weatherIcon: PresentWeather.data.weather[0].icon,
                   windSpeed: PresentWeather.data.wind.speed,
                   windDeg: PresentWeather.data.wind.deg,
               })
           } else {
                res.status(404).json({
                    message: 'Not found'
                })              
           }
        }
        getPresentWeather(cityId)

    }
}