import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Icon from "@mui/material/Icon";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Frown, Loader } from "lucide-react";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import { testResult } from "yaponuz/data/controllers/testResult";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import { NavLink } from "react-router-dom";

/**
 * История результатов тестов через DataTable
 */
function getTableData(data) {
    if (!data || !data.length) {
        return { columns: [], rows: [] };
    }

    // Собираем все уникальные даты
    const datesSet = new Set();
    const studentsMap = {};

    data.forEach((item) => {
        const studentId = item.student.id;
        const date = item.date;
        datesSet.add(date);
        if (!studentsMap[studentId]) {
            studentsMap[studentId] = {
                id: studentId,
                fullName: `${item.student.firstName} ${item.student.lastName}`,
                scores: {},
            };
        }
        studentsMap[studentId].scores[date] = item.score;
    });

    const dates = Array.from(datesSet).sort();
    const columns = [
        { Header: "Ism Familiya", accessor: "fullName" },
        ...dates.map((date) => ({
            Header: date,
            accessor: date,
            align: "center",
        })),
    ];

    const rows = Object.values(studentsMap).map((student) => {
        const row = {
            fullName: student.fullName,
        };
        dates.forEach((date) => {
            row[date] =
                student.scores[date] !== undefined
                    ? (
                        <Box
                            sx={{
                                bgcolor: "#e3f2fd",
                                borderRadius: 1,
                                px: 1.5,
                                py: 0.5,
                                display: "inline-block",
                                minWidth: 32,
                                fontWeight: 600,
                                color: "#1976d2",
                            }}
                        >
                            {student.scores[date]}
                        </Box>
                    )
                    : (
                        <Box sx={{ color: "#bdbdbd" }}>—</Box>
                    );
        });
        return row;
    });

    return { columns, rows };
}

function TestResultHistory({ results }) {
    if (!results || !results.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                <Typography color="text.secondary">Natijalar topilmadi</Typography>
            </Box>
        );
    }
    const table = getTableData(results);

    return (
        <Card sx={{ p: 2, mt: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Test natijalari tarixi
            </Typography>
            <Box sx={{ borderRadius: 2, maxHeight: 600, background: "#fff" }}>
                <DataTable
                    table={table}
                    entriesPerPage={{
                        defaultValue: 20,
                        entries: [5, 10, 15, 20, 50],
                    }}
                    canSearch
                    showTotalEntries={false}
                    noEndBorder
                    sx={{ minWidth: 400 }}
                />
            </Box>
        </Card>
    );
}
TestResultHistory.propTypes = {
    results: PropTypes.array.isRequired,
};

export default function TestResultHistoryPage() {
    const [GroupOptions, setGroupOptions] = useState([]);
    const [groupID, setGroupID] = useState(null);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        // Получаем следующий месяц и устанавливаем день 0, что дает последний день текущего месяца
        return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    });
    const [testResultsHistory, setTestResultsHistory] = useState([]);

    const getAllGroups = async () => {
        try {
            const response = await Group.getMyGroups(0, 100);
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

    const getAllTestResults = async ({ groupId, startDate, endDate }) => {
        setLoading(true);
        try {
            const response = await testResult.getTestResultByID({
                groupId,
                startDate,
                endDate,
            });
            if (response.success) {
                setTestResultsHistory(response.object?.content || []);
            } else {
                setTestResultsHistory([]);
                console.error("Failed to fetch test results:", response.message);
            }
        } catch (error) {
            setTestResultsHistory([]);
            console.error("Error fetching test results: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGroups();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox mb={5}>
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
                        <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4" fontWeight="bold" mb={3}>
                                Test natijalari tarixi
                            </Typography>
                            <NavLink to={"/test-result/create"} >
                                <SoftButton style={{ backgroundColor: '#344767', color: '#fff' }}>
                                    Natija qoshish
                                </SoftButton>
                            </NavLink>
                        </SoftBox>
                        <SoftBox display="flex" alignItems='end' justifyContent="space-between" gap={1} mb={2}>
                            <Grid item xs={12} md={6} minWidth={'400px'} fullWidth>
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="medium"
                                    sx={{ mb: 1 }}
                                >
                                    Guruh tanlang
                                </SoftTypography>
                                <SoftSelect
                                    placeholder="Guruh tanlang"
                                    options={GroupOptions}
                                    value={GroupOptions.find((opt) => opt.value === groupID) || null}
                                    onChange={(e) => {
                                        setGroupID(e.value);
                                        setNoGroupSelected(false);
                                    }}
                                    fullWidth
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        menu: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                            </Grid>
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
                            <SoftButton
                                style={{ backgroundColor: '#344767', color: '#fff' }}
                                sx={{ height: "40px" }}
                                onClick={() =>
                                    getAllTestResults({
                                        groupId: groupID,
                                        startDate: startDate
                                            ? new Date(startDate).toISOString().split("T")[0]
                                            : "",
                                        endDate: endDate
                                            ? new Date(endDate).toISOString().split("T")[0]
                                            : "",
                                    })
                                }
                            >
                                Izlash
                            </SoftButton>
                        </SoftBox>
                    </Card>
                    {noGroupSelected ? (

                        <Card
                            style={{ margin: "10px 0px" }}
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                background: "#f5f7fa",
                                overflow: "visible",
                            }}>
                            <div className="flex flex-col gap-y-4 items-center justify-center min-h-80">
                                <p className="uppercase font-semibold">Iltimos, guruhni tanlang</p>
                            </div>
                        </Card>
                    ) : loading ? (
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            minHeight={200}
                            mt={4}
                        >
                            <Loader className="animate-spin ml-2 size-10" />
                            <Typography variant="body1" color="text.secondary" mt={2}>
                                Yuklanmoqda, iltimos kuting
                            </Typography>
                        </SoftBox>
                    ) : testResultsHistory.length !== 0 ? (
                        <TestResultHistory results={testResultsHistory} />
                    ) : (
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
                            <SoftBox
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                minHeight={200}
                                mt={4}
                            >
                                <Frown className="size-20" />
                                <Typography variant="h6" color="text.secondary" mt={2}>
                                    Natijalar topilmadi
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Boshqa guruh yoki sanani tanlab ko‘ring
                                </Typography>
                            </SoftBox>
                        </Card>
                    )}
                </SoftBox>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}