import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css"
import { useState } from 'react';

export default function SearchBox({ updateInfo , loading}) {
    let [city, setCity] = useState("");
    let [error, setError] = useState(false);

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = import.meta.env.VITE_API_KEY;

    let getWeatherInfo = async () => {
        let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let jsonResponse = await response.json();

        if (jsonResponse.cod === "404") {
            throw new Error("City not found");
        }

        let result = {
            city: city,
            temp: jsonResponse.main.temp,
            tempMin: jsonResponse.main.temp_min,
            tempMax: jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            feelslike: jsonResponse.main.feels_like,
            weather: jsonResponse.weather[0].description
        };

        return result;
    };


    let handleChange = (event) => {
        setCity(event.target.value);
    };

    let handleSubmit = async (event) => {
        event.preventDefault();
        setError(false);

        try {
            await updateInfo(getWeatherInfo()); 
            setCity("");
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className='SearchBox'>
            <form action="" onSubmit={handleSubmit}>
                <TextField id="outlined-basic" label="Enter city Name" variant="outlined" required value={city} onChange={handleChange} />
                <br /><br />
                <Button variant="contained" type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
                {error && <p style={{ color: "red" }}>"No such city found. Please try again."</p>}
            </form>
        </div>
    )
}