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
import { report } from "yaponuz/data/api";
import Swal from "sweetalert2";
import { Frown, Loader } from "lucide-react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SoftButton from "components/SoftButton";
import { NavLink } from "react-router-dom";

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
            setHistoryResults(response.object?.content || []);
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

    // DataTable для истории
    const historyTableColumns = [
        { Header: <span style={{ fontSize: 13 }}>O‘quvchi</span>, accessor: "studentName" },
        { Header: <span style={{ fontSize: 13 }}>Turi</span>, accessor: "reportType" },
        { Header: <span style={{ fontSize: 13 }}>Izoh</span>, accessor: "context" },
        { Header: <span style={{ fontSize: 13 }}>Sarlavha</span>, accessor: "title" },
    ];

    // Перевод типа отчета
    const reportTypeUz = {
        RECOMMENDATION: "Tavsiya",
        REPORT: "Hisobot"
    };

    // Формируем строки истории
    const historyTableRows = historyResults.map(item => ({
        studentName: item.student ? `${item.student.firstName} ${item.student.lastName}` : "",
        reportType: reportTypeUz[item.reportType] || item.reportType,
        context: item.context,
        title: item.title,
    }));

    const historyTableData = {
        columns: historyTableColumns,
        rows: historyTableRows,
    };

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
                        <DataTable
                            table={historyTableData}
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
                                <p className="uppercase font-semibold">Natijalar topilmadi</p>
                                <p className="text-sm text-gray-700">Boshqa guruh yoki sanani tanlab ko‘ring</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}