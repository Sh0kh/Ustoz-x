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
import { personality } from "yaponuz/data/controllers/personality";
import { report } from "yaponuz/data/api";

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

    const [Type, setType] = useState([
        { value: 'RECOMMENDATION', label: 'Tavsiya' },
        { value: 'REPORT', label: 'Hisobot' }
    ]);
    const [selectType, setselectType] = useState('');
    const [title, setTitle] = useState('');

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








    // Studentlar uchun DataTable ustunlari (to‘liq o‘zbek lotin)
    const studentColumns =
        [
            { Header: "Ism", accessor: "Ism" },
            { Header: "Izoh", accessor: "info" },
        ]

    // Har bir o‘quvchi uchun faqat bitta SoftInput va info
    const studentRows = students.map((student) => ({
        Ism: (
            <NavLink className={'text-blue-400'} to={`/student-lesson-report/${groupID}/${student?.id}`}>
                {student.firstName} {' '} {student.lastName}
            </NavLink>
        ),

        info: (
            <SoftInput
                type="text"
                value={scores[student.id]?.info ?? ""}
                onChange={e => handleScoreChange(student.id, "info", e.target.value)}
                style={{ width: 500, minWidth: 200 }}
                placeholder="Izoh"
            />
        ),
    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

    const handleSearchHistory = async () => {
        try {
            // Преобразование даты к формату yyyy-MM-dd HH:mm:ss (локальное время, без смещения)
            const formatDateTime = (date) => {
                if (!date) return "";
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const hours = String(d.getHours()).padStart(2, "0");
                const minutes = String(d.getMinutes()).padStart(2, "0");
                const seconds = String(d.getSeconds()).padStart(2, "0");
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            const data = {
                groupId: groupID,
                startDate: startDate ? formatDateTime(startDate) : "",
                endDate: endDate ? formatDateTime(endDate) : "",
            };
            const response = await report.getReportByID(data);
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
    const CreateReport = async () => {
        try {
            // Формируем массив для отправки, только если есть izoh (context)
            const reportArray = students
                .filter(student => (scores[student.id]?.info || "").trim() !== "")
                .map(student => ({
                    context: scores[student.id]?.info || "",
                    fileId: null, // если нужен fileId, подставьте сюда значение
                    reportType: selectType,
                    studentId: student.id,
                    title: title
                }));

            if (reportArray.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diqqat!',
                    text: 'Hech bir o‘quvchiga izoh yozilmadi.',
                });
                return;
            }

            const response = await report.createReport(reportArray);

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Hisobotlar saqlandi!',
                    text: 'Barcha hisobotlar muvaffaqiyatli saqlandi.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xatolik',
                    text: response.message || 'Hisobotlarni saqlashda xatolik yuz berdi.',
                });
            }
        } catch (error) {
            console.error("Error creating report: ", error);
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
        { Header: "Title", accessor: "title" },
        { Header: "Report Type", accessor: "reportType" },
        { Header: "Izoh", accessor: "context" },
        { Header: "Sana", accessor: "createdAt" },
    ];

    // Har bir natijani jadvalga tayyorlaymiz
    const historyTableRows = historyResults.map(item => ({
        title: item.title,
        reportType: item.reportType,
        context: item.context,
        createdAt: item.createdAt ? item.createdAt.replace("T", " ").slice(0, 19) : "",
    }));

    const historyTableData = {
        columns: historyTableColumns,
        rows: historyTableRows,
    };

    // Ballarni o‘zgartirish uchun funksiya
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
                                <SoftBox display="flex" gap={2} mt={1} mb={1}>
                                    <SoftBox flex="1" minWidth="200px" mb={2}>
                                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                                            Select type
                                        </SoftTypography>
                                        <SoftSelect
                                            placeholder="Choose a group"
                                            options={Type}
                                            value={Type.find(opt => opt.value === selectType) || null}
                                            onChange={value => setselectType(value.value)}
                                        />
                                    </SoftBox>
                                    <SoftBox flex="1" minWidth="200px" mb={2}>
                                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                                            Title
                                        </SoftTypography>
                                        <SoftInput
                                            placeholder="Enter the title"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                        />
                                    </SoftBox>
                                </SoftBox>
                            </>
                        )}


                        {/* Uchunchi qator: tugma */}
                        <SoftBox display="flex" justifyContent="flex-start" minWidth="200px">
                            {selectedAction === "grading" ? (
                                <SoftButton fullWidth onClick={CreateReport} sx={{ height: "40px" }}>
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
                            Shaxsiyati hisobotlari
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