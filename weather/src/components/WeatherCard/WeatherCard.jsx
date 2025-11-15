import './WeatherCard.css'
import { useNavigate } from 'react-router-dom'

const WeatherCard = ({ date, temperature, weatherCode, time }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/weather/${date}`)
    }

    const getWeatherIcon = (code) => {
        const weatherIcons = {
            1: "☀️",
            2: "⛅",
            3: "⛅",
            4: "☁️",
            5: "🌫️",
            6: "🌫️", 
            7: "🌧️",  
            8: "🌧️",   
            9: "🌧️",   
            10: "⛈️",  
            11: "⛈️",  
            12: "⛈️",  
            13: "❄️",  
            14: "❄️",  
            15: "❄️",  
            16: "❄️",  
            17: "🌧️",  
            18: "🌧️",  
            19: "❄️",  
            20: "❄️",  
            21: "⛈️",  
            22: "❄️",  
            23: "❄️",  
            24: "❄️",  
            25: "❄️",  
            26: "❄️",  
            27: "❄️",  
            28: "❄️",  
            29: "❄️",  
            30: "❄️",  
            31: "❄️",  
            32: "🌧️",  
            33: "🌧️",  
            34: "🌧️",  
        }
        return weatherIcons[code] || "🌈"
    }

    const getWeatherDescription = (code) => {
        const descriptions = {
            1: "Ясно",
            2: "Малооблачно",
            3: "Переменная облачность",
            4: "Облачно",
            5: "Туман",
            6: "Туман",
            7: "Небольшой дождь",
            8: "Дождь",
            9: "Дождь",
            10: "Гроза",
            11: "Гроза",
            12: "Гроза",
            13: "Снег",
            14: "Снег",
            15: "Снег",
            16: "Снег",
            17: "Ливень",
            18: "Ливень",
            19: "Снегопад",
            20: "Снегопад",
            21: "Гроза с дождем",
            22: "Снег",
            23: "Снег",
            24: "Снег",
            25: "Снег",
            26: "Снег",
            27: "Снег",
            28: "Снег",
            29: "Снег",
            30: "Снег",
            31: "Снег",
            32: "Дождь",
            33: "Дождь",
            34: "Дождь"
        }
        return descriptions[code] || "Неизвестно"
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        })
    }

    return (
        <div onClick={handleClick} className="weather-card">
            <div className="weather_header">
                <span className="weather_date">{formatDate(date)}</span>
                {time !== undefined && <span className="weather_time">{time}:00</span>}
            </div>
            <div className="weather_icon" title={getWeatherDescription(weatherCode)}>
                {getWeatherIcon(weatherCode)}
            </div>
            <div className="weather_temperature">
                {Math.round(temperature)}°C
            </div>
            <div className="weather_description">
                {getWeatherDescription(weatherCode)}
            </div>
        </div>
    )
}

export default WeatherCard