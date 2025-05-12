import React, { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftSelect from "components/SoftSelect";
import { Course } from "yaponuz/data/controllers/course";
import { Module } from "yaponuz/data/api";
import { Lesson } from "yaponuz/data/controllers/lesson";
import { Quiz } from "yaponuz/data/api";
import { Frown, Loader } from "lucide-react";
import AddModule from "./components/AddModule";
import UpdateModule from "./components/UpdateModule";
import DeleteModule from "./components/DeleteModule";
import { NavLink } from "react-router-dom";


export default function QuizeList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [courses, setCourses] = useState([]);
  const [module, setModule] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [quizModule, setQuizModule] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const [lessonID, setLessonID] = useState(null)
  const [EditModal, setEditModal] = useState(false)
  const [ModuleData, setModuleData] = useState(null)
  const [DeleteModal, setDeleteModal] = useState(false)

  const getAllCourses = async (page, size) => {
    try {
      const response = await Course.getAllCourses(page, size);
      setCourses(response.object);
    } catch (err) {
      console.error("Error from courses list GET: ", err);
      setError("Failed to fetch courses. Please try again later.");
    }
  };

  const getModule = async (courseId) => {
    try {
      const response = await Module.getModuleById(courseId);
      setModule(response.object);
    } catch (err) {
      console.error("Error from module list GET: ", err);
      setError("Failed to fetch modules. Please try again later.");
    }
  };

  const getModuleLesson = async (moduleId) => {
    try {
      const response = await Lesson.getAllLessons(page, size, moduleId);
      setLesson(response.object?.content || []);
    } catch (err) {
      console.error("Error from lesson list GET:", err);
      setError("Failed to fetch lessons. Please try again later.");
    }
  };

  const getQuizModule = async (lessonID) => {
    setLoading(true)
    try {
      const response = await Quiz.getAllModuleByLessonId(lessonID);
      setQuizModule(response.object);
      setLessonID(lessonID)

    } catch (err) {
      console.error("Error from quiz list GET:", err);
      setError("Failed to fetch quizzes. Please try again later.");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getAllCourses(page, size);
  }, [page, size]);

  console.log(quizModule)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {error && (
        <SoftBox my={3}>
          <SoftTypography variant="subtitle2" color="error">
            {error}
          </SoftTypography>
        </SoftBox>
      )}
      <SoftBox
        my={3}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-[30px]"
      >
        <SoftSelect
          className="w-full"
          placeholder="Select Course"
          onChange={(selectedOption) => {
            getModule(selectedOption.value);
          }}
          options={courses.map((course) => ({
            value: course.id,
            label: course.name,
          }))}
        />
        <SoftSelect
          className="w-full"
          placeholder="Select Module"
          onChange={(selectedOption) => {
            getModuleLesson(selectedOption.value);
          }}
          options={module.map((module) => ({
            value: module.id,
            label: module.name,
          }))}
        />
        <SoftSelect
          className="w-full"
          placeholder="Select Lesson"
          onChange={(selectedOption) => {
            getQuizModule(selectedOption.value);
          }}
          options={lesson.map((lesson) => ({
            value: lesson.id,
            label: lesson.name,
          }))}
        />
      </SoftBox>
      <SoftBox my={3}>
        {loading ? (
          <div className="flex items-center pb-[50px] h-[500px] gap-y-4 justify-center flex-col">
            <Loader className="animate-spin ml-2 size-10" />
            <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
          </div>
        ) : (
          <Card>
            <SoftBox display="flex" justifyContent="space-between" p={3}>
              <SoftTypography variant="h6">All Quizzes Modules</SoftTypography>
              {lesson && lesson.length > 0 && (
                <AddModule refresh={() => getQuizModule(lessonID)}
                  lessonID={lessonID} />
              )}
            </SoftBox>

            <div className="overflow-x-auto">
              {quizModule && quizModule?.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="py-3 px-6 text-sm font-semibold text-left">ID</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Quiz Name</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Created At</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizModule.map((quiz) => (
                      <tr key={quiz.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-6 text-sm">{quiz.id}</td>
                        <td className="py-3 px-6 text-sm">
                          <NavLink
                            to={`/quizes/${quiz?.id}`}
                            className=" hover:text-blue-500"
                          >
                            <span className="underline">
                              {quiz.name}
                            </span>
                          </NavLink>
                        </td>
                        <td className="py-3 px-6 text-sm">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-sm">
                          <button
                            onClick={() => { setEditModal(true); setModuleData(quiz) }}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium text-[25px]"
                          >
                            <svg className="text-[25px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1q-.15.15-.15.36M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>
                          </button>
                          <button
                            onClick={() => { setDeleteModal(true); setModuleData(quiz) }}
                            className="ml-4 text-red-500 hover:text-red-700 text-xs font-medium text-[25px]"
                          >
                            <svg className="text-[25px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            </div>
          </Card >
        )
        }
      </SoftBox >
      <Footer />

      <DeleteModule refetch={() => getQuizModule(lessonID)} data={ModuleData} isOpen={DeleteModal} onClose={() => setDeleteModal(false)} />
      <UpdateModule refresh={() => getQuizModule(lessonID)} data={ModuleData} isOpen={EditModal} onClose={() => setEditModal(false)} />
    </DashboardLayout >
  );
}
