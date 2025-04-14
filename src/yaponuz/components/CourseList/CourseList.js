// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";

// Data
import { useEffect, useState } from "react";
import ActionCell from "./components/ActionCell";
import SoftBadge from "components/SoftBadge";

import AddCourse from "./components/AddCourse";
import { Course } from "yaponuz/data/controllers/course";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function CourseList() {
  // variables
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // fetching data function
  const getAllCourses = async (page, size) => {
    try {
      const response = await Course.getAllCourses(page, size);
      setCourses(response.object);
      setTotalPages(response.object.totalPages);
    } catch (err) {
      console.log("Error from courses list GET: ", err);
    }
  };

  // mounting
  useEffect(() => {
    getAllCourses(page, size);
  }, [page, size]);

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "Teacher Name", accessor: "teacherName" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "Block", accessor: "block" },
    { Header: "action", accessor: "action" },
  ];

  const rows = courses?.map((course) => ({
    id: course.id,
    name: course.name,
    teacherName: course.teacherName,
    createdAt:
      new Date(course.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    block: `${course.block}`,
    action: <ActionCell id={course.id} item={course} refetch={() => getAllCourses(page, size)} />,
  }));

  const tabledata = {
    columns,
    rows,
  };

  const myx = { margin: "0px 30px" };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Courses
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddCourse refetch={() => getAllCourses(page, size)} />
            </Stack>
          </SoftBox>
          <DataTable
            table={tabledata}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20],
            }}
            canSearch
          />
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}
