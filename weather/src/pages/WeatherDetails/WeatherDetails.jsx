import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./WeatherDetails.css"

const WeatherDetails = () => {
    const { date } = useParams()
    const navigate = useNavigate()
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [hourlyDetails, setHourlyDetails] = useState([])

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const lat = 54.9924
                const lon = 73.3686
                
                const res = await fetch(
                    `https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=RmSGAoEFh9JuVOYK&lat=${lat}&lon=${lon}&asl=90&format=json`
                )
                
                const data = await res.json()
                setWeatherData(data)
    
                if (data && data.data_1h) {
                    const details = getWeatherDetails(data, date)
                    setHourlyDetails(details.hourlyForDate || [])
                }
                
            } catch (error) {
                console.error(error)
            } 
        }

        fetchWeatherData()
    }, [date])

    const getWeatherDetails = (weatherData, selectedDate) => {
        if (!weatherData || !weatherData.data_1h) return { hourlyForDate: [] }

        const hourlyData = weatherData.data_1h
        const hourlyForDate = []
        
        if (hourlyData && hourlyData.time) {
            hourlyData.time.forEach((timeString, index) => {
                const [currentDate, timePart] = timeString.split(' ')
               
                if (currentDate === selectedDate) {
                    const time = timePart.split(':')[0] + ':00'
                    hourlyForDate.push({
                        time: time,
                        temperature: hourlyData.temperature[index],
                        precipitation: hourlyData.precipitation[index],
                        windspeed: hourlyData.windspeed[index],
                        weatherCode: hourlyData.pictocode[index],
                        humidity: hourlyData.relativehumidity[index],
                        pressure: hourlyData.sealevelpressure[index],
                        feelsLike: hourlyData.felttemperature ? hourlyData.felttemperature[index] : null
                    })
                }
            })
        }
        
        return { hourlyForDate }
    }

    const getWeatherIcon = (code) => {
        const weatherIcons = {
            1: "☀️", 2: "⛅", 3: "⛅", 4: "☁️", 5: "🌫️", 6: "🌫️",
            7: "🌧️", 8: "🌧️", 9: "🌧️", 10: "⛈️", 11: "⛈️", 12: "⛈️",
            13: "🌨️", 14: "🌨️", 15: "🌨️", 16: "🌨️", 17: "🌧️", 18: "🌧️",
            19: "🌨️", 20: "🌨️", 21: "⛈️", 22: "🌨️", 23: "🌨️", 24: "🌨️",
            25: "🌨️", 26: "🌨️", 27: "🌨️", 28: "🌨️", 29: "🌨️", 30: "🌨️",
            31: "🌨️", 32: "🌧️", 33: "🌧️", 34: "🌧️"
        }
        return weatherIcons[code] || "🌈"
    }

    const getWeatherDescription = (code) => {
        const descriptions = {
            1: "Ясно", 2: "Малооблачно", 3: "Переменная облачность", 4: "Облачно",
            5: "Туман", 6: "Туман", 7: "Небольшой дождь", 8: "Дождь", 9: "Дождь",
            10: "Гроза", 11: "Гроза", 12: "Гроза", 13: "Снег", 14: "Снег", 15: "Снег",
            16: "Снег", 17: "Ливень", 18: "Ливень", 19: "Снегопад", 20: "Снегопад",
            21: "Гроза с дождем", 22: "Снег", 23: "Снег", 24: "Снег", 25: "Снег",
            26: "Снег", 27: "Снег", 28: "Снег", 29: "Снег", 30: "Снег", 31: "Снег",
            32: "Дождь", 33: "Дождь", 34: "Дождь"
        }
        return descriptions[code] || "Неизвестно"
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="weather-details">
                <div className="loading">Загрузка данных о погоде...</div>
            </div>
        )
    }

    return (
        <div className="weather-details">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Назад
            </button>
            
            <h1>Детали погоды на {formatDate(date)}</h1>
            
            {hourlyDetails.length > 0 ? (
                <div className="details-content">
                    <div className="hourly-details">
                        <h2>Почасовой прогноз</h2>
                        <div className="hourly-list">
                            {hourlyDetails.map((hour, index) => (
                                <div key={index} className="hour-item">
                                    <div className="hour-time">{hour.time}</div>
                                    <div className="hour-icon">
                                        {getWeatherIcon(hour.weatherCode)}
                                    </div>
                                    <div className="hour-temp">{Math.round(hour.temperature)}°C</div>
                                    <div className="hour-desc">{getWeatherDescription(hour.weatherCode)}</div>
                                    <div className="hour-details">
                                        <span>💨 {Math.round(hour.windspeed)} м/с</span>
                                        <span>💧 {hour.precipitation} мм</span>
                                        <span>💦 {hour.humidity}%</span>
                                        {hour.feelsLike && <span>🌡️ {Math.round(hour.feelsLike)}°C</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    
                    <div className="day-summary">
                        <h2>Сводка за день</h2>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Температура:</span>
                                <span className="stat-value">
                                    мин {Math.min(...hourlyDetails.map(h => h.temperature))}°C / 
                                    макс {Math.max(...hourlyDetails.map(h => h.temperature))}°C
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Осадки:</span>
                                <span className="stat-value">
                                    {hourlyDetails.reduce((sum, h) => sum + h.precipitation, 0)} мм
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Влажность:</span>
                                <span className="stat-value">
                                    в среднем {Math.round(hourlyDetails.reduce((sum, h) => sum + h.humidity, 0) / hourlyDetails.length)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-data">
                    <h3>Нет данных о погоде для выбранной даты</h3>
                    <p>Выбранная дата: {date}</p>
                    <p>Попробуйте выбрать другую дату из списка на главной странице.</p>
                    <button onClick={() => navigate('/')} className="home-button">
                        Вернуться на главную
                    </button>
                </div>
            )}
        </div>
    )
}

export default WeatherDetails