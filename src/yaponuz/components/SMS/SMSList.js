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
import { SMS, Shops } from "yaponuz/data/api";
// import ActionCell from "./components/ActionCell";

import Refresh from "../sidenavcom/Refresh";
import SendSMS from "../sidenavcom/SendSMS";

export default function SMSList() {
  const [sms, setSMS] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "phoneNumber", accessor: "phoneNumber" },
    { Header: "messageText", accessor: "messageText" },
    // { Header: "action", accessor: "action" },
  ];

  const rows = sms.map((other) => ({
    id: other.id,
    createdAt: new Date(other.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, ""),
    phoneNumber: `${other.phoneNumber}`,
    messageText: (
      <SoftBox style={{ maxWidth: "300px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
          {other.messageText}
        </SoftTypography>
      </SoftBox>
    ),
    // action: <ActionCell myid={other.id} chatid={other.userOne} itemme={other} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    const getSMS = async () => {
      try {
        const response = await SMS.getAllSMS(page, size);
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
                All SMS
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <Refresh />
              <SendSMS />
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
