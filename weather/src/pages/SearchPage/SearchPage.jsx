import { useState, useEffect } from "react"
import "./SearchPage.css"
import WeatherCard from "../../components/WeatherCard/WeatherCard.jsx"

const SearchPage = () => {
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(undefined)

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true)
                const lat = 54.9924
                const lon = 73.3686

                const res = await fetch(
                    `https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=RmSGAoEFh9JuVOYK&lat=${lat}&lon=${lon}&asl=90&format=json`
                )

                if (!res.ok) {
                    throw new Error('Ошибка загрузки данных о погоде')
                }

                const data = await res.json()

                setWeatherData(data)
                setError(undefined)

            } catch (error) {
                console.error(error)
            }
        }

        fetchWeatherData()
    }, [])


    const getHourlyWeatherCards = () => {
        if (!weatherData || !weatherData.data_1h) {return []}

        const hourlyData = weatherData.data_1h
        const cards = []

        if (!hourlyData.time || !hourlyData.temperature) {
            console.log('Отсутствуют необходимые поля в hourly данных')
            return []
        }

        for (let i = 0; i < 24 && i < hourlyData.time.length; i++) {
            try {
                const timeString = hourlyData.time[i]
                const temperature = hourlyData.temperature[i]
                const weatherCode = hourlyData.pictocode ? hourlyData.pictocode[i] : 1
                const [datePart, timePart] = timeString.split(' ')
                const [hours] = timePart.split(':')
                const cardData = {
                    date: datePart,
                    time: parseInt(hours),
                    temperature: temperature,
                    weatherCode: weatherCode,
                    key: `hourly-${i}`
                }
                cards.push(cardData)

            } catch (error) {
                console.error(error)
            }
        }
        return cards
    }

    const getDailyWeatherCards = () => {
        if (!weatherData || !weatherData.data_day) return []
        const dailyData = weatherData.data_day

        const cards = []

        if (!dailyData.time || !dailyData.temperature_mean) {
            
            return []
        }

        for (let i = 0; i < dailyData.time.length; i++) {
            try {
                const date = dailyData.time[i]
                const temperature = dailyData.temperature_mean[i]
                const weatherCode = dailyData.pictocode ? dailyData.pictocode[i] : 1

                cards.push({
                    date: date,
                    temperature: temperature,
                    weatherCode: weatherCode,
                    key: `daily-${i}`
                })
            } catch (error) {
                console.error(error)
            }
        }

        return cards
    }

    const hourlyCards = getHourlyWeatherCards()
    const dailyCards = getDailyWeatherCards()

    return (
        <div className="search-page">
            <h1 className="search-page__title">Погода в Омске</h1>

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Загрузка данных о погоде...</p>
                </div>
            )}

            {error && (
                <div className="error">
                    <h3>Ошибка</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Попробовать снова
                    </button>
                </div>
            )}

            {weatherData && !loading && !error && (
                <>
                    <section className="weather-section">
                        <h2>Погода на сегодня</h2>
                        {hourlyCards.length > 0 ? (
                            <div className="weather-feed hourly-feed">
                                {hourlyCards.map(weather => (
                                    <WeatherCard
                                        key={weather.key}
                                        date={weather.date}
                                        time={weather.time}
                                        temperature={weather.temperature}
                                        weatherCode={weather.weatherCode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>Нет данных о почасовой погоде</p>
                                <p style={{ fontSize: '0.9em', color: '#666' }}>
                                    Проверьте структуру данных в консоли
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="weather-section">
                        <h2>Прогноз на неделю</h2>
                        {dailyCards.length > 0 ? (
                            <div className="weather-feed daily-feed">
                                {dailyCards.map(weather => (
                                    <WeatherCard
                                        key={weather.key}
                                        date={weather.date}
                                        temperature={weather.temperature}
                                        weatherCode={weather.weatherCode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>Нет данных о дневной погоде</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    )
}

export default SearchPage