import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Stack from "@mui/material/Stack";
import AddBlogger from "./components/AddBlogger";
import SoftBadge from "components/SoftBadge";
import PreviewBlogger from "./components/Preview";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import { Profiler, useEffect, useState, useMemo, useCallback } from "react";
import { Bloggers } from "yaponuz/data/api";
import SoftButton from "components/SoftButton";
import UpdateBlogger from "./components/UpdateBlogger";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function BloggersList() {
  // main data
  const [data, setData] = useState([]);

  // fetch Data
  const getData = useCallback(async () => {
    try {
      const response = await Bloggers.getAllBloggers();
      setData(response.object);
    } catch (err) {
      console.log("Error FROM BLOGGER: ", err);
    }
  }, []);

  // mounting
  useEffect(() => {
    getData();
  }, []);

  // memoized table columns
  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "createdAt", accessor: "createdAt" },
      { Header: "blogger Id", accessor: "bloggerAccountId" },
      { Header: "fullName", accessor: "fullName" },
      { Header: "bloggingType", accessor: "bloggingType" },
      { Header: "myInfo", accessor: "myInfo" },
      { Header: "Active", accessor: "active" },
      { Header: "Action", accessor: "action" },
    ],
    []
  );

  // memoized table rows
  const rows = useMemo(
    () =>
      data.map((item) => ({
        id: item.id,
        createdAt: (
          <SoftTypography variant="caption">
            {new Date(item.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null"}
          </SoftTypography>
        ),
        bloggerAccountId: item.bloggerAccountId,
        fullName: item.fullName,
        bloggingType: item.bloggingType,
        myInfo: (
          <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
            <SoftTypography style={{ maxWidth: "200px" }} variant="body2" fontWeight="medium">
              {item.myInfo}
            </SoftTypography>
          </SoftBox>
        ),
        active: item.deleted ? theTrue : theFalse,
        action: (
          <SoftBox display="flex" alignItems="center">
            <SoftBox>
              <PreviewBlogger user={item} key={item.id} />
            </SoftBox>
            <SoftBox mx={2}>
              <UpdateBlogger item={item} key={item.id} refetch={getData} />
            </SoftBox>
          </SoftBox>
        ),
      })),
    [data, getData]
  );

  const tabledata = useMemo(() => ({ columns, rows }), [columns, rows]);

  // return jsx
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        {/* Main Table */}
        <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
          <SoftBox lineHeight={1}>
            <SoftTypography variant="h5" fontWeight="medium">
              All Bloggers
            </SoftTypography>
          </SoftBox>
          <Stack spacing={1} direction="row">
            <AddBlogger refetch={getData} />
          </Stack>
        </SoftBox>
        <DataTable
          table={tabledata}
          entriesPerPage={{
            defaultValue: 100,
            entries: [5, 7, 10, 15, 20, 100],
          }}
          canSearch
        />
      </SoftBox>
    </DashboardLayout>
  );
}
