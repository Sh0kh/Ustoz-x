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
import { Chat } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
// import AddOther from "./components/AddChat";
import SoftBadge from "components/SoftBadge";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1)
  const [size, SetSize] = useState(10)

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdBy", accessor: "createdBy" },
    { Header: "UserOne", accessor: "userOne" },
    { Header: "UserTwo", accessor: "userTwo" },

    { Header: "action", accessor: "action" },
  ];

  const getAirs = async () => {
    try {
      const response = await Chat.getAllChatAdmin(page, size);
      console.log(response);
      setChats(response.object);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const rows = Array.isArray(chats) && chats.length > 0
    ? chats.map((other) => ({
        id: other.id,
        createdBy: other.createdBy,
        userOne: `${other.userOne}`,
        userTwo: `${other.userTwo}`,
        action: (
          <ActionCell myid={other.id} chatid={other.userOne} itemme={other} refetch={getAirs} />
        ),
      }))
    : [];


  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getAirs();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Chats
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              {/* <AddOther /> */}
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
        {/* <SoftBox style={{ margin: "20px 0px" }}>
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
        </SoftBox> */}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}
