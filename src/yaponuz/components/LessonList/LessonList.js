import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Frown, Loader } from "lucide-react";
import { debounce } from "lodash";

import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import useDataTableData from "./data/dataTableData";
import { Course } from "yaponuz/data/controllers/course";
import { Module } from "yaponuz/data/api";

function LessonList() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(0);
  const [courseModules, setCourseModules] = useState([]);
  const [localName, setLocalName] = useState("");

  const {
    dataTableData,
    loading,
    totalPages,
    page,
    setPage,
    size,
    setSize,
    moduleId,
    setModuleId,
    name,
    setName,
    clearFilters,
  } = useDataTableData();

  const navigate = useNavigate();

  const navigateNewLesson = () => {
    navigate("/lessons/new");
  };

  const fetchCourses = useCallback(async () => {
    try {
      const response = await Course.getAllCourses(1, 30);
      setCourses(response.object);
    } catch (err) {
      console.error("Error fetching courses: ", err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const fetchModules = useCallback(async (courseId) => {
    if (courseId) {
      try {
        const response = await Module.getModuleById(courseId);
        setCourseModules(response.object);
      } catch (err) {
        console.error("Error fetching modules: ", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId, fetchModules]);

  const handleCourseChange = useCallback(
    (selectedOption) => {
      setCourseId(selectedOption.value);
      setModuleId(0);
    },
    [setModuleId]
  );

  const handleModuleChange = useCallback(
    (selectedOption) => {
      setModuleId(selectedOption.value);
    },
    [setModuleId]
  );

  const debouncedSetName = useCallback(
    debounce((value) => setName(value), 300),
    [setName]
  );

  const handleNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLocalName(value);
      debouncedSetName(value);
    },
    [debouncedSetName]
  );

  const clearFiltersMe = () => {
    clearFilters();
    setLocalName("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <div className="mb-2 flex justify-between items-center">
          <div className="flex justify-center items-center">
            <div className="flex gap-x-4">
              <div className="min-w-72">
                <SoftSelect
                  placeholder="Kursni tanlang"
                  options={courses?.map((course) => ({
                    value: course.id,
                    label: `${course.name} (${course.teacherName})`,
                  }))}
                  onChange={handleCourseChange}
                  size="large"
                />
              </div>
              <div className="min-w-72">
                <SoftSelect
                  placeholder="Modulni tanlang"
                  options={courseModules.map((module) => ({
                    value: module.id,
                    label: `${module.name} (${module.teacherName})`,
                  }))}
                  onChange={handleModuleChange}
                  isDisabled={!courseId}
                  size="large"
                />
              </div>
              <div>
                <SoftInput
                  placeholder="Lesson nomini kiriting"
                  className="min-w-64"
                  size="large"
                  value={localName}
                  onChange={handleNameChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <SoftButton variant="gradient" color="dark" onClick={navigateNewLesson}>
              Yangi lesson
            </SoftButton>
          </div>
        </div>
        <Card>
          <div className="min-h-96 w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center gap-y-4 justify-center flex-col">
                <Loader className="animate-spin ml-2 size-10" />
                <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
              </div>
            ) : dataTableData?.rows.length !== 0 ? (
              <DataTable
                table={dataTableData}
                entriesPerPage={{ defaultValue: 50, entries: [20, 30, 40, 50] }}
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
                <SoftButton variant="outlined" color="dark" onClick={clearFiltersMe}>
                  Filtrlarni tozalash
                </SoftButton>
              </div>
            )}
          </div>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default LessonList;
