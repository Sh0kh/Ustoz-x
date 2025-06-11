import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { personality } from "yaponuz/data/controllers/personality";
import { Frown, Loader } from "lucide-react";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import SoftButton from "components/SoftButton";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function PersonalityHistoryPage() {
    const [GroupOptions, setGroupOptions] = useState([]);
    const [groupID, setGroupID] = useState(null);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [page] = useState(0);
    const [size] = useState(100);

    // Установка начальной даты на начало текущего месяца
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    // Установка конечной даты на конец текущего дня
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    });
    const [historyResults, setHistoryResults] = useState([]);
    const CELL_WIDTH = 250;
    const IZOH_WIDTH = 600;

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
                <Card style={{ margin: "10px 0px", overflow: "visible", padding: "20px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" >
                        <Typography variant="h4" fontWeight="bold" >
                            Shaxsiyati hisobotlari tarixi
                        </Typography>
                        <NavLink to={"/personality/create"} >
                            <SoftButton style={{ backgroundColor: '#344767', color: '#fff' }}>
                                Hisobot qoshish
                            </SoftButton>
                        </NavLink>
                    </SoftBox>
                    <SoftBox style={{ overflow: "visible", width: "100%" }}>
                        <SoftBox display="flex" gap={2} mt={2} >
                            <SoftBox flex="1" minWidth="400px">
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
                                        setNoGroupSelected(false);
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
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}
                                >
                                    Tugash sanasi
                                </SoftTypography>
                                <SoftDatePicker
                                    placeholder="Tugash sanasi"
                                    value={endDate}
                                    fullWidth
                                    onChange={setEndDate}
                                />
                            </SoftBox>
                            <SoftBox flex="1" maxWidth="100px" display="flex" alignItems="flex-end">
                                <SoftButton
                                    style={{ backgroundColor: '#344767', color: '#fff' }}
                                    fullWidth onClick={handleSearchHistory} sx={{ height: "40px" }}>
                                    Izlash
                                </SoftButton>
                            </SoftBox>
                        </SoftBox>
                    </SoftBox>
                </Card>
                <Card style={{ margin: "10px 0px" }}>
                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Iltimos, guruhni tanlang</p>
                        </div>
                    ) : (
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
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}