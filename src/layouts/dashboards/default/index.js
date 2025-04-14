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
import Icon from "@mui/material/Icon";
import ComputerIcon from "@mui/icons-material/Computer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import Globe from "examples/Globe";
import { Dashboard } from "yaponuz/data/api";

// Soft UI Dashboard PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Data
import salesTableData from "layouts/dashboards/default/data/salesTableData";
import { useEffect, useState } from "react";


function Default() {
  const { values } = breakpoints;
  const [resprtData, setReportData] = useState([])
  const [lData, setLdata] = useState([])


  const getReport = async () => {
    try {
      const response = await Dashboard.getReport()
      setReportData(response?.object?.pc_health)
      setLdata(response?.object)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getReport()
  }, [])


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container>
          <Grid item xs={12} lg={7}>
            <SoftBox mb={3} p={1}>
              <SoftTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                server status
              </SoftTypography>
            </SoftBox>

            <Grid container>
              <Grid item xs={12}>
                <Globe
                  display={{ xs: "none", md: "block" }}
                  position="absolute"
                  top="10%"
                  right={0}
                  mt={{ xs: -12, lg: 1 }}
                  mr={{ xs: 0, lg: 10 }}
                  canvasStyle={{ marginTop: "3rem" }}
                />
              </Grid>
            </Grid>


            <Grid container spacing={3}>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "PC Status", fontWeight: "bold" }}
                    count={resprtData?.status || "N/N"}
                    // percentage={{ color: "success", text: "+55%" }}
                    icon={{
                      color: "info",
                      component: <ComputerIcon style={{ fontSize: 40 }} />,
                    }}
                  />
                </SoftBox>
                <MiniStatisticsCard
                  title={{ text: "Info Database", fontWeight: "bold" }}
                  count={resprtData?.components?.db?.details?.database || "N/N"}
                  icon={{
                    color: "info",
                    component: <ComputerIcon style={{ fontSize: 40 }} />,
                  }} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "Db Status", fontWeight: "bold" }}
                    count={resprtData?.components?.db?.status || "N/N"}
                    // percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "Validation Query", fontWeight: "bold" }}
                    count={resprtData?.components?.db?.details?.validationQuery || "N/N"}
                    icon={{
                      color: "info",
                      component: "shopping_cart",
                    }}
                  />
                </SoftBox>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{
                      text: "Total memory",
                      fontWeight: "bold",
                    }}
                    count={
                      resprtData?.components?.diskSpace?.details?.total
                        ? `${Math.round(resprtData.components.diskSpace.details.total / (1024 ** 3))} GB`
                        : "N/N"
                    }
                    icon={{ color: "info", component: "paid" }}
                  />


                </SoftBox>
                <MiniStatisticsCard
                  title={{ text: "Free memory", fontWeight: "bold" }}
                  count={
                    resprtData?.components?.diskSpace?.details?.total
                      ? `${Math.round(resprtData.components.diskSpace.details.free / (1024 ** 3))} GB`
                      : "N/N"
                  }
                  icon={{ color: "info", component: "public" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "Memory full", fontWeight: "bold" }}
                    count={
                      resprtData?.components?.diskSpace?.details?.threshold
                        ? resprtData.components.diskSpace.details.threshold >= 1024 ** 3
                          ? `${Math.round(resprtData.components.diskSpace.details.threshold / (1024 ** 3))} GB`
                          : `${Math.round(resprtData.components.diskSpace.details.threshold / (1024 ** 2))} MB`
                        : "N/N"
                    }
                    icon={{ color: "info", component: "emoji_events" }}
                  />


                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "Disc Space Status", fontWeight: "bold" }}
                    count={resprtData?.components?.diskSpace?.status || "N/N"}
                    icon={{
                      color: "info",
                      component: "shopping_cart",
                    }}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* Первая таблица */}
            <Grid item xs={12} md={6}>
              <TableContainer style={{ backgroundColor: 'white' }} component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Users</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Students</TableCell>
                      <TableCell>{lData?.users?.allStudent || '0'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Teacher</TableCell>
                      <TableCell>{lData?.users?.allTeacher || '0'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Support Center</TableCell>
                      <TableCell>{lData?.users?.allSupportCenter || '0'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>All User </TableCell>
                      <TableCell>{lData?.users?.allUser || '0'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Вторая таблица */}
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Educational subjects
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>{lData?.allCourse || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lesson</TableCell>
                      <TableCell>{lData?.allLesson || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Module</TableCell>
                      <TableCell>{lData?.allModule || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quiz</TableCell>
                      <TableCell>{lData?.allQuiz || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
