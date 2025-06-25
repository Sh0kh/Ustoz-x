import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Group } from "yaponuz/data/controllers/group";
import { Users } from "yaponuz/data/api";
import { report } from "yaponuz/data/api";
import Swal from "sweetalert2";
import { Frown, Loader, Tag as TagIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Typography, Paper, List, ListItem, ListItemText, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import { TagController } from "yaponuz/data/controllers/tag";

// Компонент для textarea с подсказками тегов
const TagSuggestionTextarea = ({ value, onChange, placeholder, studentId, tags, style, inputProps }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Функция для поиска текущего слова и позиции курсора
    const getCurrentWordAndPosition = (text, cursorPos) => {
        if (!text) return { currentWord: '', currentWordIndex: -1 };

        const words = text.split(/\s+/);
        let currentPos = 0;
        let currentWordIndex = -1;
        let currentWord = '';

        for (let i = 0; i < words.length; i++) {
            const wordStart = currentPos;
            const wordEnd = currentPos + words[i].length;

            if (cursorPos >= wordStart && cursorPos <= wordEnd) {
                currentWordIndex = i;
                currentWord = words[i];
                break;
            }
            currentPos = wordEnd + 1; // +1 для пробела
        }

        return { currentWord, currentWordIndex };
    };

    // Обработка изменения текста
    const handleTextChange = (e) => {
        const newValue = e.target.value || '';
        const cursorPos = e.target.selectionStart;

        onChange(e);
        setCursorPosition(cursorPos);

        const { currentWord } = getCurrentWordAndPosition(newValue, cursorPos);
        setCurrentWord(currentWord);

        // Поиск совпадающих тегов
        if (currentWord && currentWord.length >= 2) {
            const matchingTags = tags.filter(tag =>
                tag?.name?.toLowerCase().includes(currentWord.toLowerCase())
            );

            if (matchingTags.length > 0) {
                setSuggestions(matchingTags);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    // Обработка выбора тега
    const handleTagSelect = (selectedTag) => {
        if (!selectedTag?.name) return;

        const textarea = textareaRef.current;
        if (!textarea) return;

        // Получаем нативный input/textarea элемент внутри SoftInput
        const nativeInput = textarea.querySelector('textarea') || textarea.querySelector('input');
        if (!nativeInput) return;

        const text = nativeInput.value || '';
        const { currentWord } = getCurrentWordAndPosition(text, cursorPosition);

        // Заменяем текущее слово на выбранный тег
        const beforeCursor = text.substring(0, cursorPosition - currentWord.length);
        const afterCursor = text.substring(cursorPosition);
        const newText = beforeCursor + selectedTag.name + afterCursor;

        // Создаем событие для обновления значения
        const event = {
            target: {
                value: newText
            }
        };

        onChange(event);
        setShowSuggestions(false);

        // Устанавливаем курсор после вставленного тега
        setTimeout(() => {
            const newCursorPos = beforeCursor.length + selectedTag.name.length;
            nativeInput.focus();
            nativeInput.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Обработка клика вне области подсказок
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                textareaRef.current && !textareaRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <SoftInput
                ref={textareaRef}
                multiline
                minRows={3}
                maxRows={8}
                value={value || ''}
                onChange={handleTextChange}
                onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                style={style}
                inputProps={inputProps}
                placeholder={placeholder}
            />

            {showSuggestions && suggestions.length > 0 && (
                <Paper
                    ref={suggestionsRef}
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 200,
                        overflow: 'auto',
                        mt: 1,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <List dense>
                        {suggestions.map((tag) => (
                            <ListItem
                                key={tag.id}
                                button
                                onClick={() => handleTagSelect(tag)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    py: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
                                    <Typography variant="h6">
                                        {tag.name}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
};
export default function ReportCreate() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupID, setGroupID] = useState(null);
    const [GroupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);

    const [scores, setScores] = useState({});
    const [Type] = useState([
        { value: 'RECOMMENDATION', label: 'Tavsiya' },
        { value: 'REPORT', label: 'Hisobot' }
    ]);
    const [selectType, setselectType] = useState('');
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState([]);

    const getAllTag = async () => {
        try {
            const response = await TagController.getAllTag();
            setTag(response?.object || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllTag();
    }, []);

    // Группы
    const getAllGroups = async (page, size) => {
        try {
            const response = await Group.getMyGroups(page, size);
            const groups = response.object || [];
            const formattedOptions = groups?.map((group) => ({
                label: group.name,
                value: group.id,
                courseId: group.courseId,
            }));
            setGroupOptions(formattedOptions);
        } catch (err) {
            console.error("Error from groups list GET: ", err);
        }
    };

    // Студенты
    const getStudents = async () => {
        if (!groupID) return;
        setLoading(true);
        setNoGroupSelected(false);
        try {
            const response = await Users.getUsersAttendance(0, 100, "", "", "", groupID);
            setStudents(response.object?.content || []);
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGroups(page, size);
    }, [page, size]);

    useEffect(() => {
        if (groupID) {
            getStudents();
        } else {
            setStudents([]);
        }
    }, [groupID]);

    // DataTable columns
    const studentColumns = [
        { Header: <span style={{ fontSize: 13 }}>Ism</span>, accessor: "Ism" },
        { Header: <span style={{ fontSize: 13 }}>Izoh</span>, accessor: "info" },
    ];

    const handleScoreChange = (studentId, field, value) => {
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
                <span style={{ fontSize: 13 }}>{student.firstName} {student.lastName}</span>
            </NavLink>
        ),
        info: (
            <TagSuggestionTextarea
                value={scores[student.id]?.info ?? ""}
                onChange={e => handleScoreChange(student.id, "info", e.target.value)}
                placeholder="Izoh "
                studentId={student.id}
                tags={tag}
                style={{
                    width: "100%",
                    fontSize: 13,
                    resize: "vertical",
                    minHeight: 38,
                    maxHeight: 180,
                    padding: "8px 10px"
                }}
                inputProps={{ style: { fontSize: 13 } }}
            />
        ),
    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

    // Отправка отчета
    const CreateReport = async () => {
        try {
            const reportArray = students
                .filter(student => (scores[student.id]?.info || "").trim() !== "")
                .map(student => ({
                    context: scores[student.id]?.info || "",
                    fileId: null,
                    reportType: selectType,
                    studentId: student.id,
                    title: title
                }));

            if (reportArray.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diqqat!',
                    text: 'Hech bir o`quvchiga izoh yozilmadi.',
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
                text: 'Hisobot yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko`ring.',
            });
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3} className='Report'>
                <Card style={{ margin: "10px 0px", overflow: "visible", padding: "20px" }}>
                    <SoftBox style={{ overflow: "visible", width: "100%" }}>
                        <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" >
                            <Typography variant="h4" fontWeight="bold" >
                                Hisobot yaratish
                            </Typography>
                            <SoftButton style={{ backgroundColor: '#344767', color: '#fff' }} maxWidth={'100px'} onClick={CreateReport} sx={{ height: "40px" }}>
                                + Qo`shish
                            </SoftButton>
                        </SoftBox>
                        <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            gap={2}
                            flexWrap="wrap"
                            mb={2}
                        >
                            <SoftBox flex="1" minWidth="200px">
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}
                                >
                                    Guruh tanlang
                                </SoftTypography>
                                <SoftSelect
                                    fullWidth
                                    options={GroupOptions}
                                    value={GroupOptions.find(opt => opt.value === groupID) || null}
                                    onChange={e => {
                                        setGroupID(e.value);
                                    }}
                                    placeholder="Guruhni tanlang"
                                />
                            </SoftBox>
                            <SoftBox flex="1" minWidth="200px" mb={2}>
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}                                     >
                                    Turi
                                </SoftTypography>
                                <SoftSelect
                                    placeholder="Turi"
                                    options={Type}
                                    value={Type.find(opt => opt.value === selectType) || null}
                                    onChange={value => setselectType(value.value)}
                                />
                            </SoftBox>
                            <SoftBox flex="1" minWidth="200px" mb={2}>
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}                                     >
                                    Sarlavha
                                </SoftTypography>
                                <SoftInput
                                    placeholder="Sarlavha"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </SoftBox>
                        </SoftBox>
                    </SoftBox>
                </Card>
                <Card style={{ margin: "10px 0px" }}>
                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Iltimos, guruhni tanlang</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, iltimos kuting</p>
                        </div>
                    ) : students.length !== 0 ? (
                        <DataTable
                            table={studentTableData}
                            entriesPerPage={{
                                defaultValue: 20,
                                entries: [5, 10, 15, 20],
                            }}
                            canSearch
                            sx={{
                                "& th, & td": {
                                    fontSize: "13px",
                                    padding: "6px 8px",
                                },
                            }}
                        />
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">O`quvchilar topilmadi</p>
                                <p className="text-sm text-gray-700">Boshqa guruhni tanlab ko`ring</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}// PropTypes валидация
TagSuggestionTextarea.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    style: PropTypes.object,
    inputProps: PropTypes.object,
};