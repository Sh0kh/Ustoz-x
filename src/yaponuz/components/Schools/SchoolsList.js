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

// react-router-dom components
import { Link } from "react-router-dom";
import SoftInput from "components/SoftInput";
import Switch from "@mui/material/Switch";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import { useEffect, useState } from "react";
import { Schools } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddSchool from "./components/AddSchool";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(30);
  const [active, setActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "school name", accessor: "agencyName" },
    { Header: "description", accessor: "agencyDescription" },
    { Header: "Work Start Date", accessor: "workStartDate" },
    { Header: "Responsible Person", accessor: "responsiblePerson" },
    { Header: "Document Prepared", accessor: "documentPrepared" },
    { Header: "Document Prepared", accessor: "documentPreparedSuccessVisa" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const getSchools = async () => {
    try {
      const response = await Schools.getSchools(page, size, active, searchText);
      console.log(response);
      setTotalPages(response.object.totalPages);
      setSchools(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const rows = schools.map((school) => ({
    id: school.id,
    agencyName: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {school.agencyName}
        </SoftTypography>
      </SoftBox>
    ),
    agencyDescription: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {school.agencyDescription}
        </SoftTypography>
      </SoftBox>
    ),
    workStartDate: new Date(school.workStartDate).toLocaleDateString(),
    responsiblePerson: (
      <SoftBox style={{ maxWidth: "100px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {school.responsiblePerson}
        </SoftTypography>
      </SoftBox>
    ),
    documentPrepared: (
      <SoftBox style={{ maxWidth: "80px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {school.documentPrepared}
        </SoftTypography>
      </SoftBox>
    ),
    documentPreparedSuccessVisa: school.documentPreparedSuccessVisa,
    active: school.deleted ? theTrue : theFalse,

    action: <ActionCell myid={school.id} itemme={school} refetch={getSchools} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    const getSchools = async () => {
      try {
        const response = await Schools.getSchools(page, size, active, searchText);
        console.log(response);
        setTotalPages(response.object.totalPages);
        setSchools(response.object.content);
      } catch (error) {
        console.error("Error fetching homes:", error);
      }
    };

    getSchools();
  }, [page, size, active, searchText]);

  const myx = { margin: "0px 30px" };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftTypography
            variant="h4"
            style={{ textAlign: "center", marginTop: "10px" }}
            fontWeight="small"
          >
            Search
          </SoftTypography>
          <SoftBox display="flex" justifyContent="center" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1} style={{ myx, width: "100px" }}>
              <SoftTypography
                variant="h6"
                style={{ textAlign: "center", marginBottom: "8px" }}
                fontWeight="small"
              >
                isActive
              </SoftTypography>
              <Switch checked={active} onChange={() => setActive(!active)} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => setActive(!active)}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{active ? "TRUE" : "FALSE"}
              </SoftTypography>
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                searchText
              </SoftTypography>
              <SoftInput
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Schools
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddSchool refetch={getSchools} />
            </Stack>
          </SoftBox>
          <DataTable
            table={mytabledata}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20],
            }}
            canSearch
          />
        </Card>
        <SoftBox style={{ margin: "20px 0px" }}>
          <SoftPagination size="default">
            <SoftPagination item onClick={() => setPage(page - 1)} disabled={page === 0}>
              <Icon>keyboard_arrow_left</Icon>
            </SoftPagination>
            {[...Array(totalPages)].map((_, index) => (
              <SoftPagination
                key={index}
                item
                active={index === page}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </SoftPagination>
            ))}
            <SoftPagination
              item
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              <Icon>keyboard_arrow_right</Icon>
            </SoftPagination>
          </SoftPagination>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SchoolsList;
