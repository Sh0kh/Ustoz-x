// @mui material components
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// React and Data
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "yaponuz/data/controllers/course";
import CourseInfo from "./Components/CourseInfo";
import CourseRating from "./Components/CourseRating";
import { Reting } from "yaponuz/data/controllers/rating";
import CourseEnrollment from "./Components/CourseEnrollment";



// Helper: TabPanel
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function CourseDetail() {

    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox p={3}>
                        <SoftTypography variant="h5" fontWeight="medium" mb={2}>
                            Course
                        </SoftTypography>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleChange} aria-label="Course detail tabs">
                                <Tab label="Info" />
                                <Tab label="Rating" />
                                <Tab label="Enrollment" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <CourseInfo />
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <CourseRating />
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <CourseEnrollment />
                        </TabPanel>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};