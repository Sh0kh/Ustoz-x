import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SoftBox from "components/SoftBox";
import breakpoints from "assets/theme/base/breakpoints";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useParams } from "react-router-dom";
import BasicInfo from '../../settings/components/BasicInfo'
import Accounts from '../../settings/components/Accounts'
import Header from "../../settings/components/Header";
import { Users } from "yaponuz/data/api";
import { Frown, Loader } from "lucide-react";
import Sessions from "../../settings/components/Sessions";
import Notification from "../../settings/components/Notifications";
import DeleteAccount from "../../settings/components/DeleteAccount";
import Report from "../../settings/components/Report";
import TestResult from "../../settings/components/TestResult";



function BaseLayout({ stickyNavbar, children }) {
  const { ID } = useParams();
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState()


  const getUser = useCallback(async () => {
    try {
      const response = await Users.getOneUser(ID);
      if (response && response.object) {
        setUserData(response.object);
        setRole(response?.object?.accountType)
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false)
    }
  }, [ID]);

  useEffect(() => {
    getUser()
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);



  return (
    <DashboardLayout>
      <DashboardNavbar absolute={!stickyNavbar} isMini />
      {loading === true ? (
        <div className="flex items-center pb-[50px] h-screen gap-y-4 justify-center flex-col">
          <Loader className="animate-spin ml-2 size-10" />
          <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
        </div>
      ) : (
        <SoftBox mt={stickyNavbar ? 3 : 10}>
          <Grid container>
            <Grid item xs={12} sm={8} lg={8}>
              <AppBar position="static">
                <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                  <Tab label="Basic Info" />

                  {role === 'STUDENT' && (
                    <Tab label="Files" />
                  )}
                  {role === 'STUDENT' && (
                    <Tab label="Referal" />
                  )}
                  {role === 'STUDENT' && (
                    <Tab label="Adress" />
                  )}
                  {role === 'STUDENT' && (
                    <Tab label="Education" />
                  )}
                  {role === 'STUDENT' && (
                    <Tab label="Report" />
                  )}
                  {role === 'STUDENT' && (
                    <Tab label="Test result" />
                  )}
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <SoftBox mt={2}>
            <Header data={userData} />
          </SoftBox>
          <SoftBox mt={3} mb={3}>
            {tabValue === 0 && <BasicInfo data={userData} />}

            {tabValue === 1 && <Accounts />}
            {tabValue === 2 && <Sessions />}
            {tabValue === 3 && <Notification />}
            {tabValue === 4 && <DeleteAccount />}
            {tabValue === 5  && <Report />}
            {tabValue === 6  && <TestResult />}


          </SoftBox>
        </SoftBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

BaseLayout.defaultProps = {
  stickyNavbar: false,
};

BaseLayout.propTypes = {
  stickyNavbar: PropTypes.bool,
  children: PropTypes.node,
};

export default BaseLayout;
