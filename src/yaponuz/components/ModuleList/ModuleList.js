// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";

// Data
import { useCallback, useEffect, useState, useRef } from "react";
import ActionCell from "./components/ActionCell";
import SoftBadge from "components/SoftBadge";

import AddModule from "./components/AddModule";
import { Module } from "yaponuz/data/controllers/module";
import { Frown, Loader } from "lucide-react";
import SoftSelect from "components/SoftSelect";
import { Course } from "yaponuz/data/controllers/course";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function ModuleList() {
  // variables
  const [modules, setModules] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);

  // Use refs to track if requests are already made
  const coursesLoadedRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Fetch modules function
  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      // Check if courseId is valid and not empty
      if (courseId && String(courseId).trim() !== '' && String(courseId).trim() !== ' ') {
        response = await Module.getModuleById(courseId);
        setModules(response?.object || []);
        setTotalPages(1); // Single course result
      } else {
        // Otherwise fetch all modules with pagination
        response = await Module.getAllModule(page, size);
        setModules(response?.object || []);
        setTotalPages(response?.object?.totalPages || 0);
      }
    } catch (error) {
      console.log("Error fetching modules:", error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, page, size]);

  // Fetch courses function
  const fetchCourses = useCallback(async () => {
    if (coursesLoadedRef.current) return;

    try {
      const response = await Course.getAllCourses(0, 100);
      const courses = response.object || [];
      const formattedOptions = [
        { label: "All courses", value: null },
        ...courses.map((course) => ({
          label: course.name,
          value: course.id,
        })),
      ];
      setCourseOptions(formattedOptions);
      coursesLoadedRef.current = true;
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCourses();
      await fetchModules();
      isInitialLoadRef.current = false;
    };

    loadInitialData();
  }, [fetchCourses, fetchModules]);

  // Fetch modules when courseId changes (skip initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      fetchModules();
    }
  }, [courseId, fetchModules]);

  // Fetch modules when page or size changes for "All courses" only
  useEffect(() => {
    if (!isInitialLoadRef.current && !courseId) {
      fetchModules();
    }
  }, [page, size, courseId, fetchModules]);

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "discounted Price", accessor: "discountedPrice" },
    { Header: "Lesson Minutes", accessor: "lessonMinutes" },
    { Header: "Video Count", accessor: "videoCount" },
    { Header: "Question Count", accessor: "questionCount" },
    { Header: "Block", accessor: "block" },
    { Header: "Hidden", accessor: "hidden" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "action", accessor: "action" },
  ];

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  }, []);

  const rows = Array.isArray(modules)
    ? modules?.map((module) => ({
      id: module?.id,
      name: module?.name,
      price: module?.price + " uzs",
      discountedPrice: module?.discountedPrice + " uzs",
      lessonMinutes: module?.lessonMinutes + " min",
      videoCount: module?.videoCount,
      block: `${module.block === true ? 'Locked' : 'Open'}`,
      hidden: `${module.hidden === true ? 'Hidden' : 'Open'}`,
      questionCount: module?.questionCount,
      createdAt: module?.createdAt ? formatDate(module.createdAt) : "null",
      action: <ActionCell id={module?.id} item={module} refetch={fetchModules} />,
    }))
    : [];

  const tabledata = {
    columns,
    rows,
  };

  const handleCourseChange = (selectedOption) => {
    setCourseId(selectedOption?.value || null);
    setPage(0); // Reset to first page when filter changes
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3} className={'Module'}>
        <Card style={{ margin: "10px 0px", padding: '28px' }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start">
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Modules
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddModule refetch={fetchModules} />
            </Stack>
          </SoftBox>

          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start">
            <SoftSelect
              className="mt-[10px] w-[400px]"
              placeholder="Select course"
              style={{ flex: 1, minWidth: "350px" }}
              options={courseOptions}
              onChange={handleCourseChange}
              value={courseOptions.find(option => option.value === courseId) || null}
            />
          </SoftBox>

          {loading ? (
            <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
              <Loader className="animate-spin ml-2 size-10" />
              <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
            </div>
          ) : tabledata?.rows.length !== 0 ? (
            <>
              <DataTable
                table={tabledata}
                entriesPerPage={{
                  defaultValue: 20,
                  entries: [5, 10, 15, 20],
                }}
                canSearch
              />
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
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}