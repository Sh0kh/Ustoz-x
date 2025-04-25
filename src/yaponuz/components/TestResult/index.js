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

            // Форматируем данные согласно требуемой структуре
            const data = {
                date: date.toISOString().split('T')[0], // Формат YYYY-MM-DD
                studentScore: studentScore, // Оценки студентов в формате {studentId: score}
                title: title.trim()
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
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name" },
        { Header: "Last Name", accessor: "lastName" },
        {
            Header: "Score", accessor: "score",
        },
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
                    inputProps={{ min: 0, max: 100 }} // Ограничиваем минимальное и максимальное значение
                    value={scores[student.id] || ""}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
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

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                        <SoftSelect
                            placeholder='Select group'
                            style={{ flex: 1, minWidth: "150px" }}
                            options={GroupOptions}
                            onChange={(e) => {
                                setGroupID(e.value);
                                setNoGroupSelected(false); // Скрываем сообщение "Выберите группу"
                            }}
                        />
                        {/* Поля Title и Date отображаются только при наличии студентов или выбранной группы */}
                        {(students.length > 0 && groupID) && (
                            <SoftBox display="flex" justifyContent="space-between" gap="10px" alignItems="flex-start">
                                <div className="w-full" style={{ flex: 1, width: '200px' }}>
                                    <SoftInput
                                        placeholder="Title"
                                        value={title}
                                        fullWidth
                                        onChange={handleTitleChange}
                                        error={!!errors.title}
                                    />
                                    {errors.title && (
                                        <div className="text-xs text-red-500 mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full" style={{width: '200px' }}>
                                    <SoftDatePicker
                                        placeholder="Date of Test"
                                        value={date}
                                        fullWidth
                                        onChange={(newDate) => setDate(newDate)}
                                    />
                                </div>
                                <SoftButton
                                    style={{ width: '200px' }}
                                    variant="gradient"
                                    color="dark"
                                    onClick={handleSubmitResults}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : '+ add new result'}
                                </SoftButton>
                            </SoftBox>
                        )}
                    </SoftBox>

                    {/* Отображение состояния */}
                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Please select a group</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Loading, please wait</p>
                        </div>
                    ) : students.length !== 0 ? (
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
                                <p className="uppercase font-semibold">No students found</p>
                                <p className="text-sm text-gray-700">Try selecting a different group</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}