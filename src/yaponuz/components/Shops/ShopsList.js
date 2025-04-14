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
import SoftInput from "components/SoftInput";

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

import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

// Data
import { useEffect, useState } from "react";
import { Shops } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddShop from "./components/AddShop";
import { Icon } from "@mui/material";
import SoftPagination from "components/SoftPagination";

function ShopsList() {
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [shopType, setShopType] = useState("FOODS");
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "title", accessor: "title" },
    { Header: "address", accessor: "address" },
    { Header: "description", accessor: "description" },
    { Header: "Google Maps Link", accessor: "addressGoogleLink" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const getData = async () => {
    const getShops = async () => {
      try {
        const response = await Shops.getShops(page, size, shopType);
        console.log(response);
        setTotalPages(response.object.totalPages);
        setShops(response.object.content.reverse());
      } catch (error) {
        console.error("Error fetching homes:", error);
      }
    };

    const getAllShop = async () => {
      try {
        const response = await Shops.getAllShops(page, size, shopType, active, title);
        console.log(response);
        setTotalPages(response.object.totalPages);
        setShops(response.object.content);
      } catch (err) {
        console.log(err);
      }
    };

    if (title) {
      getAllShop();
      console.log("get all shops");
    } else {
      getShops();
    }
  };

  const rows = shops.map((shop) => ({
    id: shop.id,
    title: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {shop.title}
        </SoftTypography>
      </SoftBox>
    ),
    address: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {shop.address}
        </SoftTypography>
      </SoftBox>
    ),
    description: (
      <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {shop.description}
        </SoftTypography>
      </SoftBox>
    ),
    addressGoogleLink: (
      <SoftButton
        variant="text"
        target="_blank"
        href={`${shop.addressGoogleLink}`}
        color="info"
        size="small"
      >
        Google Maps Link
      </SoftButton>
    ),
    active: shop.deleted ? theTrue : theFalse,
    action: <ActionCell myid={shop.id} item={shop} refetch={getData} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getData();
  }, [page, size, shopType, active, title]);

  const myx = { margin: "0px auto" };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          {/* <SoftTypography
            variant="h4"
            style={{ textAlign: "center", marginTop: "10px" }}
            fontWeight="small"
          >
            Search
          </SoftTypography> */}
          <SoftBox display="flex" justifyContent="center" alignItems="center" p={3}>
            <SoftBox lineHeight={1} style={{ myx, width: "130px" }}>
              <Switch
                checked={shopType === "FOODS"}
                onChange={() =>
                  setShopType((prevShopType) => (prevShopType === "FOODS" ? "NO_FOODS" : "FOODS"))
                }
              />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() =>
                  setShopType((prevShopType) => (prevShopType === "FOODS" ? "NO_FOODS" : "FOODS"))
                }
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; {shopType === "FOODS" ? "FOODS" : "NO_FOODS"}
              </SoftTypography>
            </SoftBox>
            <SoftBox lineHeight={1} style={myx}>
              <SoftInput
                placeholder="Search with Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </SoftBox>
            {title === "" ? (
              <SoftBox lineHeight={1} style={{ myx, width: "150px" }}>
                <Switch disabled checked={active} onChange={() => setActive(!active)} />
                <SoftTypography
                  variant="button"
                  disabled
                  fontWeight="regular"
                  onClick={() => setActive(!active)}
                  style={{ opacity: "0.5" }}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp; &nbsp;{active ? "ACTIVE" : "NOT ACTIVE"}
                </SoftTypography>
              </SoftBox>
            ) : (
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
            )}
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Shops
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddShop refetch={getData} />
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

export default ShopsList;
