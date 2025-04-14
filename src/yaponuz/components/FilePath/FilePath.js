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
import { useEffect, useMemo, useState } from "react";
import { Guest } from "yaponuz/data/api";
import SoftBadge from "components/SoftBadge";
import PreviewGuest from "./Preview";
import ViewFile from "./ViewFile";
import { getDateFilter } from "../utils/main";

import SizableContent from "../utils/SizableContent";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function FilePath() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // fetch data
  const getAllGuest = async (page, size) => {
    try {
      const response = await Guest.getFilePath(page, size);
      setTotalPages(response.object.totalPages);
      setData(response.object.content);
      console.log(response);
    } catch (err) {
      console.log("Error from FilePath: ", err);
    }
  };

  // mounting
  useMemo(() => {
    getAllGuest(page, size);
  }, [page, size]);

  // table elements
  const empty = "null";

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "name", accessor: "name" },
    { Header: "fileType", accessor: "fileType" },
    { Header: "fileCategory", accessor: "fileCategory" },
    { Header: "extension", accessor: "extension" },
    { Header: "action", accessor: "action" },
  ];

  const rows = data.map((user) => ({
    id: <SoftTypography variant="caption">{user.id}</SoftTypography> ?? empty,
    createdAt:
      <SoftTypography variant="caption">{getDateFilter(user.createdAt)}</SoftTypography> ?? empty,
    name: <SizableContent data={user.name} /> ?? empty,
    fileType: <SoftTypography variant="caption">{user.fileType ?? empty}</SoftTypography> ?? empty,
    fileCategory:
      <SoftTypography variant="caption">{user.fileCategory ?? empty}</SoftTypography> ?? empty,
    extension: <SoftTypography variant="caption">{user.extension}</SoftTypography> ?? empty,
    action:
      (
        <SoftBox display="flex" alignItems="center">
          <SoftBox>
            <PreviewGuest item={user} />
          </SoftBox>
          <SoftBox mx={2}>
            <ViewFile id={user.hashId} />
          </SoftBox>
        </SoftBox>
      ) ?? empty,
  }));

  const tabledata = {
    columns,
    rows,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All FilePath
              </SoftTypography>
            </SoftBox>
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
