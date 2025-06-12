import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import SoftBadge from "components/SoftBadge";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { report } from "yaponuz/data/api";
import Swal from "sweetalert2";
import { Frown, Loader } from "lucide-react";
import { Typography, Box as MuiBox } from "@mui/material";
import Box from "@mui/material/Box";
import SoftButton from "components/SoftButton";
import { NavLink } from "react-router-dom";

// Матрица истории
function getHistoryMatrixTable(historyResults) {
    const dateSet = new Set();
    const studentMap = {};

    historyResults.forEach(item => {
        const date = item.createdAt.split('T')[0]; // Extract date part from createdAt
        dateSet.add(date);
        const sid = item.studentId;
        if (!studentMap[sid]) {
            studentMap[sid] = {
                fullName: (item.student?.firstName || "") + " " + (item.student?.lastName || ""),
                records: {},
            };
        }
        if (!studentMap[sid].records[date]) {
            studentMap[sid].records[date] = [];
        }
        studentMap[sid].records[date].push({
            type: item.reportType,
            context: item.context,
            title: item.title
        });
    });

    const dates = Array.from(dateSet).sort();
    const columns = [
        {
            Header: <span className="static top-0 left-0" style={{ fontSize: 13 }}>O‘quvchi</span>,
            accessor: "fullName",
            sticky: true,
            width: 170,
        },
        ...dates.map(date => ({
            Header: <span style={{ fontSize: 13 }}>{date}</span>,
            accessor: date,
            align: "center",
            width: 170,
        })),
    ];

    const rows = Object.entries(studentMap).map(([sid, st]) => {
        const row = { fullName: st.fullName.trim() ? st.fullName : `ID:${sid}` };
        dates.forEach(date => {
            const reports = st.records[date] || [];
            row[date] = (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    {reports.length > 0
                        ? reports.map((report, idx) => (
                            <Box key={idx} sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 1 }}>
                                <SoftBadge
                                    color={report.type === 'RECOMMENDATION' ? 'success' : 'info'}
                                    variant="gradient"
                                    size="sm"
                                    sx={{ minWidth: 100, fontSize: 11, px: 0.7, py: 0.2 }}
                                >
                                    {report.type === 'RECOMMENDATION' ? 'Tavsiya' : 'Hisobot'}
                                </SoftBadge>
                                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: 12 }}>
                                    {report.title}
                                </Typography>
                                {report.context && (
                                    <Typography variant="caption" sx={{ color: "#555", fontSize: 11 }}>
                                        {report.context}
                                    </Typography>
                                )}
                            </Box>
                        ))
                        : <Box sx={{ color: "#bdbdbd", fontSize: 13 }}>—</Box>
                    }
                </Box>
            );
        });
        return row;
    });

    return { columns, rows };
}

export default function LessonReportHistoryPage() {
    const [GroupOptions, setGroupOptions] = useState([]);
    const [groupID, setGroupID] = useState(null);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);

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

    useEffect(() => {
        getAllGroups(page, size);
    }, [page, size]);

    // История
    const handleSearchHistory = async () => {
        try {
            setLoading(true);
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
            setHistoryResults(response.object || []);
        } catch (error) {
            console.error("Tarixni qidirishda xatolik:", error);
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Tarixni olishda xatolik yuz berdi.',
            });
        } finally {
            setLoading(false);
        }
    };

    const historyMatrixTable = getHistoryMatrixTable(historyResults);

    const dataTableSx = {
        "& th, & td": {
            fontSize: "13px",
            padding: "6px 18px",
            minWidth: 120,
            whiteSpace: "nowrap",
        },
        "& th[data-sticky='true'], & td[data-sticky='true']": {
            position: "sticky",
            left: 0,
            background: "#f5f7fa",
            zIndex: 2,
            minWidth: 170,
            maxWidth: 240,
            whiteSpace: "nowrap",
        },
        "& td[data-sticky='true']": {
            background: "#fff",
            zIndex: 1,
        },
    };

    const customCellProps = col =>
        col.sticky
            ? { "data-sticky": "true", style: { left: 0, zIndex: 2, background: "#fff", minWidth: 170, maxWidth: 240 } }
            : { style: { minWidth: 120, maxWidth: 350 } };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px", overflow: "visible", padding: "20px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" >
                        <Typography variant="h4" fontWeight="bold" >
                            Hisobotlar tarixi
                        </Typography>
                        <NavLink to={"/report/create"} >
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
                    ) : loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, iltimos kuting</p>
                        </div>
                    ) : historyResults.length > 0 ? (
                        <Box
                            sx={{
                                overflowX: "auto",
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
                                sx={dataTableSx}
                                customCellProps={customCellProps}
                            />
                        </Box>
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">Natijalar topilmadi</p>
                                <p className="text-sm text-gray-700">Boshqa guruh yoki sanani tanlab ko`ring</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}