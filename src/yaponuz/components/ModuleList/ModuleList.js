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

import AddModule from "./components/AddModule";
import { Module } from "yaponuz/data/controllers/module";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function ModuleList() {
  // variables
  const [modules, setModules] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // fetching data function
  const getAllModules = async (page, size) => {
    try {
      const response = await Module.getAllModule(page, size);
      setModules(response.object);
      setTotalPages(response.object.totalPages);
    } catch (err) {
      console.log("Error from groups list GET: ", err);
    }
  };

  // mounting
  useEffect(() => {
    getAllModules(page, size);
  }, [page, size]);

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "discounted Price", accessor: "discountedPrice" },
    { Header: "Lesson Minutes", accessor: "lessonMinutes" },
    { Header: "Video Count", accessor: "videoCount" },
    { Header: "Question Count", accessor: "questionCount" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "action", accessor: "action" },
  ];


  const rows = Array.isArray(modules?.content)
    ? modules?.content?.map((module) => ({
      id: module?.id,
      name: module?.name,
      price: module?.price + " uzs",
      discountedPrice: module?.discountedPrice + " uzs",
      lessonMinutes: module?.lessonMinutes + " min",
      videoCount: module?.videoCount,
      questionCount: module?.questionCount,
      createdAt:
        new Date(module?.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
      action: <ActionCell id={module?.id} item={module} refetch={() => getAllModules(page, size)} />,
    }))
    : []; // Возвращает пустой массив, если `modules` не массив

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
                All Modules
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddModule refetch={() => getAllModules(page, size)} />
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