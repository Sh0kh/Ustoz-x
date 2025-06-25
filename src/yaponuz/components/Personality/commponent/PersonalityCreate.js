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
import SoftDatePicker from "components/SoftDatePicker";
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Users } from "yaponuz/data/api";
import { personality } from "yaponuz/data/controllers/personality";
import { Frown, Loader, Tag as TagIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import { Typography, Paper, List, ListItem, Chip } from "@mui/material";
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
TagSuggestionTextarea.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    style: PropTypes.object,
    inputProps: PropTypes.object,
};


export default function PersonalityCreate() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupID, setGroupID] = useState(null);
    const [GroupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [page] = useState(0);
    const [size] = useState(100);
    const [tags, setTags] = useState([]);

    const [reportDate, setReportDate] = useState(null);
    const [scores, setScores] = useState({});

    // Получение тегов
    useEffect(() => {
        const getAllTags = async () => {
            try {
                const response = await TagController.getAllTag();
                setTags(response?.object || []);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };
        getAllTags();
    }, []);

    // Получение групп
    useEffect(() => {
        (async () => {
            try {
                const response = await Group.getMyGroups(page, size);
                const groups = response.object || [];
                setGroupOptions(groups.map((group) => ({
                    label: group.name,
                    value: group.id,
                    courseId: group.courseId,
                })));
            } catch (err) { }
        })();
    }, [page, size]);

    // Получение студентов
    useEffect(() => {
        if (!groupID) {
            setStudents([]);
            setNoGroupSelected(true);
            return;
        }
        setLoading(true);
        setNoGroupSelected(false);
        Users.getUsersAttendance(0, 100, "", "", "", groupID)
            .then(response => setStudents(response.object?.content || []))
            .finally(() => setLoading(false));
    }, [groupID]);

    const handleScoreChange = (studentId, field, value) => {
        if (field === "score" && (value > 10 || value < 0)) return;
        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };

    const CELL_WIDTH = 250;
    const IZOH_WIDTH = 600;

    const studentColumns = [
        { Header: <span style={{ fontSize: 13 }}>Ism</span>, accessor: "Ism", width: CELL_WIDTH },
        { Header: <span style={{ fontSize: 13 }}>Baho</span>, accessor: "score", width: CELL_WIDTH },
        { Header: <span style={{ fontSize: 13 }}>Izoh</span>, accessor: "info", width: IZOH_WIDTH },
    ];

    const studentRows = students.map((student) => ({
        Ism: (
            <NavLink className={'text-blue-400'} to={`/student-lesson-report/${groupID}/${student?.id}`}>
                <span style={{ fontSize: 13 }}>{student.firstName} {student.lastName}</span>
            </NavLink>
        ),
        score: (
            <SoftInput
                type="number"
                min={0}
                max={10}
                value={scores[student.id]?.score ?? ""}
                onChange={e => handleScoreChange(student.id, "score", Number(e.target.value))}
                style={{ width: CELL_WIDTH - 16, textAlign: "center", fontSize: 13 }}
                inputProps={{ max: 10, min: 0, style: { fontSize: 13 } }}
            />
        ),
        info: (
            <TagSuggestionTextarea
                value={scores[student.id]?.info ?? ""}
                onChange={e => handleScoreChange(student.id, "info", e.target.value)}
                placeholder="Izoh "
                studentId={student.id}
                tags={tags}
                style={{
                    width: IZOH_WIDTH - 16,
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

    const CreatePersonality = async () => {
        try {
            const formatDate = (date) => {
                if (!date) return "";
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };
            const reportArray = students.map(student => {
                const score = scores[student.id]?.score;
                const comment = scores[student.id]?.info;
                if (score === undefined || score === null || score === "") return null;
                return {
                    comment: comment || "",
                    date: reportDate ? formatDate(reportDate) : "",
                    id: 0,
                    lessonId: 0,
                    score: Number(score),
                    studentId: student.id
                };
            }).filter(Boolean);

            if (reportArray.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diqqat!',
                    text: 'Hech bir o‘quvchiga baho kiritilmadi.',
                });
                return;
            }

            const response = await personality.createPersonality(reportArray);

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
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Hisobot yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
            });
        }
    };

    const dataTableSx = {
        "& th, & td": {
            fontSize: "13px",
            padding: "6px 8px",
        },
        "& th[data-sticky='true'], & td[data-sticky='true']": {
            position: "sticky",
            left: 0,
            background: "#f5f7fa",
            zIndex: 2,
            minWidth: CELL_WIDTH,
            maxWidth: CELL_WIDTH,
            whiteSpace: "nowrap",
        },
        "& th:nth-of-type(3), & td:nth-of-type(3)": {
            minWidth: IZOH_WIDTH,
            maxWidth: IZOH_WIDTH,
            width: IZOH_WIDTH,
        },
        "& td[data-sticky='true']": {
            background: "#fff",
            zIndex: 1,
        },
    };

    const customCellProps = (col, colIndex) =>
        col.sticky
            ? { "data-sticky": "true", style: { left: 0, zIndex: 2, background: "#fff", minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH, width: CELL_WIDTH } }
            : col.accessor === "info"
                ? { style: { minWidth: IZOH_WIDTH, maxWidth: IZOH_WIDTH, width: IZOH_WIDTH } }
                : { style: { minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH, width: CELL_WIDTH } };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3} className={'Report'}>
                <Card style={{ margin: "10px 0px", overflow: "visible", padding: "20px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} >
                        <Typography variant="h4" fontWeight="bold" >
                            Shaxsiyati hisobotlari yaratish
                        </Typography>
                        <SoftButton style={{ backgroundColor: '#344767', color: '#fff' }} maxWidth={'100px'} onClick={CreatePersonality} sx={{ height: "40px" }}>
                            + Qo`shish
                        </SoftButton>
                    </SoftBox>
                    <SoftBox style={{ overflow: "visible", width: "100%" }}>
                        {/* Отображение доступных тегов */}

                        <SoftBox display="flex" gap={2} mb={2}>
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
                            <SoftBox flex="1" minWidth="200px">
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}
                                >
                                    Sanani tanlang
                                </SoftTypography>
                                <SoftDatePicker
                                    placeholder="Hisobot sanasi"
                                    value={reportDate}
                                    fullWidth
                                    onChange={setReportDate}
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
                            sx={dataTableSx}
                            customCellProps={customCellProps}
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