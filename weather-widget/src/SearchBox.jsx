import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "./context/SnackbarContext";

function SearchBox({ updateWeatherData }) {
  const [city, setCity] = useState("");
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "fb4f73e038133c3b12cba943aa341258";
  const { showSnackbar } = useSnackbar();

  const getWeatherInfo = async () => {
    try {
      let response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      let jsonResponse = await response.json();
      // console.log("jsonResponse", jsonResponse);
      let result = {
        city: city,
        temp: jsonResponse.main.temp,
        temMin: jsonResponse.main.temp_min,
        temMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelsLike: jsonResponse.main.feels_like,
        weather: jsonResponse.weather[0].description,
      };
      // console.log("result", result);
      return result;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      showSnackbar("Failed to fetch weather data. Please try again.", "error");
      return null;
    }
  };
  const handleChange = (event) => {
    setCity(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("City name submitted: ", city);
    setCity("");
    const info = await getWeatherInfo();
    updateWeatherData(info);
  };
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4">Search for the Weather</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ mt: 4, mb: 1 }}
          id="city"
          label="City name"
          variant="outlined"
          required
          onChange={handleChange}
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </Box>
  );
}

export default SearchBox;
