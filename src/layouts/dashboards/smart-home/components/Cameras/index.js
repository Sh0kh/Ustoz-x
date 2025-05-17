import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Soft UI Dashboard PRO React example components
import CameraView from "layouts/dashboards/smart-home/components/CameraView";

// Images
import camera1 from "assets/images/cambrige.jpg";
import camera2 from "assets/images/oxford.jpg";
import camera3 from "assets/images/oxford2.jpg";

function Cameras() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [camera, setCamera] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.md
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    // Function to format the current date and time
    function formatDateTime() {
      const now = new Date();

      // Format date as DD.MM.YYYY
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
      const year = now.getFullYear();

      // Format time as HH:MM AM/PM
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
      const formattedMinutes = minutes.toString().padStart(2, "0");

      setCurrentDate(`${day}.${month}.${year}`);
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    }

    // Update date and time every minute
    const interval = setInterval(formatDateTime, 1000);

    // Set initial values
    formatDateTime();

    return () => clearInterval(interval);
  }, []);

  const handleSetCamera = (event, newCamera) => setCamera(newCamera);

  return (
    <Card>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6">University</SoftTypography>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" width="60%">
          <SoftBox width="90%">
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={camera} onChange={handleSetCamera}>
                <Tab label="Cambridge" />
                <Tab label="Oxford " />
                <Tab label="Stanford" />
              </Tabs>
            </AppBar>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <SoftBox p={2} mt={1} width="100%" height="40rem">
        <CameraView
          image={camera1}
          date={currentDate}
          time={currentTime}
          value={camera}
          index={0}
        />
        <CameraView
          image={camera2}
          date={currentDate}
          time={currentTime}
          value={camera}
          index={1}
        />
        <CameraView
          image={camera3}
          date={currentDate}
          time={currentTime}
          value={camera}
          index={2}
        />
      </SoftBox>
    </Card>
  );
}

export default Cameras;
