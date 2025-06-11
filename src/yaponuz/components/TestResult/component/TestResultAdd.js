import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Loader, Frown } from "lucide-react";
import { NavLink } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";
import { testResult } from "yaponuz/data/controllers/testResult";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

/**
 * Страница для добавления новых тестовых результатов
 */
export default function TestResultAdd() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [groupID, setGroupID] = useState(null);
    const [GroupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [scores, setScores] = useState({});
    const [errors, setErrors] = useState({ title: '', scores: {} });

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

    const getStudents = async () => {
        if (!groupID) return;
        setLoading(true);
        setNoGroupSelected(false);
        try {
            const response = await Users.getUsersAttendance(0, 100, "", "", "", groupID);
            setStudents(response.object?.content || []);
            const initialScores = response.object?.content.reduce((acc, student) => {
                acc[student.id] = student.Score || "";
                return acc;
            }, {});
            setScores(initialScores);
            setErrors({ title: '', scores: {} });
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupID) {
            getStudents();
        } else {
            setStudents([]);
            setScores({});
            setErrors({ title: '', scores: {} });
        }
    }, [groupID]);

    useEffect(() => {
        getAllGroups();
    }, []);

    const validateTitle = (value) => {
        if (!value.trim()) {
            setErrors((prev) => ({ ...prev, title: "Title is required" }));
            return false;
        }
        if (value.trim().length < 3) {
            setErrors((prev) => ({ ...prev, title: "Title must be at least 3 characters" }));
            return false;
        }
        setErrors((prev) => ({ ...prev, title: "" }));
        return true;
    };

    const validateScore = (id, value) => {
        if (value === "" || value === null) {
            return true;
        }
        const numValue = Number(value);
        if (isNaN(numValue)) {
            setErrors((prev) => ({
                ...prev,
                scores: { ...prev.scores, [id]: "Must be a number" },
            }));
            return false;
        }
        if (numValue < 0 || numValue > 10) {
            setErrors((prev) => ({
                ...prev,
                scores: { ...prev.scores, [id]: "Score should be between 0 and 10" },
            }));
            return false;
        }
        setErrors((prev) => {
            const updatedScoreErrors = { ...prev.scores };
            delete updatedScoreErrors[id];
            return { ...prev, scores: updatedScoreErrors };
        });
        return true;
    };

    const handleScoreChange = (id, value) => {
        if (value !== "") {
            validateScore(id, value);
        } else {
            setErrors((prev) => {
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

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        validateTitle(value);
    };

    const handleSubmitResults = async () => {
        const isTitleValid = validateTitle(title);
        let areScoresValid = true;
        for (const [id, score] of Object.entries(scores)) {
            if (score !== "" && score !== null) {
                if (!validateScore(id, score)) {
                    areScoresValid = false;
                }
            }
        }
        const hasScores = Object.values(scores).some(
            (score) => score !== "" && score !== null
        );
        if (!hasScores) {
            Swal.fire({
                icon: "warning",
                title: "No Scores Entered",
                text: "Please enter at least one student score",
            });
            return;
        }
        if (!isTitleValid || !areScoresValid) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please correct all errors before submitting",
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
            const studentScore = {};
            Object.entries(scores).forEach(([id, score]) => {
                if (score !== "" && score !== null) {
                    studentScore[id] = Number(score);
                }
            });
            const formattedDate =
                date instanceof Date && !isNaN(date)
                    ? date.toISOString().split("T")[0]
                    : null;
            const data = {
                date: formattedDate,
                studentScore: studentScore || {},
                title: typeof title === "string" ? title.trim() : "",
            };
            await testResult.createTestResult(data);
            loadingSwal.close();
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Test results have been saved for ${Object.keys(studentScore).length} students.`,
                timer: 2000,
                showConfirmButton: false,
            });
            setTitle("");
            setDate(new Date());
            const resetScores = students.reduce((acc, student) => {
                acc[student.id] = "";
                return acc;
            }, {});
            setScores(resetScores);
            setErrors({ title: "", scores: {} });
        } catch (err) {
            console.error("Error submitting test results:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save test results. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const studentColumns = [
        { Header: "Ism", accessor: "name" },
        { Header: "Familiya", accessor: "lastName" },
        { Header: "Ball", accessor: "score" },
    ];
    const studentRows = students.map((student) => ({
        id: student.id,
        name: (
            <NavLink
                className={"text-blue-400"}
                to={`/student/test-result/${student?.id}`}
            >
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
                        max: 10,
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
        ),
    }));
    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

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
                            Natijalari qo‘shish
                        </Typography>
                        <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
                            <Grid item xs={12} md={6} minWidth={'400px'}>
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
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <SoftInput
                                        placeholder="Sarlavha"
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
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <SoftDatePicker
                                        placeholder="Test sanasi"
                                        value={date}
                                        fullWidth
                                        onChange={(newDate) => setDate(newDate)}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                >
                                    <SoftButton
                                        fullWidth
                                        style={{ backgroundColor: '#344767', color: '#fff' }}
                                        onClick={handleSubmitResults}
                                        disabled={submitting}
                                        sx={{ height: 40, fontWeight: "bold", fontSize: 12 }}
                                    >
                                        {submitting
                                            ? "Saqlanmoqda..."
                                            : "+ Qo‘shish"}
                                    </SoftButton>
                                </Grid>
                            </Grid>
                        </SoftBox>
                    </Card>
                    {noGroupSelected ? (
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            minHeight={200}
                            mt={4}
                        >
                            <Icon sx={{ fontSize: 60, color: "#bdbdbd" }}>group</Icon>
                            <Typography variant="h6" color="text.secondary" mt={2}>
                                Iltimos, guruhni tanlang
                            </Typography>
                        </SoftBox>
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
                    ) : students.length !== 0 ? (
                        <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 1 }}>
                            <SoftBox p={2}>
                                <DataTable
                                    table={studentTableData}
                                    entriesPerPage={{
                                        defaultValue: 20,
                                        entries: [5, 10, 15, 20],
                                    }}
                                    canSearch
                                />
                            </SoftBox>
                        </Card>
                    ) : (
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