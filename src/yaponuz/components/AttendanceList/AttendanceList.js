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
import { Lesson } from "yaponuz/data/controllers/lesson";
import { Module } from "yaponuz/data/api";

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

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Module selection states
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // Lesson selection states
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [lessonID, setLessonID] = useState(null);

  const options = [
    { value: "CAME", label: "CAME" },
    { value: "EXCUSED", label: "EXCUSED" },
    { value: "LATE_CAME", label: "LATE_CAME" },
    { value: "NOT_CAME", label: "NOT_CAME" },
  ];

  // fetching data function
  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getMyGroups(page, size);
      const groups = response.object || [];

      const formattedOptions = groups?.map((group) => ({
        label: group.name,
        value: group.id,
        courseId: group.courseId, // добавляем courseId
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
    setLoading(true);
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

  // Load modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      getModules(selectedCourse);
      // Reset dependent selections
      setSelectedModule(null);
      setSelectedLesson(null);
      setModules([]);
      setLessons([]);
    }
  }, [selectedCourse]);

  // Load lessons when module is selected
  useEffect(() => {
    if (selectedModule) {
      getModuleLessons(selectedModule);
      // Reset lesson selection
      setSelectedLesson(null);
      setLessons([]);
    }
  }, [selectedModule]);

  const getModules = async () => {
    try {
      const response = await Module.getModuleById(selectedCourse);
      console.log(selectedCourse);

      // Transform data to match SoftSelect format
      const formattedModules = response.object?.map((module) => ({
        value: module.id,
        label: module.name || module.title,
      })) || [];

      setModules(formattedModules);
    } catch (err) {
      console.error("Error from module list GET: ", err);
      // setError is not defined in your snippet, so I commented it out
      // setError("Failed to fetch modules. Please try again later.");
    }
  };

  const getModuleLessons = async (moduleId) => {
    try {
      const response = await Lesson.getAllLessons(page, size, moduleId.value);

      // Transform data to match SoftSelect format
      const formattedLessons = (response.object?.content || []).map((lesson) => ({
        value: lesson.id,
        label: lesson.name || lesson.title,
      }));

      setLessons(formattedLessons);
      setLessonID(moduleId);
    } catch (err) {
      console.error("Error from lesson list GET:", err);
      // setError is not defined in your snippet, so I commented it out
      // setError("Failed to fetch lessons. Please try again later.");
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
          <SoftBox p={3} style={{ overflow: "visible", width: "100%" }}>
            {/* First row: 2 selects */}
            <SoftBox
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              mb={2}
            >
              <SoftBox flex="1" minWidth="200px">
                <SoftSelect
                  fullWidth
                  options={GroupOptions}
                  onChange={(e) => {
                    setGroupID(e.value);
                    setSelectedCourse(e.courseId);
                  }}
                  placeholder="Select group"
                  sx={{
                    "& .MuiSelect-select": {
                      width: "100%",
                    },
                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                    },
                  }}
                />
              </SoftBox>

              {selectedCourse && (
                <SoftBox flex="1" minWidth="200px">
                  <SoftSelect
                    fullWidth
                    placeholder="Select module"
                    options={modules}
                    value={selectedModule}
                    onChange={(value) => setSelectedModule(value)}
                    isDisabled={!selectedCourse}
                    sx={{
                      "& .MuiSelect-select": {
                        width: "100%",
                      },
                      "& .MuiOutlinedInput-root": {
                        width: "100%",
                      },
                    }}
                  />
                </SoftBox>
              )}
            </SoftBox>

            {/* Second row: 2 selects */}
            <SoftBox
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              mb={2}
            >
              {selectedModule && (
                <SoftBox flex="1" minWidth="200px">
                  <SoftSelect
                    fullWidth
                    placeholder="Select lesson"
                    options={lessons}
                    value={selectedLesson}
                    onChange={(value) => setSelectedLesson(value)}
                    isDisabled={!selectedModule}
                    sx={{
                      "& .MuiSelect-select": {
                        width: "100%",
                      },
                      "& .MuiOutlinedInput-root": {
                        width: "100%",
                      },
                    }}
                  />
                </SoftBox>
              )}

              <SoftBox flex="1" minWidth="200px">
                <SoftSelect
                  fullWidth
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
                  placeholder="Select month"
                  sx={{
                    "& .MuiSelect-select": {
                      width: "100%",
                    },
                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                    },
                  }}
                />
              </SoftBox>
            </SoftBox>

            {/* Third row: button */}
            <SoftBox display="flex" justifyContent="flex-start" minWidth="200px">
              <SoftButton fullWidth onClick={() => getAttendance(user)} sx={{ height: "40px" }}>
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
        <AttendanceTable
          lessonID={selectedLesson?.value}
          refresh={getAttendance}
          data={attendance}
          month={month}
          year={year}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}
