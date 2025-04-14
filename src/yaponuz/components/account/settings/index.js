/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Settings page components
import BaseLayout from "../components/BaseLayout";
import Header from "./components/Header";
import BasicInfo from "./components/BasicInfo";
import Accounts from "./components/Accounts";
import Sessions from "./components/Sessions";
import Notification from "./components/Notifications";


function Settings() {
  return (
    <BaseLayout>
      <SoftBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <SoftBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Header />
                </Grid>
                <Grid item xs={12}>
                  <BasicInfo />
                  <Accounts/>
                  <Sessions/>
                  <Notification/>
                </Grid>
              </Grid>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </BaseLayout>
  );
}

export default Settings;
