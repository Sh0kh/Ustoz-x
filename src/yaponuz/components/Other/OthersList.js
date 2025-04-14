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
import Switch from "@mui/material/Switch";

// imported
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
// Data
import { useEffect, useState } from "react";
import { Other } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddOther from "./components/AddOther";
import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function OthersList() {
  const [others, setOthers] = useState([]);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const myx = { margin: "0px auto" };

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "title", accessor: "title" },
    { Header: "phone", accessor: "phone" },
    { Header: "description", accessor: "description" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const getAirs = async (page, size, active) => {
    try {
      const response = await Other.getAllOthers(page, size, active);
      console.log(response);
      setOthers(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const refetch = () => {
    getAirs(page, size, active);
  };

  const rows = others.map((other) => ({
    id: other.id,
    title: other.title,
    phone: `${other.phone}`,
    description: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography
          style={{ maxWidth: "200px" }}
          dangerouslySetInnerHTML={{ __html: other.description }}
          variant="button"
          fontWeight="medium"
        >
          {/* {article.context} */}
        </SoftTypography>
      </SoftBox>
    ),
    active: other.deleted ? theTrue : theFalse,
    action: <ActionCell myid={other.id} itemme={other} refetch={refetch} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getAirs(page, size, active);
  }, [page, size, active]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox display="flex" justifyContent="center" alignItems="center" p={3}>
            <SoftBox lineHeight={1} style={{ myx, width: "150px" }}>
              <Switch checked={active} onChange={() => setActive(!active)} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => setActive(!active)}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{active ? "ACTIVE" : "NOT ACTIVE"}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ marginTop: "20px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Other Services
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddOther refetch={refetch} />
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
