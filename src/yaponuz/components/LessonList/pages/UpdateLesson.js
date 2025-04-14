import { useEffect, useMemo, useState } from "react";
import { Grid, Card } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CircleArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";
import ReactQuill from "react-quill";

import { Module } from "yaponuz/data/controllers/module";
import { Course } from "yaponuz/data/controllers/course";
import { Lesson } from "yaponuz/data/controllers/lesson";
import Swal from "sweetalert2";

function UpdateLesson() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(0);
  const [courseModules, setCourseModules] = useState([]);

  useMemo(() => {
    // fetching data function
    const getAllCourses = async (page, size) => {
      try {
        const response = await Course.getAllCourses(page, size);
        setCourses(response.object);
      } catch (err) {
        console.log("Error from courses list GET: ", err);
      }
    };

    getAllCourses(1, 30);
  }, []);

  useMemo(() => {
    const getModuleById = async (courseId) => {
      try {
        const response = await Module.getModuleById(courseId);
        setCourseModules(response.object);
      } catch (err) {
        console.log("Error from get module by course id GET: ", err);
      }
    };

    getModuleById(courseId);
  }, [courseId]);

  const navigate = useNavigate();

  const navigateLesson = () => {
    navigate("/lessons");
  };

  const [lessonData, setLessonData] = useState({
    about: "",
    creatorId: localStorage.getItem("userId") || 0,
    googleDrive: "",
    isGoogleDrive: false,
    isJeLearning: false,
    isVimeoLink: false,
    isYouTubeLink: false,
    jeLearning: "",
    lessonMinute: 0,
    moduleId: 0,
    name: "",
    sort: 0,
    vimeoLink: "",
    youTubeLink: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "videoProvider") {
      setLessonData((prev) => ({
        ...prev,
        isGoogleDrive: value === "googleDrive",
        isJeLearning: value === "jeLearning",
        isVimeoLink: value === "vimeoLink",
        isYouTubeLink: value === "youTubeLink",
        googleDrive: value === "googleDrive" ? prev.googleDrive : "",
        jeLearning: value === "jeLearning" ? prev.jeLearning : "",
        vimeoLink: value === "vimeoLink" ? prev.vimeoLink : "",
        youTubeLink: value === "youTubeLink" ? prev.youTubeLink : "",
      }));
    } else {
      setLessonData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => navigateLesson());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() =>
        navigateLesson()
      );
    }
  };

  const handleSave = async () => {
    // const dataToSave = { ...lessonData };
    // const videoProvider = lessonData.isVimeoLink
    //   ? "vimeoLink"
    //   : lessonData.isYouTubeLink
    //   ? "youTubeLink"
    //   : lessonData.isJeLearning
    //   ? "jeLearning"
    //   : lessonData.isGoogleDrive
    //   ? "googleDrive"
    //   : null;

    // if (videoProvider) {
    //   dataToSave.videoLink = dataToSave[videoProvider];
    // }

    // // Remove unnecessary fields
    // ["vimeoLink", "youTubeLink", "jeLearning", "googleDrive"].forEach((field) => {
    //   if (field !== videoProvider) {
    //     delete dataToSave[field];
    //   }
    // });

    // console.log(dataToSave);

    try {
      const response = await Lesson.createLesson(lessonData);
      showAlert(response);
    } catch (err) {
      console.log("Error from new lesson create: ", err);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      // Handle URLs like https://vimeo.com/1033449239/a6e81e21ef
      const parts = url.split("/");
      const videoId = parts[parts.length - 2];
      const hash = parts[parts.length - 1];

      if (videoId && hash) {
        return `https://player.vimeo.com/video/${videoId}?h=${hash}`;
      }

      // Handle other Vimeo URL formats
      const regExp =
        /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
      const match = url.match(regExp);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    // Google Drive
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[0]}/preview`;
      }
    }

    // For JLearning, assume the URL is already in the correct format
    return url;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3} className="space-y-4">
        <Card className="h-24 w-full ">
          <div className="flex h-full w-full px-8 items-center justify-between">
            <div>
              <SoftButton variant="gradient" color="error" onClick={navigateLesson}>
                <CircleArrowLeft className="mr-2" />
                Orqaga
              </SoftButton>
            </div>
            <div>
              <SoftTypography variant="subtitle1" textTransform="uppercase" fontWeight="bold">
                &#9733;&#9733;&#9733; Yangi Lesson Qo`shish &#9733;&#9733;&#9733;
              </SoftTypography>
            </div>
            <div>
              <SoftButton variant="gradient" color="dark" onClick={handleSave}>
                Saqlash
                <Save className="ml-2" />
              </SoftButton>
            </div>
          </div>
        </Card>
        <Card className="h-[35rem] w-full">
          <div className="flex h-full w-full gap-x-8 p-8  items-center justify-between ">
            <div className="w-[50%] h-full  rounded-xl">
              <div className="uppercase bg-[#344767]  text-white font-semibold text-center border-2 rounded-md">
                Kurs tanlash
              </div>
              <div className="">
                <SoftTypography variant="caption">
                  Qaysi kursga lesson qo`shmoqchisiz? Kursni tanlang
                </SoftTypography>
                <SoftSelect
                  placeholder="Kursni tanlang"
                  options={courses.map((course) => ({
                    value: course.id,
                    label: `${course.name} (${course.teacherName})`,
                  }))}
                  onChange={(e) => setCourseId(e.value)}
                />
                <SoftTypography variant="caption">
                  Qaysi modulga lesson qo`shmoqchisiz? Modulni tanlang
                </SoftTypography>
                <SoftSelect
                  placeholder="Modulni tanlang"
                  options={courseModules.map((course) => ({
                    value: course.id,
                    label: `${course.name} (${course.teacherName})`,
                  }))}
                  onChange={(selectedOption) =>
                    handleSelectChange("moduleId", selectedOption.value)
                  }
                />
              </div>
              <div className="border-2 bg-red-500 rounded-xl mt-5 mb-2"></div>

              <div className="mt-5">
                <div className="uppercase bg-[#344767]  text-white font-semibold text-center border-2 rounded-md">
                  Lesson ma`lumotlari
                </div>
              </div>
              <div className="">
                <div>
                  <SoftTypography variant="caption">
                    Lesson nomi nima? Lesson nomini kiriting
                  </SoftTypography>
                  <SoftInput
                    placeholder="Lesson nomi"
                    size="large"
                    name="name"
                    value={lessonData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <SoftTypography variant="caption">
                    Lesson tartibi qanday? Lesson tartib raqamini kiriting
                  </SoftTypography>
                  <SoftInput
                    placeholder="Tartib raqam"
                    size="large"
                    type="number"
                    name="sort"
                    value={lessonData.sort}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <SoftTypography variant="caption">
                    Lesson davomiyligi qanday? Lessonning umumiy minuti qancha
                  </SoftTypography>
                  <SoftInput
                    placeholder="Lesson davomiyligi (minutda)"
                    size="large"
                    name="lessonMinute"
                    type="number"
                    value={lessonData.lessonMinute}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-full gap-x-4 rounded-xl flex items-center justify-between">
              <div className="w-full h-full">
                <div className="">
                  <div className="uppercase bg-[#344767]  text-white font-semibold text-center border-2 rounded-md">
                    Video url
                  </div>
                </div>
                <div>
                  <SoftTypography variant="caption">
                    Qaysi video provideridan foydalanyapsiz? sizni video url turingi qaysi
                  </SoftTypography>
                  <SoftSelect
                    placeholder="Video provayderini tanlang"
                    options={[
                      { value: "vimeoLink", label: "Vimeo" },
                      { value: "youTubeLink", label: "YouTube" },
                      { value: "jeLearning", label: "JLearning" },
                      { value: "googleDrive", label: "Google Drive" },
                    ]}
                    onChange={(selectedOption) =>
                      handleSelectChange("videoProvider", selectedOption.value)
                    }
                  />
                  <SoftTypography variant="caption">
                    Video uchun urlni joylang. Iltimos bizga aniq url manzilni bering
                  </SoftTypography>
                  <SoftInput
                    placeholder="Video URL manzilini joylang"
                    name={
                      lessonData.isVimeoLink
                        ? "vimeoLink"
                        : lessonData.isYouTubeLink
                        ? "youTubeLink"
                        : lessonData.isJeLearning
                        ? "jeLearning"
                        : lessonData.isGoogleDrive
                        ? "googleDrive"
                        : ""
                    }
                    value={
                      lessonData.isVimeoLink
                        ? lessonData.vimeoLink
                        : lessonData.isYouTubeLink
                        ? lessonData.youTubeLink
                        : lessonData.isJeLearning
                        ? lessonData.jeLearning
                        : lessonData.isGoogleDrive
                        ? lessonData.googleDrive
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="border-2 bg-red-500 rounded-xl mt-5 mb-2"></div>
                <div className="h-full">
                  <SoftTypography variant="caption">
                    Bu yerda videoni ko`rishingiz mumkin
                  </SoftTypography>
                  <div className="h-64 rounded-xl border-2">
                    {lessonData.vimeoLink ||
                    lessonData.youTubeLink ||
                    lessonData.jeLearning ||
                    lessonData.googleDrive ? (
                      <iframe
                        className="w-full h-full"
                        src={getEmbedUrl(
                          lessonData.vimeoLink ||
                            lessonData.youTubeLink ||
                            lessonData.jeLearning ||
                            lessonData.googleDrive
                        )}
                        title="Video player"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <SoftTypography variant="caption" className="px-10 text-center">
                          Agar barcha ma`lumotni to`gri kiritgan bo`lsangiz, video bu yerda
                          ko`rinishi kerak
                        </SoftTypography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full h-full">
                <div className="">
                  <div className="uppercase font-semibold bg-[#344767]  text-white text-center border-2 rounded-md">
                    Lesson haqida
                  </div>
                </div>
                <div>
                  <SoftTypography variant="caption">
                    Lesson Haqida ma`lumotlarni kiriting
                  </SoftTypography>
                  <ReactQuill
                    className="h-96"
                    theme="snow"
                    value={lessonData.about}
                    onChange={(content) => setLessonData((prev) => ({ ...prev, about: content }))}
                    modules={modules}
                    formats={formats}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UpdateLesson;
