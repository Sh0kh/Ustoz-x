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
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Users } from "yaponuz/data/api";
import { personality } from "yaponuz/data/controllers/personality";
import { Frown, Loader } from "lucide-react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";

export default function LessonReport() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupID, setGroupID] = useState(null);
    const [GroupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);

    const [selectedAction, setSelectedAction] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportDate, setReportDate] = useState(null);

    const [scores, setScores] = useState({});
    const [historyResults, setHistoryResults] = useState([]);

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
    }, [page, size, groupID]);

    // Получение студентов
    useEffect(() => {
        if (!groupID) {
            setStudents([]);
            return;
        }
        setLoading(true);
        setNoGroupSelected(false);
        Users.getUsersAttendance(0, 100, "", "", "", groupID)
            .then(response => setStudents(response.object?.content || []))
            .finally(() => setLoading(false));
    }, [groupID]);

    // Обработка изменения баллов или комментариев
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

    // DataTable columns и rows для ввода
    const CELL_WIDTH = 250;
    const IZOH_WIDTH = 600; // ширина для Izoh textarea

    const studentColumns = [
        { Header: <span style={{ fontSize: 13 }}>Ism</span>, accessor: "Ism", width: CELL_WIDTH },
        { Header: <span style={{ fontSize: 13 }}>Baho</span>, accessor: "score", width: CELL_WIDTH },
        { Header: <span style={{ fontSize: 13 }}>Izoh</span>, accessor: "info", width: IZOH_WIDTH },
    ];

    // Используем textarea для Izoh
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
            <SoftInput
                multiline
                minRows={3}
                maxRows={8}
                value={scores[student.id]?.info ?? ""}
                onChange={e => handleScoreChange(student.id, "info", e.target.value)}
                style={{
                    width: IZOH_WIDTH - 16,
                    fontSize: 13,
                    resize: "vertical",
                    minHeight: 38,
                    maxHeight: 180,
                    padding: "8px 10px"
                }}
                inputProps={{ style: { fontSize: 13 } }}
                placeholder="Izoh"
            />
        ),
    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

    // ===== История-матрица =====
    function getHistoryMatrixTable(historyResults) {
        const dateSet = new Set();
        const studentMap = {};
        historyResults.forEach(item => {
            dateSet.add(item.date);
            const sid = item.studentId;
            if (!studentMap[sid]) {
                studentMap[sid] = {
                    fullName: (item.student?.firstName || "") + " " + (item.student?.lastName || ""),
                    records: {},
                };
            }
            studentMap[sid].records[item.date] = {
                score: item.score,
                comment: item.comment,
            };
        });
        const dates = Array.from(dateSet).sort();
        const columns = [
            { Header: <span style={{ fontSize: 13 }}>O‘quvchi</span>, accessor: "fullName", sticky: true, width: CELL_WIDTH },
            ...dates.map(date => ({
                Header: <span style={{ fontSize: 13 }}>{date}</span>,
                accessor: date,
                align: "center",
                width: CELL_WIDTH,
            })),
        ];
        const rows = Object.entries(studentMap).map(([sid, st]) => {
            const row = { fullName: st.fullName.trim() ? st.fullName : `ID:${sid}` };
            dates.forEach(date => {
                const cell = st.records[date];
                row[date] = cell
                    ? (
                        <Box sx={{ fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, color: "#1976d2" }}>{cell.score ?? ""}</span>
                            <span style={{ color: "#607d8b", fontSize: 12 }}>{cell.comment ?? ""}</span>
                        </Box>
                    )
                    : <Box sx={{ color: "#bdbdbd", fontSize: 13 }}>—</Box>;
            });
            return row;
        });
        return { columns, rows };
    }
    const historyMatrixTable = getHistoryMatrixTable(historyResults);

    // История поиск
    const handleSearchHistory = async () => {
        try {
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
            const response = await personality.getPersonalityByDate(data);
            setHistoryResults(response.object?.content || []);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Tarixni olishda xatolik yuz berdi.',
            });
        }
    };

    // Отправка отчета
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
                    text: response.message || 'Baholarni saqlашда xatolik yuz berdi.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Hisobot yaratishda xatolik yuz berdi. Iltimos, qayта urinib ko‘ring.',
            });
        }
    };

    // Стили для sticky первой колонки
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
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px", overflow: "visible" }}>
                    <SoftBox p={3} style={{ overflow: "visible", width: "100%" }}>
                        <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            gap={2}
                            flexWrap="wrap"
                            mb={2}
                        >
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
                                    }}
                                    placeholder="Amalni tanlang"
                                />
                            </SoftBox>
                            {selectedAction && (
                                <SoftBox flex="1" minWidth="200px">
                                    <SoftSelect
                                        fullWidth
                                        options={GroupOptions}
                                        value={GroupOptions.find(opt => opt.value === groupID) || null}
                                        onChange={e => {
                                            setGroupID(e.value);
                                        }}
                                        placeholder="Guruhni tanlang"
                                        isDisabled={!selectedAction}
                                    />
                                </SoftBox>
                            )}
                        </SoftBox>
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
                        {selectedAction === "grading" && groupID && (
                            <SoftBox flex="1" minWidth="200px" mb={2}>
                                <SoftDatePicker
                                    placeholder="Hisobot sanasi"
                                    value={reportDate}
                                    fullWidth
                                    onChange={setReportDate}
                                />
                            </SoftBox>
                        )}

                        <SoftBox display="flex" justifyContent="flex-start" minWidth="200px">
                            {selectedAction === "grading" ? (
                                <SoftButton fullWidth onClick={CreatePersonality} sx={{ height: "40px" }}>
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
                        <Box
                            sx={{
                                overflow: "auto",
                                width: "100%",
                                maxHeight: 550,
                                borderRadius: 2,
                            }}
                        >
                            <DataTable
                                table={historyMatrixTable}
                                entriesPerPage={{
                                    defaultValue: 20,
                                    entries: [5, 10, 15, 20],
                                }}
                                canSearch
                                sx={dataTableSx}
                                customCellProps={customCellProps}
                            />
                        </Box>
                    ) : students.length !== 0 && selectedAction === "grading" ? (
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