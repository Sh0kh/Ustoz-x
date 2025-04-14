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
import { View } from "yaponuz/data/api";
import SoftBadge from "components/SoftBadge";
import Switch from "@mui/material/Switch";
import SoftInput from "components/SoftInput";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function ViewCount() {
  const [views, setViews] = useState([]);

  // the real datas
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [isCount, setIsCount] = useState(true);
  const [isData, setIsData] = useState(false);

  // variables
  const myx = { margin: "0px 30px" };

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "categoryEnum", accessor: "categoryEnum" },
    { Header: "serviceId", accessor: "serviceId" },
    { Header: "viewCount", accessor: "viewCount" },
  ];

  const rows = views.map((view) => ({
    id: view.id,
    createdAt: new Date(view.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, ""),
    categoryEnum: view.categoryEnum,
    serviceId: view.serviceId,
    viewCount: view.viewCount,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  // table for isData true
  const data_col = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "createdBy", accessor: "createdBy" },
    { Header: "categoryEnum", accessor: "categoryEnum" },
    { Header: "serviceId", accessor: "serviceId" },
    { Header: "serviceCreatorId", accessor: "serviceCreatorId" },
    { Header: "phone", accessor: "phone" },
    { Header: "country", accessor: "country" },
    { Header: "location", accessor: "location" },
    { Header: "deviceId", accessor: "deviceId" },
  ];

  const data_row = views.map((view) => ({
    id: view.id ?? "null",
    createdAt:
      new Date(view.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    createdBy: view.createdBy ?? "null",
    categoryEnum: view.categoryEnum ?? "null",
    serviceId: view.serviceId ?? "null",
    serviceCreatorId: view.serviceCreatorId ?? "null",
    phone: view.phone ?? "null",
    country: view.country ?? "null",
    location: view.location ?? "null",
    deviceId: view.deviceId ?? "null",
  }));

  const data_table = {
    columns: data_col,
    rows: data_row,
  };

  // mounting
  useEffect(() => {
    if (isCount) {
      setIsData(false);
      setIsCount(true);
    }
    if (isData) {
      setIsCount(false);
      setIsData(true);
    }
    const getViews = async () => {
      try {
        const response = await View.getAllView(page, size, isCount, isData);
        setTotalPages(response.object.totalPages);
        setViews(response.object.content);
      } catch (err) {
        console.log(err);
      }
    };

    getViews();
  }, [page, size, isCount, isData]);

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
          <SoftBox display="flex" justifyContent="space-around" alignItems="center" p={3}>
            {/* isCount */}
            <SoftBox lineHeight={1} style={{ myx, width: "100px" }}>
              <SoftTypography
                variant="h6"
                style={{ textAlign: "center", marginBottom: "8px" }}
                fontWeight="small"
              >
                isCount
              </SoftTypography>
              <Switch
                checked={isCount}
                onChange={() => {
                  setIsCount(!isCount);
                  setIsData(!isData);
                }}
              />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{isCount ? "TRUE" : "FALSE"}
              </SoftTypography>
            </SoftBox>

            {/* isData */}
            <SoftBox lineHeight={1} style={{ myx, width: "100px" }}>
              <SoftTypography
                variant="h6"
                style={{ textAlign: "center", marginBottom: "8px" }}
                fontWeight="small"
              >
                isData
              </SoftTypography>
              <Switch
                checked={isData}
                onChange={() => {
                  setIsData(!isData);
                  setIsCount(!isCount);
                }}
              />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp; &nbsp;{isData ? "TRUE" : "FALSE"}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Views
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          {isCount ? (
            <DataTable
              table={mytabledata}
              entriesPerPage={{
                defaultValue: 20,
                entries: [5, 7, 10, 15, 20],
              }}
              canSearch
            />
          ) : (
            <DataTable
              table={data_table}
              entriesPerPage={{
                defaultValue: 20,
                entries: [5, 7, 10, 15, 20],
              }}
              canSearch
            />
          )}
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
    </DashboardLayout>
  );
}
