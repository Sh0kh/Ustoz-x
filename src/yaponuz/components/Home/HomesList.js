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

// Data
import { useEffect, useState } from "react";
import { Home } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddHome from "./components/AddHome";
import { Icon } from "@mui/material";
import SoftPagination from "components/SoftPagination";
import SoftInput from "components/SoftInput";
import Switch from "@mui/material/Switch";
import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function HomesList() {
  const [homes, setHomes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [address, setAddress] = useState("");
  const [homeAgent, setHomeAgent] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [rentFeeMin, setRentFeeMin] = useState(0);
  const [rentFeeMax, setRentFeeMax] = useState(1000000);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "address", accessor: "address" },
    { Header: "description", accessor: "description" },
    { Header: "RentEndDate", accessor: "rentEndDate" },
    { Header: "rentFee", accessor: "rentFee" },
    { Header: "GoogleMapsLink", accessor: "googleMapsURL" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const getHomes = async () => {
    try {
      const response = await Home.getAllHome(
        page,
        size,
        address,
        homeAgent,
        isActive,
        rentFeeMin,
        rentFeeMax
      );
      console.log(response);
      setTotalPages(response.object.totalPages);
      setHomes(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const rows = homes.map((home) => ({
    id: home.id ?? "null",
    address: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {home.address}
        </SoftTypography>
      </SoftBox>
    ),
    description: (
      <SoftBox style={{ maxWidth: "180px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="body2" fontWeight="medium">
          {home.description ?? "mavjud emas"}
        </SoftTypography>
      </SoftBox>
    ),
    rentEndDate: new Date(home.rentEndDate).toLocaleDateString(),
    rentFee: `$${home.rentFee ?? "null"}`,
    googleMapsURL: (
      <SoftButton
        variant="text"
        target="_blank"
        href={`${home.googleMapsURL ?? "null"}`}
        color="info"
        size="small"
      >
        Google Maps Link
      </SoftButton>
    ),
    active: home.deleted ? theTrue : theFalse,

    action: <ActionCell myid={home.id} item={home} refetch={getHomes} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    const getHomes = async () => {
      try {
        const response = await Home.getAllHome(
          page,
          size,
          address,
          homeAgent,
          isActive,
          rentFeeMin,
          rentFeeMax
        );
        console.log(response);
        setTotalPages(response.object.totalPages);
        setHomes(response.object.content);
      } catch (error) {
        console.error("Error fetching homes:", error);
      }
    };

    getHomes();
  }, [page, size, address, homeAgent, isActive, rentFeeMin, rentFeeMax]);

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
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
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
            </SoftBox>
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
                rentFeeMin
              </SoftTypography>
              <SoftInput
                type="number"
                value={rentFeeMin}
                onChange={(e) => setRentFeeMin(e.target.value)}
              />
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
                rentFeeMax
              </SoftTypography>
              <SoftInput
                type="number"
                value={rentFeeMax}
                onChange={(e) => setRentFeeMax(e.target.value)}
              />
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Homes
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddHome refetch={getHomes} />
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

export default HomesList;
