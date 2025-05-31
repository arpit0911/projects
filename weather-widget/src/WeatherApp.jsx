import React from "react";
import SearchBox from "./SearchBox";
import InfoBox from "./infoBox";

function WeatherApp() {
  const [weatherData, setWeatherData] = React.useState(null);

  const updateWeatherData = (data) => {
    setWeatherData(data);
  };
  return (
    <>
      <SearchBox updateWeatherData={updateWeatherData} />
      <InfoBox weatherData={weatherData} />
    </>
  );
}

export default WeatherApp;
