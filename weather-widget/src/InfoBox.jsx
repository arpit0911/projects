import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function InfoBox({ weatherData }) {
  const INIT_IMAGE_URL =
    "https://plus.unsplash.com/premium_vector-1714142580885-97d3f0e39f98?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const RAIN_IMAGE_URL =
    "https://plus.unsplash.com/premium_vector-1731922952081-2a303a5b0994?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const HOT_WEATHER_IMAGE_URL =
    "https://images.unsplash.com/vector-1738925597996-4e8cbe2fe7bc?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const COLD_WEATHER_IMAGE_URL =
    "https://plus.unsplash.com/premium_vector-1731922952150-9908d50783cc?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const PLEASANT_WEATHER_IMAGE_URL =
    "https://plus.unsplash.com/premium_vector-1731922952078-2ebb47420bd7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxlYXNlbnQlMjB3ZWF0aGVyfGVufDB8fDB8fHww"; // Example: clear sky, green field, or mild weather

  let imageUrl = INIT_IMAGE_URL;
  console.log("Weather Data:", weatherData);
  if (weatherData != null) {
    if (
      weatherData.weather &&
      weatherData.weather.toLowerCase().includes("rain")
    ) {
      imageUrl = RAIN_IMAGE_URL;
    } else if (weatherData.temp != null && weatherData.temp >= 30) {
      imageUrl = HOT_WEATHER_IMAGE_URL;
    } else if (weatherData.temp != null && weatherData.temp <= 10) {
      console.log("Cold weather detected", weatherData.temp);
      imageUrl = COLD_WEATHER_IMAGE_URL;
    } else {
      imageUrl = PLEASANT_WEATHER_IMAGE_URL;
    }
  }
  console.log("Image URL:", imageUrl);

  if (!weatherData) {
    return (
      <div
        className="InfoBox"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          padding: "16px",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            minWidth: 260,
            boxShadow: 6,
            borderRadius: 3,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              height: { xs: 180, sm: 220 },
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
            }}
            image={imageUrl}
            title="No Data"
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ fontWeight: 600, textAlign: "center" }}
            >
              No weather data available.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="InfoBox"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        padding: "16px",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          minWidth: 260,
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: { xs: 180, sm: 220 },
            objectFit: "contain",
            backgroundColor: "#f5f5f5",
          }}
          image={imageUrl}
          title={weatherData.weather}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {weatherData.city}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            {weatherData.weather}
          </Typography>
          <Typography variant="body1">
            <strong>Temperature:</strong> {weatherData.temp}°C
          </Typography>
          <Typography variant="body2">
            <strong>Min:</strong> {weatherData.tempMin}°C, <strong>Max:</strong>{" "}
            {weatherData.tempMax}°C
          </Typography>
          <Typography variant="body2">
            <strong>Humidity:</strong> {weatherData.humidity}%
          </Typography>
          <Typography variant="body2">
            <strong>Feels Like:</strong> {weatherData.feelsLike}°C
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
