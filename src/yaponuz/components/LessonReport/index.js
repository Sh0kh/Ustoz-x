import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import SoftBadge from "components/SoftBadge";
import { Group } from "yaponuz/data/controllers/group";
import { Frown, Loader } from "lucide-react";
import { NavLink } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";
import { testResult } from "yaponuz/data/controllers/testResult";
import Swal from "sweetalert2";
import { Lesson } from "yaponuz/data/controllers/lesson";
import { Module } from "yaponuz/data/api";
import { Grid } from "@mui/material";
import { lessonReport } from "yaponuz/data/controllers/lessonReport";
import PropTypes from "prop-types";

export default function LessonReport() {
    const [students, setStudents] = useState([]); // Состояние для хранения студентов
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [groupID, setGroupID] = useState(null); // ID выбранной группы
    const [GroupOptions, setGroupOptions] = useState([]); // Опции для выпадающего списка групп
    const [noGroupSelected, setNoGroupSelected] = useState(true); // Флаг для отслеживания выбора группы
    const [studentLesson, setStudentLesson] = useState([])
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    // Module selection states
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);

    // Lesson selection states
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const [lessonID, setLessonID] = useState(null);

    const [selectedAction, setSelectedAction] = useState(""); // "view-history" yoki "grading"

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportDate, setReportDate] = useState(null);

    const [scores, setScores] = useState({});
    const [historyResults, setHistoryResults] = useState([]); // Новый state для истории

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

    const getStudents = async () => {
        if (!groupID) return;

        setLoading(true);
        setNoGroupSelected(false);

        try {
            const response = await Users.getUsersAttendance(0, 100, "", "", "", groupID);
            setStudents(response.object?.content || []);

            const initialScores = response.object?.content.reduce((acc, student) => {
                acc[student.id] = student.Score || ""; // Устанавливаем начальное значение Score
                return acc;
            }, {});

            // Сбрасываем ошибки при загрузке новых данных
            setErrors({ title: '', scores: {} });
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

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
        }
    };

    useEffect(() => {
        getAllGroups(page, size);
    }, [page, size, groupID]);

    // Вызываем `getStudents` при изменении groupID
    useEffect(() => {
        if (groupID) {
            getStudents();
        } else {
            setStudents([]); // Очищаем список студентов, если группа не выбрана
        }
    }, [groupID]);

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

    useEffect(() => {
        if (selectedModule) {
            getModuleLessons(selectedModule);
            // Reset lesson selection
            setSelectedLesson(null);
            setLessons([]);
        }
    }, [selectedModule]);




    // Studentlar uchun DataTable ustunlari (to‘liq o‘zbek lotin)
    const studentColumns = [
        { Header: "Ism", accessor: "Ism" },
        { Header: "Darsda qatnashish uchun", accessor: "attendance" },
        { Header: "Uyga vazifa bajargani uchun", accessor: "homework" },
        { Header: "Faollik uchun", accessor: "activity" },
    ];

    const handleScoreChange = (studentId, field, value) => {
        if (value > 10) value = 10;
        if (value < 0) value = 0;
        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };

    const studentRows = students.map((student) => ({
        Ism: (
            <NavLink className={'text-blue-400'} to={`/student-lesson-report/${groupID}/${student?.id}`}>
                {student.firstName} {' '} {student.lastName}
            </NavLink>
        ),
        phoneNumber: student.phoneNumber,
        attendance: (
            <SoftInput
                type="number"
                min={0}
                max={10}
                value={scores[student.id]?.attendance ?? ""}
                onChange={e => handleScoreChange(student.id, "attendance", Number(e.target.value))}
                style={{ width: 60, textAlign: "center" }}
                inputProps={{ max: 10, min: 0 }}
            />
        ),
        homework: (
            <SoftInput
                type="number"
                min={0}
                max={10}
                value={scores[student.id]?.homework ?? ""}
                onChange={e => handleScoreChange(student.id, "homework", Number(e.target.value))}
                style={{ width: 60, textAlign: "center" }}
                inputProps={{ max: 10, min: 0 }}
            />
        ),
        activity: (
            <SoftInput
                type="number"
                min={0}
                max={10}
                value={scores[student.id]?.activity ?? ""}
                onChange={e => handleScoreChange(student.id, "activity", Number(e.target.value))}
                style={{ width: 60, textAlign: "center" }}
                inputProps={{ max: 10, min: 0 }}
            />
        ),
    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

    const handleSearchHistory = async () => {
        try {
            // Преобразование даты к формату 2025-06-01 (локальное время, без смещения)
            const formatDate = (date) => {
                if (!date) return "";
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };


            const data = {
                groupId: groupID,
                startDate: startDate ? formatDate(startDate) : "",
                endDate: endDate ? formatDate(endDate) : "",
            };
            const response = await lessonReport.getLessonReportByDate(data);
            // Сохраняем результаты в state
            setHistoryResults(response.object?.content || []);
        } catch (error) {
            console.error("Tarixni qidirishda xatolik:", error);
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Tarixni olishda xatolik yuz berdi.',
            });
        }
    };
    const CreateLessonReport = async () => {
        try {
            // Собираем массив отчётов для каждого студента
            const reportArray = students.map(student => {
                const attendance = scores[student.id]?.attendance;
                const homework = scores[student.id]?.homework;
                const activity = scores[student.id]?.activity;

                // Собираем только те оценки, которые реально есть
                const studentScores = [];
                if (attendance !== undefined && attendance !== null && attendance !== "") {
                    studentScores.push({
                        description: "Darsda qatnashish uchun",
                        score: Number(attendance),
                    });
                }
                if (homework !== undefined && homework !== null && homework !== "") {
                    studentScores.push({
                        description: "Uyga vazifa bajargani uchun",
                        score: Number(homework),
                    });
                }
                if (activity !== undefined && activity !== null && activity !== "") {
                    studentScores.push({
                        description: "Faollik uchun",
                        score: Number(activity),
                    });
                }

                // Если нет ни одной оценки — не включаем этого студента
                if (studentScores.length === 0) return null;

                return {
                    groupId: groupID,
                    id: 0,
                    lessonId: selectedLesson?.value || 0,
                    reportDate:
                        reportDate && reportDate[0]
                            ? (() => {
                                const d = new Date(reportDate[0]);
                                const year = d.getFullYear();
                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                const day = String(d.getDate()).padStart(2, "0");
                                return `${year}-${month}-${day}`;
                            })()
                            : "",
                    scores: studentScores,
                    studentId: student.id,
                };
            }).filter(Boolean); // Убираем null

            if (reportArray.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diqqat!',
                    text: 'Hech bir o‘quvchiga baho kiritilmadi.',
                });
                return;
            }

            const response = await lessonReport.createLessonReport(reportArray);

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Baholar saqlandi!',
                    text: 'Barcha baholar muvaffaqiyatli saqlandi.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xatolik',
                    text: response.message || 'Baholarni saqlashda xatolik yuz berdi.',
                });
            }
        } catch (error) {
            console.error("Error creating lesson report: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Hisobot yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
            });
        }
    }

    // Красивый компонент для истории
    function HistoryCards({ results }) {
        if (!results.length) {
            return (
                <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                    <Frown className="size-20" />
                    <div className="text-center">
                        <p className="uppercase font-semibold">No history found</p>
                        <p className="text-sm text-gray-700">Try different dates</p>
                    </div>
                </div>
            );
        }
        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                {results.map((item) => (
                    <Card key={item.id} style={{ minWidth: 320, margin: 8, boxShadow: "0 2px 12px #eee" }}>
                        <SoftBox p={2}>
                            <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                                O‘quvchi ID: {item.studentId}
                            </SoftTypography>
                            <SoftTypography variant="body2" color="text" mb={1}>
                                Dars ID: {item.lessonId} | Sana: <b>{item.reportDate}</b>
                            </SoftTypography>
                            <SoftBox mt={1}>
                                {item.score.map((s, idx) => (
                                    <SoftBox key={idx} display="flex" alignItems="center" mb={0.5}>
                                        <SoftBadge
                                            color="info"
                                            variant="gradient"
                                            size="sm"
                                            sx={{ minWidth: 120, mr: 1 }}
                                        >
                                            {s.description}
                                        </SoftBadge>
                                        <SoftTypography variant="body2" fontWeight="medium">
                                            {s.score}
                                        </SoftTypography>
                                    </SoftBox>
                                ))}
                            </SoftBox>
                        </SoftBox>
                    </Card>
                ))}
            </div>
        );
    }

    // Добавьте propTypes для компонента
    HistoryCards.propTypes = {
        results: PropTypes.array.isRequired,
    };

    // Формируем данные для DataTable истории
    const historyTableColumns = [
        { Header: "O‘quvchi", accessor: "studentName" },
        { Header: "Darsda qatnashganlik uchun", accessor: "attendance" },
        { Header: "Uy vazifasi uchun", accessor: "homework" },
        { Header: "Faollik uchun", accessor: "activity" },
        { Header: "Sana", accessor: "date" },
    ];

    const studentMap = students.reduce((acc, s) => {
        acc[s.id] = `${s.firstName} ${s.lastName}`;
        return acc;
    }, {});

    // Группируем по ученику и дате
    const historyTableRows = historyResults.map(item => {
        const attendance = item.score.find(s => s.description === "Darsda qatnashish uchun")?.score ?? "";
        const homework = item.score.find(s => s.description === "Uyga vazifa bajargani uchun")?.score ?? "";
        const activity = item.score.find(s => s.description === "Faollik uchun")?.score ?? "";
        return {
            studentName: studentMap[item.studentId] || "—",
            attendance,
            homework,
            activity,
            date: item.reportDate,
        };
    });

    const historyTableData = {
        columns: historyTableColumns,
        rows: historyTableRows,
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px", overflow: "visible" }}>
                    <SoftBox p={3} style={{ overflow: "visible", width: "100%" }}>
                        {/* Birinchi qator: 2 select */}
                        <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            gap={2}
                            flexWrap="wrap"
                            mb={2}
                        >
                            {/* 1. Amalni tanlash */}
                            <SoftBox flex="1" minWidth="200px">
                                <SoftSelect
                                    fullWidth
                                    options={[
                                        { label: "Tarixni ko‘rish", value: "view-history" },
                                        { label: "Baholash", value: "grading" },
                                    ]}
                                    value={
                                        [
                                            { label: "Tarixni ko‘rish", value: "view-history" },
                                            { label: "Baholash", value: "grading" },
                                        ].find(opt => opt.value === selectedAction) || null
                                    }
                                    onChange={e => {
                                        setSelectedAction(e.value);
                                        setGroupID(null);
                                        setSelectedCourse(null);
                                        setSelectedModule(null);
                                        setSelectedLesson(null);
                                    }}
                                    placeholder="Amalni tanlang"
                                />
                            </SoftBox>

                            {/* 2. Guruh tanlash */}
                            {selectedAction && (
                                <SoftBox flex="1" minWidth="200px">
                                    <SoftSelect
                                        fullWidth
                                        options={GroupOptions}
                                        value={GroupOptions.find(opt => opt.value === groupID) || null}
                                        onChange={e => {
                                            setGroupID(e.value);
                                            setSelectedCourse(e.courseId);
                                        }}
                                        placeholder="Guruhni tanlang"
                                        isDisabled={!selectedAction}
                                    />
                                </SoftBox>
                            )}
                        </SoftBox>

                        {/* Sana tanlash faqat tarix uchun */}
                        {selectedAction === "view-history" && (
                            <SoftBox display="flex" gap={2} mt={2} mb={2}>
                                <SoftBox flex="1" minWidth="200px">
                                    <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                        Boshlanish sanasi
                                    </SoftTypography>
                                    <SoftDatePicker
                                        placeholder="Boshlanish sanasi"
                                        value={startDate}
                                        fullWidth
                                        onChange={setStartDate}
                                    />
                                </SoftBox>
                                <SoftBox flex="1" minWidth="200px">
                                    <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                        Tugash sanasi
                                    </SoftTypography>
                                    <SoftDatePicker
                                        placeholder="Tugash sanasi"
                                        value={endDate}
                                        fullWidth
                                        onChange={setEndDate}
                                    />
                                </SoftBox>
                            </SoftBox>
                        )}

                        {/* Modul va dars tanlash faqat "Baholash" uchun */}
                        {selectedAction === "grading" && groupID && (
                            <>
                                <SoftBox flex="1" minWidth="200px" mb={2}>
                                    <SoftSelect
                                        fullWidth
                                        placeholder="Modulni tanlang"
                                        options={modules}
                                        value={selectedModule}
                                        onChange={value => setSelectedModule(value)}
                                        isDisabled={!groupID}
                                    />
                                </SoftBox>
                            </>
                        )}

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
                                        placeholder="Darsni tanlang"
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
                        </SoftBox>
                        {selectedAction === "grading" && groupID && (
                            <>
                                <SoftBox flex="1" minWidth="200px" mb={2}>
                                    <SoftDatePicker
                                        placeholder="Hisobot sanasi"
                                        value={reportDate}
                                        fullWidth
                                        onChange={setReportDate}
                                    />
                                </SoftBox>
                            </>
                        )}

                        {/* Uchunchi qator: tugma */}
                        <SoftBox display="flex" justifyContent="flex-start" minWidth="200px">
                            {selectedAction === "grading" ? (
                                <SoftButton fullWidth onClick={CreateLessonReport} sx={{ height: "40px" }}>
                                    Baholash
                                </SoftButton>
                            ) : selectedAction === "view-history" ? (
                                <SoftButton fullWidth onClick={handleSearchHistory} sx={{ height: "40px" }}>
                                    Qidirish
                                </SoftButton>
                            ) : null}
                        </SoftBox>
                    </SoftBox>
                </Card>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                        <SoftTypography variant="h5" fontWeight="medium">
                            Dars hisobotlari
                        </SoftTypography>
                    </SoftBox>
                    {/* Holatlarni chiqarish */}
                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Iltimos, amaldi tanlang</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, iltimos kuting</p>
                        </div>
                    ) : selectedAction === "view-history" && historyResults.length > 0 ? (
                        <DataTable
                            table={historyTableData}
                            entriesPerPage={{
                                defaultValue: 10,
                                entries: [5, 10, 15, 20],
                            }}
                            canSearch
                        />
                    ) : students.length !== 0 && selectedAction === "grading" ? (
                        <DataTable
                            table={studentTableData}
                            entriesPerPage={{
                                defaultValue: 10,
                                entries: [5, 10, 15, 20],
                            }}
                            canSearch
                        />
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">O‘quvchilar topilmadi</p>
                                <p className="text-sm text-gray-700">Boshqa guruhni tanlab ko‘ring</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}