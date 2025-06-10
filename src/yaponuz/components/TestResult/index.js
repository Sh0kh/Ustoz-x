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
import Swal from "sweetalert2"; // Предполагается, что вы используете sweetalert2 для уведомлений
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TestResultHistory from "./component/TestResultHistory";

export default function TestResult() {
    const [students, setStudents] = useState([]); // Состояние для хранения студентов
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [submitting, setSubmitting] = useState(false); // Состояние процесса отправки
    const [groupID, setGroupID] = useState(null); // ID выбранной группы
    const [GroupOptions, setGroupOptions] = useState([]); // Опции для выпадающего списка групп
    const [noGroupSelected, setNoGroupSelected] = useState(true); // Флаг для отслеживания выбора группы
    const [title, setTitle] = useState(''); // Заголовок
    const [date, setDate] = useState(new Date()); // Дата (по умолчанию сегодняшняя)
    const [scores, setScores] = useState({}); // Состояние для хранения оценок студентов
    const [errors, setErrors] = useState({ title: '', scores: {} }); // Состояние для ошибок валидации
    const [selectedAction, setSelectedAction] = useState(''); // Состояние для выбранного действия
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getAllGroups = async () => {
        try {
            const response = await Group.getMyGroups(0, 100); // Получаем все группы
            const groups = response.object || [];

            const formattedOptions = groups.map((group) => ({
                label: group.name,
                value: group.id,
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
            setScores(initialScores);

            // Сбрасываем ошибки при загрузке новых данных
            setErrors({ title: '', scores: {} });
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

    // Вызываем `getStudents` при изменении groupID
    useEffect(() => {
        if (groupID) {
            getStudents();
        } else {
            setStudents([]); // Очищаем список студентов, если группа не выбрана
            setScores({}); // Очищаем оценки
            setErrors({ title: '', scores: {} }); // Очищаем ошибки
        }
    }, [groupID]);

    useEffect(() => {
        getAllGroups(); // Загружаем список групп при монтировании компонента
    }, []);

    // Валидация title
    const validateTitle = (value) => {
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, title: 'Title is required' }));
            return false;
        }

        if (value.trim().length < 3) {
            setErrors(prev => ({ ...prev, title: 'Title must be at least 3 characters' }));
            return false;
        }

        setErrors(prev => ({ ...prev, title: '' }));
        return true;
    };

    // Валидация score
    const validateScore = (id, value) => {
        if (value === "" || value === null) {
            return true; // Пустые значения разрешены
        }

        const numValue = Number(value);

        if (isNaN(numValue)) {
            setErrors(prev => ({
                ...prev,
                scores: { ...prev.scores, [id]: 'Must be a number' }
            }));
            return false;
        }

        if (numValue < 0 || numValue > 100) {
            setErrors(prev => ({
                ...prev,
                scores: { ...prev.scores, [id]: 'Score should be between 0 and 100' }
            }));
            return false;
        }

        // Очищаем ошибку, если значение корректно
        setErrors(prev => {
            const updatedScoreErrors = { ...prev.scores };
            delete updatedScoreErrors[id];
            return { ...prev, scores: updatedScoreErrors };
        });

        return true;
    };

    // Обработчик изменения оценки с валидацией
    const handleScoreChange = (id, value) => {
        // Проверяем ввод только для не-пустых значений
        if (value !== "") {
            validateScore(id, value);
        } else {
            // Для пустого значения просто очищаем ошибку
            setErrors(prev => {
                const updatedScoreErrors = { ...prev.scores };
                delete updatedScoreErrors[id];
                return { ...prev, scores: updatedScoreErrors };
            });
        }

        const numericValue = value === "" ? "" : Number(value);
        setScores((prevScores) => ({
            ...prevScores,
            [id]: numericValue,
        }));
    };

    // Обработчик изменения заголовка с валидацией
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        validateTitle(value);
    };

    // Функция для отправки результатов на бэкенд
    const handleSubmitResults = async () => {
        // Валидация заголовка
        const isTitleValid = validateTitle(title);

        // Валидация всех заполненных оценок
        let areScoresValid = true;
        for (const [id, score] of Object.entries(scores)) {
            if (score !== "" && score !== null) {
                if (!validateScore(id, score)) {
                    areScoresValid = false;
                }
            }
        }

        // Проверяем, что хотя бы для одного студента введена оценка
        const hasScores = Object.values(scores).some(
            score => score !== "" && score !== null
        );

        if (!hasScores) {
            Swal.fire({
                icon: 'warning',
                title: 'No Scores Entered',
                text: 'Please enter at least one student score',
            });
            return;
        }

        // Если есть ошибки валидации, останавливаем отправку
        if (!isTitleValid || !areScoresValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct all errors before submitting',
            });
            return;
        }

        try {
            setSubmitting(true);

            const loadingSwal = Swal.fire({
                title: "Adding...",
                text: "Please Wait!",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Фильтруем пустые значения и форматируем данные для отправки
            const studentScore = {};
            Object.entries(scores).forEach(([id, score]) => {
                if (score !== "" && score !== null) {
                    studentScore[id] = Number(score);
                }
            });

            const formattedDate = date instanceof Date && !isNaN(date)
                ? date.toISOString().split('T')[0]
                : null;

            const data = {
                date: formattedDate,
                studentScore: studentScore || {}, // по умолчанию пустой объект
                title: typeof title === 'string' ? title.trim() : ''
            };


            // Отправляем данные на бэкенд
            const response = await testResult.createTestResult(data);
            loadingSwal.close();

            // Показываем уведомление об успешной отправке
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Test results have been saved for ${Object.keys(studentScore).length} students.`,
                timer: 2000,
                showConfirmButton: false
            });

            // Очищаем форму
            setTitle('');
            setDate(new Date());

            const resetScores = students.reduce((acc, student) => {
                acc[student.id] = "";
                return acc;
            }, {});
            setScores(resetScores);
            setErrors({ title: '', scores: {} }); // Очищаем ошибки

        } catch (err) {
            console.error("Error submitting test results:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save test results. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Таблица для студентов
    const studentColumns = [
        { Header: "Ism", accessor: "name" },
        { Header: "Familiya", accessor: "lastName" },
        { Header: "Ball", accessor: "score" },
    ];

    const studentRows = students.map((student) => ({
        id: student.id,
        name: (
            <NavLink className={'text-blue-400'} to={`/student/test-result/${student?.id}`}>
                {student.firstName}
            </NavLink>
        ),
        lastName: student.lastName,
        score: (
            <div>
                <SoftInput
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 10, // Set the maximum allowed value in inputProps
                    }}
                    value={scores[student.id] || ""}
                    onChange={(e) => {
                        const value = Math.min(10, Math.max(0, e.target.value));
                        handleScoreChange(student.id, value);
                    }}
                    error={!!errors.scores[student.id]}
                />

                {errors.scores[student.id] && (
                    <div className="text-xs text-red-500 mt-1">
                        {errors.scores[student.id]}
                    </div>
                )}
            </div>
        )
    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };


    const getAllTestResults = async ({ groupId, startDate, endDate }) => {
        try {
            const response = await testResult.getTestResultByID({
                groupId,
                startDate,
                endDate,
            });

            if (response.success) {
                // Обработка полученных результатов тестов
                console.log("Test results fetched successfully:", response.object);
            } else {
                console.error("Failed to fetch test results:", response.message);
            }
        } catch (error) {
            console.error("Error fetching test results: ", error);
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox>
                <SoftBox>
                    <Card
                        variant="outlined"
                        sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 2,
                            background: "#f5f7fa",
                            overflow: "visible",
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" mb={3}>
                            Test natijalari
                        </Typography>
                        <Grid container spacing={2} alignItems="center" mb={2}>
                            <Grid item xs={12} md={5}>
                                <SoftSelect
                                    placeholder="Guruh tanlang"
                                    options={GroupOptions}
                                    value={GroupOptions.find(opt => opt.value === groupID) || null}
                                    onChange={e => {
                                        setGroupID(e.value);
                                        setNoGroupSelected(false);
                                    }}
                                    fullWidth
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                        menu: base => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <SoftSelect
                                    placeholder="Amalni tanlang"
                                    options={[
                                        { label: "Tarixni ko‘rish", value: "view-history" },
                                        { label: "Natijalar qo‘shish", value: "add-results" },
                                    ]}
                                    value={[
                                        { label: "Tarixni ko‘rish", value: "view-history" },
                                        { label: "Natijalar qo‘shish", value: "add-results" },
                                    ].find(opt => opt.value === selectedAction) || null}
                                    onChange={e => setSelectedAction(e.value)}
                                    fullWidth
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                        menu: base => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Форма для добавления результатов */}
                    {selectedAction === "add-results" && students.length > 0 && groupID && (
                        <Card variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 2, background: "#f5f7fa" }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <SoftInput
                                        placeholder="Sarlavha"
                                        value={title}
                                        fullWidth
                                        onChange={handleTitleChange}
                                        error={!!errors.title}
                                    />
                                    {errors.title && (
                                        <div className="text-xs text-red-500 mt-1">{errors.title}</div>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <SoftDatePicker
                                        placeholder="Test sanasi"
                                        value={date}
                                        fullWidth
                                        onChange={newDate => setDate(newDate)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} display="flex" alignItems="center" justifyContent="flex-end">
                                    <SoftButton
                                        fullWidth
                                        variant="gradient"
                                        color="info"
                                        onClick={handleSubmitResults}
                                        disabled={submitting}
                                        sx={{ height: 48, fontWeight: "bold", fontSize: 16 }}
                                    >
                                        {submitting ? "Saqlanmoqda..." : "+ Yangi natija qo‘shish"}
                                    </SoftButton>
                                </Grid>
                            </Grid>
                        </Card>
                    )}

                    {/* Tarixni ko‘rish uchun фильтр и кнопка */}
                    {selectedAction === "view-history" && (
                        <SoftBox>
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
                            <SoftBox display="flex" justifyContent="flex-end" mb={2}>
                                <SoftButton
                                    variant="gradient"
                                    color="info"
                                    onClick={() => getAllTestResults({
                                        groupId: groupID,
                                        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : "",
                                        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : "",
                                    })}
                                >
                                    Izlash
                                </SoftButton>
                            </SoftBox>
                        </SoftBox>
                    )}

                    {/* Состояния */}
                    {noGroupSelected ? (
                        <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200} mt={4}>
                            <Icon sx={{ fontSize: 60, color: "#bdbdbd" }}>group</Icon>
                            <Typography variant="h6" color="text.secondary" mt={2}>
                                Iltimos, guruhni tanlang
                            </Typography>
                        </SoftBox>
                    ) : loading ? (
                        <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200} mt={4}>
                            <Loader className="animate-spin ml-2 size-10" />
                            <Typography variant="body1" color="text.secondary" mt={2}>
                                Yuklanmoqda, iltimos kuting
                            </Typography>
                        </SoftBox>
                    ) : students.length !== 0 && selectedAction === "add-results" ? (
                        <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 1 }}>
                            <SoftBox p={2}>
                                <DataTable
                                    table={studentTableData}
                                    entriesPerPage={{
                                        defaultValue: 10,
                                        entries: [5, 10, 15, 20],
                                    }}
                                    canSearch
                                />
                            </SoftBox>
                        </Card>
                    ) : students.length !== 0 && selectedAction === "view-history" ? (
                        <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120} mt={4}>
                            
                        </SoftBox>
                    ) : (
                        <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200} mt={4}>
                            <Frown className="size-20" />
                            <Typography variant="h6" color="text.secondary" mt={2}>
                                Talabalar topilmadi
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Boshqa guruhni tanlab ko‘ring
                            </Typography>
                        </SoftBox>
                    )}
                </SoftBox>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}