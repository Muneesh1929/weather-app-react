import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    setLoading(true);

                    let lat = position.coords.latitude;
                    let lon = position.coords.longitude;

                    const API_KEY = import.meta.env.VITE_API_KEY;

                    let response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                    );

                    let data = await response.json();

                    let result = {
                        city: data.name,
                        temp: data.main.temp,
                        tempMin: data.main.temp_min,
                        tempMax: data.main.temp_max,
                        humidity: data.main.humidity,
                        feelslike: data.main.feels_like,
                        weather: data.weather[0].description
                    };

                    setWeatherInfo(result);
                    setLoading(false); // stop loading
                } catch (err) {
                    console.log("Error fetching weather", err);
                    setLoading(false);
                }
            },
            (error) => {
                console.log("Location access denied");
                setLoading(false);
            }
        );
    }, []);

    let updateInfo = async (newInfoPromise) => {
        try {
            setLoading(true);
            let newInfo = await newInfoPromise;
            setWeatherInfo(newInfo);
            return newInfo;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="appContainer">
            <h2 className="heading">🌤 Weather App</h2>
            <SearchBox updateInfo={updateInfo} loading={loading} />

            {loading ? (
                <CircularProgress />
            ) : weatherInfo ? (
                <InfoBox info={weatherInfo} />
            ) : (
                <p>⚠️ Please allow location or search a city</p>
            )}
        </div>
    );
}