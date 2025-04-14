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
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";

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
import { Jobs } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddJob from "./components/AddJobs";
import SoftInput from "components/SoftInput";
import Switch from "@mui/material/Switch";
import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function JobsList() {
  // default variables
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [active, setActive] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // search variables
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [salaryFrom, setSalaryFrom] = useState(0);
  const [salaryUpTo, setSalaryUpTo] = useState(10000);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "title", accessor: "jobTitle" },
    { Header: "description", accessor: "description" },
    { Header: "salary from", accessor: "salaryFrom" },
    { Header: "salary up to", accessor: "salaryUpTo" },
    { Header: "address", accessor: "address" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const getJobs = async () => {
    try {
      const response = await Jobs.getAllJobs(page, size, active, title, address);
      console.log(response);
      setTotalPages(response.object.totalPages);
      setJobs(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const rows = jobs.map((job) => ({
    id: job.id,
    jobTitle: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button">
          {job.description}
        </SoftTypography>
      </SoftBox>
    ),
    description: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {job.description}
        </SoftTypography>
      </SoftBox>
    ),
    salaryFrom: `$${job.salaryFrom}`,
    salaryUpTo: `$${job.salaryUpTo}`,
    address: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="body2" fontWeight="medium">
          {job.address}
        </SoftTypography>
      </SoftBox>
    ),
    active: job.deleted ? theTrue : theFalse,
    action: <ActionCell myid={job.id} itemme={job} refetch={getJobs} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getJobs();
  }, [page, size, active, title, address]);

  // style
  const myx = { margin: "0px 30px" };

  // options variable

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
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                Title
              </SoftTypography>
              <SoftInput value={title} onChange={(e) => setTitle(e.target.value)} />
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                Address
              </SoftTypography>
              <SoftInput value={address} onChange={(e) => setAddress(e.target.value)} />
            </SoftBox>
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
                salaryFrom
              </SoftTypography>
              <SoftInput
                type="number"
                value={salaryFrom}
                disabled
                onChange={(e) => setSalaryFrom(e.target.value)}
              />
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                salaryUpTo
              </SoftTypography>
              <SoftInput
                disabled
                type="number"
                value={salaryUpTo}
                onChange={(e) => setSalaryUpTo(e.target.value)}
              />
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Jobs
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddJob refetch={getJobs} />
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
        <SoftBox style={{ margin: "20px auto" }}>
          <SoftPagination size="default">
            <SoftPagination item onClick={() => setPage(page - 1)}>
              <Icon>keyboard_arrow_left</Icon>
            </SoftPagination>
            {[...Array(Math.ceil(totalPages))].map((_, index) => (
              <SoftPagination
                key={index}
                item
                active={index === page}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </SoftPagination>
            ))}
            <SoftPagination item onClick={() => setPage(page + 1)}>
              <Icon>keyboard_arrow_right</Icon>
            </SoftPagination>
          </SoftPagination>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default JobsList;
