import React, { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { Frown, Loader } from "lucide-react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";
import { SupportCenter } from "yaponuz/data/api";
import SoftBadge from "components/SoftBadge";

// Lazy load components
const DataTable = lazy(() => import("examples/Tables/DataTable"));
const ActionCell = lazy(() => import("./components/ActionCell"));
const AddUser = lazy(() => import("./components/AddUser"));

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function UsersSupportCenter() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await SupportCenter?.getUsers(page, size, firstName, lastName, phoneNumber);
      setTotalPages(response.object.totalPages);
      setUsers(response.object.content);
      console.log(response, "all users");
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [page, size, firstName, lastName, phoneNumber]);

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Phone Number", accessor: "phoneNumber" },
      { Header: "BirthDay", accessor: "dateBirth" },
      { Header: "action", accessor: "action" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      users?.map((user) => ({
        id: user.id ?? "null",
        firstName: (
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate(`/users/profile/${user.id}`)}
          >
            {user.firstName}
          </span>
        ),
        lastName: user.lastName ?? "null",
        phoneNumber: user.phoneNumber ?? "null",
        dateBirth: new Date(user.dateBirth).toLocaleDateString(),
        action: <ActionCell id={user.id} item={user} refetch={() => getAllUsers(page, size)} />,
      })),
    [users]
  );

  const mytabledata = useMemo(
    () => ({
      columns,
      rows,
    }),
    [columns, rows]
  );

  const myx = { margin: "0px 30px" };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>

        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                Support Center
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <Suspense fallback={<div>Loading...</div>}>
                <AddUser refetch={() => getAllUsers(page, size)} />
              </Suspense>
            </Stack>
          </SoftBox>
          <Suspense fallback={<div>Loading...</div>}>
            {loading ? (
              <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
                <Loader className="animate-spin ml-2 size-10" />
                <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
              </div>
            ) : mytabledata?.rows.length !== 0 ? (
              <DataTable
                table={mytabledata}
                entriesPerPage={{
                  defaultValue: 20,
                  entries: [5, 7, 10, 15, 20],
                }}
                canSearch
              />
            ) : (
              <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                <Frown className="size-20" />
                <div className="text-center">
                  <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
                  <p className="text-sm text-gray-700">
                    balki, filtrlarni tozalab ko`rish kerakdir
                  </p>
                </div>
              </div>
            )}
          </Suspense>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UsersSupportCenter;
