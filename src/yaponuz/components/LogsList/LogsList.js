import Card from "@mui/material/Card";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

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
import { Logs } from "yaponuz/data/api";

export default function LogsTrash() {
  const [sms, setSMS] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { Header: "userId", accessor: "userId" },
    { Header: "fullName", accessor: "fullName" },
    { Header: "userName", accessor: "userName" },
    { Header: "ipAddress", accessor: "ipAddress" },
    { Header: "reqMethod", accessor: "reqMethod" },
    { Header: "serverNameMB", accessor: "serverNameMB" },
    { Header: "clientBrowserType", accessor: "clientBrowserType" },
    { Header: "browserTokenType", accessor: "browserTokenType" },
    // { Header: "location", accessor: "location" },
    // { Header: "userAccountType", accessor: "userAccountType" },
    // { Header: "colum0", accessor: "colum0" },

    // { Header: "action", accessor: "action" },
  ];

  const rows = sms.map((other) => ({
    userId: other.userId ?? "null",
    fullName: other.fullName ?? "null",
    userName: other.userName ?? "null",
    ipAddress: other.ipAddress ?? "null",
    reqMethod: other.reqMethod ?? "null",
    serverNameMB: other.serverNameMB ?? "null",
    clientBrowserType: other.clientBrowserType ?? "null",
    browserTokenType: other.browserTokenType ?? "null",
    // location: other.location ?? "null",
    // userAccountType: other.userAccountType ?? "null",
    // colum0: other.colum0 ?? "null",
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    const getSMS = async () => {
      try {
        const response = await Logs.getAllLogs(page, size);
        console.log(response);
        setTotalPages(response.object.totalPages);
        setSMS(response.object.content);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    getSMS();
  }, [page, size]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Logs
              </SoftTypography>
            </SoftBox>
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
