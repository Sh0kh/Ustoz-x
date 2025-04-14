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

import AddGroup from "./components/AddGroup";
import { Group } from "yaponuz/data/controllers/group";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function GroupList() {
  // variables
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // fetching data function
  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      setGroups(response.object);
      setTotalPages(response?.object?.totalPages);
    } catch (err) {
      console.log("Error from groups list GET: ", err);
    }
  };

  // mounting
  useEffect(() => {
    getAllGroups(page, size);
  }, [page, size]);

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "startDate", accessor: "startDate" },
    { Header: "endDate", accessor: "endDate" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "action", accessor: "action" },
  ];
  
  const rows = groups?.map((group) => {
    const createdAt = group.createdAt
      ? new Date(group.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "")
      : "null";
    return {
      id: group.id,
      name: group.name,
      startDate: group.startDate,
      endDate: group.endDate,
      createdAt,
      action: <ActionCell id={group.id} item={group} refetch={() => getAllGroups(page, size)} />,
    };
  });


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
                All Groups
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddGroup refetch={() => getAllGroups(page, size)} />
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
