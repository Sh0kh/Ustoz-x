import React, { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
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
import { Users } from "yaponuz/data/api";
import SoftBadge from "components/SoftBadge";
import { useNavigate } from "react-router-dom";
import { Group } from "yaponuz/data/controllers/group";
import SoftSelect from "components/SoftSelect";

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

function UsersList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);


  const getAllUsers = async (customPage = null) => {
    setLoading(true);
    // Use provided customPage if available, otherwise use the state value
    const currentPage = customPage !== null ? customPage : page;


    try {
      const response = await Users.getUsers(currentPage, size, firstName, lastName, phoneNumber, groupID?.value);
      if (response && response.object) {
        setTotalPages(response.object.totalPages || 0);
        setUsers(response.object.content || []);
        console.log("API response:", response.object);
      }
    } catch (error) {
      if (error?.request && error?.message.includes("401")) {
        localStorage.clear();
        navigate('/login/web');
        return;
      }
      if (error.toString().includes("Failed to fetch") || error.toString().includes("NetworkError")) {
        localStorage.clear();
        window.location.href = "/login/web";
        return;
      }
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      const groups = response.object || [];

      // Map the fetched data to match the expected format of SoftSelect options
      const formattedOptions = groups.map((group) => ({
        label: group.name,
        value: group.id,
      }));

      setGroupOptions(formattedOptions);
    } catch (err) {
      console.error("Error fetching groups list: ", err);
    }
  };


  useEffect(() => {
    getAllGroups()
  }, [])

  // This useEffect will run whenever these dependencies change
  useEffect(() => {
    getAllUsers();
  }, [page, size, firstName, lastName, phoneNumber, groupID]);

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
        dateBirth: user.dateBirth ? new Date(user.dateBirth).toLocaleDateString() : "N/A",
        action: <ActionCell id={user.id} item={user} refetch={getAllUsers} />,
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // API expects zero-based index
  };

  const handleEntriesPerPageChange = (newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing entries per page
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Students
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <Suspense fallback={<div>Loading...</div>}>
                <AddUser refetch={getAllUsers} />
              </Suspense>
            </Stack>
          </SoftBox>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3} gap="10px" sx={{ flexWrap: 'wrap' }}>
            {/* Обертка с flex-grow и фиксированной шириной */}
            <SoftBox sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "300px" }}>
              <SoftInput
                placeholder="First Name"
                value={firstName}
                fullWidth
                onChange={(e) => setFirstName(e.target.value)}
              />
            </SoftBox>

            <SoftBox sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "300px" }}>
              <SoftInput
                placeholder="Last Name"
                value={lastName}
                fullWidth
                onChange={(e) => setLastName(e.target.value)}
              />
            </SoftBox>

            <SoftBox sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "300px" }}>
              <SoftInput
                placeholder="Phonenumber"
                value={phoneNumber}
                fullWidth
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </SoftBox>

            <SoftBox sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "300px" }}>
              <SoftSelect
                placeholder="Select Group"
                value={groupID}
                onChange={(selectedOption) => setGroupID(selectedOption)}
                options={groupOptions}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    position: "absolute",
                    zIndex: 9999,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                }}
              />
            </SoftBox>
          </SoftBox>
          <Suspense fallback={<div>Loading...</div>}>
            {loading ? (
              <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
                <Loader className="animate-spin ml-2 size-10" />
                <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
              </div>
            ) : mytabledata?.rows.length !== 0 ? (
              <>
                <DataTable
                  table={mytabledata}
                  entriesPerPage={{
                    defaultValue: size,
                    entries: [5, 7, 10, 15, 20],
                    canChange: true,
                    onEntriesChange: handleEntriesPerPageChange
                  }}
                  canSearch
                />

                <SoftBox sx={{ overflowX: "auto", px: 3 }}>
                </SoftBox>
                <SoftBox display="flex" justifyContent="center" mt={3} pb={3}>
                  <SoftPagination
                    page={page + 1}
                    count={totalPages}
                    onChange={handlePageChange}
                    color="info"
                    size="large"
                  />
                </SoftBox>
              </>
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
      </SoftBox >
      <Footer />
    </DashboardLayout >
  );
}

export default UsersList;