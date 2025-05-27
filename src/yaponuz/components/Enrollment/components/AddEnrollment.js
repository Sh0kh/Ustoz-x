import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Switch,
    TextField,
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Users } from "yaponuz/data/api";
import { enrollment } from "yaponuz/data/controllers/enrollment";
import SoftInput from "components/SoftInput";

export default function AddEnrollment({ refetch, courseId }) {
    const [open, setOpen] = React.useState(false);
    const [students, setStudents] = React.useState([]);
    const [formData, setFormData] = React.useState({
        accessAllowed: false,
        completed: false,
        courseId,
        creatorId: localStorage.getItem("userId"),
        studentId: 0,
    });
    const [errors, setErrors] = React.useState({});
    const [search, setSearch] = React.useState({ firstName: "", lastName: "" });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getStudents = async (firstName = "", lastName = "") => {
        try {
            const response = await Users.getUsers(0, 30, firstName, lastName, "", "");
            const content = response?.object?.content || [];
            setStudents(content);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        if (open) getStudents();
    }, [open]);

    const validateForm = () => {
        const validationErrors = {};
        if (!formData.studentId) {
            validationErrors.studentId = "Student selection is required";
        }
        setErrors(validationErrors);
        return validationErrors;
    };

    const showAlert = (response) => {
        const reload = () => refetch();
        if (response.success) {
            Swal.fire("Added", response.message, "success").then(reload);
        } else {
            Swal.fire("Error", response.message || response.error, "error").then(reload);
        }
    };

    const handleSave = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            Swal.fire({
                title: "Validation Error",
                html: Object.values(validationErrors).map((err) => `<p>${err}</p>`).join(""),
                icon: "error",
            });
            return;
        }

        try {
            const loadingSwal = Swal.fire({
                title: "Adding...",
                text: "Please wait!",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await enrollment.createEnrollment(formData);
            loadingSwal.close();
            showAlert(response);
            setOpen(false);
        } catch (err) {
            console.log("Error from handleSave: ", err);
            Swal.fire("Error", "Failed to create enrollment", "error");
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        const updatedSearch = { ...search, [name]: value };
        setSearch(updatedSearch);
        getStudents(updatedSearch.firstName, updatedSearch.lastName);
    };

    return (
        <>
            <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
                + add
            </SoftButton>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Enrollment</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        height: "600px", // 🔒 фиксированная высота
                        overflow: "hidden", // предотвращает скачки
                    }}
                >
                    {/* 🔍 Фильтр */}
                    <SoftBox mb={2} display="flex" gap="10px">
                        <SoftInput
                            fullWidth
                            placeholder="First Name"
                            name="firstName"
                            size="small"
                            value={search.firstName}
                            onChange={handleSearchChange}
                            style={{ marginTop: "8px" }}
                        />
                        <SoftInput
                            fullWidth
                            placeholder="Last Name"
                            name="lastName"
                            size="small"
                            value={search.lastName}
                            style={{ marginTop: "8px" }}
                            onChange={handleSearchChange}
                        />
                    </SoftBox>


                    {/* 👤 Список студентов */}
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: 1,
                            padding: 1,
                        }}
                    >
                        {students.map((student) => (
                            <Grid item xs={12} key={student.id}>
                                <Card
                                    variant={formData.studentId === student.id ? "outlined" : "elevation"}
                                    sx={{
                                        border:
                                            formData.studentId === student.id
                                                ? "2px solid #1976d2"
                                                : "1px solid #ccc",
                                        backgroundColor:
                                            formData.studentId === student.id ? "#f0f8ff" : "white",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setFormData({ ...formData, studentId: student.id })}
                                >
                                    <CardActionArea>
                                        <CardContent sx={{ p: 1 }}>
                                            <SoftTypography variant="body2">
                                                {student.firstName} {student.lastName}
                                            </SoftTypography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                        {errors.studentId && (
                            <Grid item xs={12}>
                                <SoftTypography variant="caption" color="error">
                                    {errors.studentId}
                                </SoftTypography>
                            </Grid>
                        )}
                    </Grid>

                    {/* ✅ Switch-поля */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <SoftTypography variant="subtitle2">Access Allowed</SoftTypography>
                            <Switch
                                checked={formData.accessAllowed}
                                onChange={(e) =>
                                    setFormData({ ...formData, accessAllowed: e.target.checked })
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <SoftTypography variant="subtitle2">Completed</SoftTypography>
                            <Switch
                                checked={formData.completed}
                                onChange={(e) =>
                                    setFormData({ ...formData, completed: e.target.checked })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Add Enrollment
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

AddEnrollment.propTypes = {
    refetch: PropTypes.func,
    courseId: PropTypes.number,
};
