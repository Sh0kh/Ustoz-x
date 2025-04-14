// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Frown, Loader } from "lucide-react";


// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";

import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import Swal from "sweetalert2";

// Data
import { useEffect, useState } from "react";

import { Attendance } from "yaponuz/data/controllers/attendance";
import SoftDatePicker from "yaponuz/components/SoftDatePicker";
import { actions } from "react-table";
import { Group } from "yaponuz/data/controllers/group";
import { Users } from "yaponuz/data/api";
import AttendanceTable from "./components/AttendanceTable";

export default function AttendanceList() {
  const [studentList, setStudentList] = useState([]);
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("01");
  const [attendance, setAttendance] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [GroupOptions, setGroupOptions] = useState([]);
  const [selectedGroupValue, setSelectedGroupValue] = useState("");
  const [user, setUsers] = useState([]);
  const [groupID, setGroupID] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = [
    { value: "CAME", label: "CAME" },
    { value: "EXCUSED", label: "EXCUSED" },
    { value: "LATE_CAME", label: "LATE_CAME" },
    { value: "NOT_CAME", label: "NOT_CAME" },
  ];

  // fetching data function
  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      const groups = response.object || [];

      const formattedOptions = groups?.map((group) => ({
        label: group.name,
        value: group.id,
      }));

      setGroupOptions(formattedOptions);
    } catch (err) {
      console.error("Error from groups list GET: ", err);
    }
  };

  const getAllUsers = async (page, size) => {
    try {
      const response = await Users.getUsersAttendance(page, size, "", "", "", groupID);
      setUsers(response.object.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAttendance = async () => {
    setLoading(true)
    try {
      const studentIds = user.map((user) => user.id);
      const date = `${year}-${month}`;

      const response = await Attendance.getAllAttendance(studentIds, date);

      // Логируем полный ответ для проверки структуры
      console.log(response, "Attendance response");

      // Безопасный доступ к данным
      const attendanceData = response?.object || [];

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers(page, size);
    getAllGroups(page, size);
  }, [page, size, groupID]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px", overflow: "visible" }}>
          <SoftBox
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            p={3}
            style={{ overflow: "visible", width: "100%" }}
          >
            <SoftBox display="flex" gap="10px" width="100%">
              <SoftSelect
                style={{ flex: 1, minWidth: "150px" }}
                options={GroupOptions}
                onChange={(e) => setGroupID(e.value)}
              />
              <SoftInput
                style={{ flex: 1, minWidth: "150px" }}
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <SoftSelect
                style={{ flex: 1, minWidth: "150px" }}
                options={[
                  { label: "January", value: "01" },
                  { label: "February", value: "02" },
                  { label: "March", value: "03" },
                  { label: "April", value: "04" },
                  { label: "May", value: "05" },
                  { label: "June", value: "06" },
                  { label: "July", value: "07" },
                  { label: "August", value: "08" },
                  { label: "September", value: "09" },
                  { label: "October", value: "10" },
                  { label: "November", value: "11" },
                  { label: "December", value: "12" },
                ]}
                onChange={(e) => setMonth(e.value)}
              />
              <SoftButton
                style={{ flex: 1, minWidth: "150px" }}
                onClick={() => getAttendance(user)}
              >
                Search
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>

      {loading ? (
        <div className="flex items-center h-[300px] pb-[50px] gap-y-4 justify-center flex-col">
          <Loader className="animate-spin ml-2 size-10" />
          <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="flex items-center h-[300px] pb-[50px] gap-y-4 justify-center flex-col">
          <Frown className="size-10 text-gray-500" />
          <p className="text-sm font-medium text-gray-500">No attendance data available</p>
        </div>
      ) : (
        <AttendanceTable refresh={getAttendance} data={attendance} month={month} year={year} />
      )}

      <Footer />
    </DashboardLayout>
  );
}

