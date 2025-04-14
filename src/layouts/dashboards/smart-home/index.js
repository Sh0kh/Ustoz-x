import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import WeatherCard from "examples/Cards/WeatherCard";
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// SmartHome dashboard components
import Cameras from "layouts/dashboards/smart-home/components/Cameras";

// Images
import iconSunCloud from "assets/images/small-logos/icon-sun-cloud.png";
import { Dashboard } from "yaponuz/data/api";

function SmartHome() {
  const [resprtData, setReportData] = useState([]);
  const [lData, setLdata] = useState([]);
  const [weatherData, setWeatherData] = useState({
    location: "Tashkent",
    degree: null,
    condition: "",
  });

  const GetReport = async () => {
    try {
      const response = await Dashboard.getReport();
      setReportData(response?.object?.pc_health);
      setLdata(response?.object);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchWeather = async () => {
    const API_KEY = "451250de5afc005e74a6116a77a92d0a ";
    const city = "Tashkent";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData({
        location: data.name,
        degree: Math.round(data.main.temp),
        condition: data.weather[0].description,
      });
    } catch (error) {
      console.error("Ошибка получения данных о погоде:", error);
    }
  };

  useEffect(() => {
    GetReport();
    fetchWeather(); // Получаем данные о погоде при монтировании компонента
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} xl={7}>
              <Cameras />
            </Grid>
            <Grid item xs={12} xl={5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <WeatherCard
                    title="Weather Today"
                    weather={{
                      location: weatherData.location,
                      degree: weatherData.degree || "N/A", // Если температура недоступна
                    }}
                    icon={{
                      component: iconSunCloud,
                      text: weatherData.condition || "N/A", // Если данные о погоде недоступны
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.users?.allStudent || "0"}
                    suffix={<>ta</>}
                    title="O'quvchilar soni"
                    description="students"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.users?.allTeacher || "0"}
                    suffix="ta"
                    title="Ustozlar soni"
                    description="teachers"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.allCourse || 0}
                    suffix="ta"
                    title="Kurslar soni"
                    description="Course"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.allLesson || 0}
                    suffix="ta"
                    title="Darslar soni"
                    description="Lessons"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.allModule || 0}
                    suffix="ta"
                    title="Modular soni"
                    description="Modul"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultCounterCard
                    count={lData?.allQuiz || 0}
                    suffix="ta"
                    title="Savolar soni"
                    description="Quiz"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default SmartHome;
