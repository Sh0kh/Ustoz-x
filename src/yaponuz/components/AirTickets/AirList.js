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

// imported
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
// Data
import { useEffect, useState } from "react";
import { Air } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddAir from "./components/AddAir";
import SoftBadge from "components/SoftBadge";
import Switch from "@mui/material/Switch";
import SoftInput from "components/SoftInput";
import useFetch from "yaponuz/hooks/useFetch";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function CategoriesAll() {
  const [airs, setAirs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // search items
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000);

  const myx = { margin: "0px 30px" };

  const getAirs = async () => {
    try {
      const response = await useFetch('category/get/all')
      setTotalPages(response.object.totalPages);
      console.log(response);
      setAirs(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "title", accessor: "title" },
    { Header: "price", accessor: "price" },
    { Header: "context", accessor: "context" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const rows = airs.map((air) => ({
    id: air.id,
    title: air.title,
    price: `$${air.price}`,
    context: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {air.context}
        </SoftTypography>
      </SoftBox>
    ),
    active: air.deleted ? theTrue : theFalse,
    action: <ActionCell myid={air.id} itemme={air} refetch={getAirs} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getAirs();
  }, [page, size, isActive, title, context, priceFrom, priceTo]);

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
                Context
              </SoftTypography>
              <SoftInput value={context} onChange={(e) => setContext(e.target.value)} />
            </SoftBox>
            {/* <SoftBox lineHeight={1} style={{ myx, width: "100px" }}>
              <SoftTypography
                variant="h6"
                style={{ textAlign: "center", marginBottom: "8px" }}
                fontWeight="small"
              >
                isHomeAgent
              </SoftTypography>
              <Switch checked={homeAgent} onChange={() => setHomeAgent(!homeAgent)} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => setHomeAgent(!homeAgent)}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{homeAgent ? "TRUE" : "FALSE"}
              </SoftTypography>
            </SoftBox> */}
            <SoftBox lineHeight={1} style={{ myx, width: "100px" }}>
              <SoftTypography
                variant="h6"
                style={{ textAlign: "center", marginBottom: "8px" }}
                fontWeight="small"
              >
                isActive
              </SoftTypography>
              <Switch checked={isActive} onChange={() => setIsActive(!isActive)} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => setIsActive(!isActive)}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{isActive ? "TRUE" : "FALSE"}
              </SoftTypography>
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                priceFrom
              </SoftTypography>
              <SoftInput
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
              />
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                priceTo
              </SoftTypography>
              <SoftInput
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
              />
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Air Tickets
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddAir refetch={getAirs} />
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

export default CategoriesAll;
