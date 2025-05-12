import { useEffect, useState } from "react";
// import { Notification as NotificationApi } from "yaponuz/controllers";
import { Notification as NotificationApi } from "yaponuz/data/controllers/notification";
import ActionCell from "./components/ActionCell";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";
import AddNotification from "./components/AddNotifications";
import Icon from "@mui/material/Icon";
import SoftPagination from "components/SoftPagination";

export default function Notification() {
  // state variables
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [studentId, setStudentId] = useState(20);
  const [loading, setLoading] = useState(false);

  // fetching data function
  const getAllNotification = async (page, size, studentId) => {
    setLoading(true);
    try {
      const response = await NotificationApi.getAllNotification(page, size, studentId);
      setNotifications(response);
      setTotalPages(response.object.totalPages);
      console.log("hello")
    } catch (err) {
      console.log("Error from versions list GET: ", err);
    } finally {
      setLoading(false);
    }
  };

  // mounting the component
  // useEffect(() => {
  //   getAllNotification(page, size, studentId);
  // }, [page, size]);

  // table columns
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "studentId", accessor: "studentId" },
    { Header: "action", accessor: "action" },
  ];

  // map data into rows for table
  const rows = notifications.map((notification) => ({
    id: notification.id,
    createdAt:
      new Date(notification.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ??
      "null",
    studentId: notification.studentId,
    action: (
      <ActionCell
        id={notification.id}
        item={notification}
        refetch={() => getAllNotification(page, size, studentId)}
      />
    ),
  }));

  console.log(notifications)

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
                All Notifications
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddNotification />
            </Stack>
          </SoftBox>
          <SoftBox p={3} display="flex" gap="10px" width="300px">
            <SoftInput
              type="number"
              placeholder="Student id"
              icon={false}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <SoftButton
              onClick={() => getAllNotification(page, size, studentId)}
              variant="contained"
              color="info"
            >
              Search
            </SoftButton>
          </SoftBox>
          {loading ? (
            <div
              style={{ width: "100%", display: "flex", justifyContent: "center", height: "50vh" }}
            >
              <div>Loading data...</div>
            </div>
          ) : notifications.length > 0 ? (
            <DataTable
              table={tabledata}
              entriesPerPage={{
                defaultValue: 20,
                entries: [5, 7, 10, 15, 20],
              }}
            />
          ) : (
            <div
              style={{ width: "100%", display: "flex", justifyContent: "center", height: "50vh" }}
            >
              <div>Data empty</div>
            </div>
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

      <Footer />
    </DashboardLayout>
  );
}
