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
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "FullName", accessor: "fullName" },
    { Header: "phoneNumber", accessor: "phoneNumber" },
    { Header: "dateOfBirth", accessor: "dateOfBirth" },
    { Header: "genderType", accessor: "genderType" },
    { Header: "email", accessor: "email" },
    { Header: "accountType", accessor: "accountType" },

    // { Header: "action", accessor: "action" },
  ];

  const rows = sms.map((other) => ({
    id: other.id,
    createdAt:
      new Date(other.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    fullName: other.firstName + " " + other.lastName,
    phoneNumber: `${other.phoneNumber}`,
    dateOfBirth:
      new Date(other.dateOfBirth).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    genderType: other.genderType ?? "null",

    email: other.email ?? "null",
    accountType: other.accountType,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    const getSMS = async () => {
      try {
        const response = await Logs.getAllTrashLogs(page, size);
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
                All Logs Trash
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
