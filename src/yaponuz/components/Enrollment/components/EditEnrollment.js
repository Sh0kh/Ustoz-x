import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Icon,
    Switch,
    Tooltip,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { report } from "yaponuz/data/api";
import { Users } from "yaponuz/data/api";
import { enrollment } from "yaponuz/data/controllers/enrollment";

export default function EditEnrollment({ item, refetch, students = [] }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        accessAllowed: false,
        completed: false,
        courseId: null,
        creatorId: localStorage.getItem("userId"),
        studentId: null,
    });

    useEffect(() => {
        if (item) {
            setFormData({
                accessAllowed: item?.accessAllowed || false,
                completed: item?.completed || false,
                courseId: item.courseId || null,
                creatorId: item.creatorId || localStorage.getItem("userId"),
                studentId: item.studentId || (item.student ? item.student.id : null),
            });
        }
    }, [item]);

    const handleClose = () => {
        setOpen(false);
    };


    const showAlert = (response) => {
        refetch();
        if (response.success) {
            Swal.fire("Updated!", response.message, "success");
        } else {
            Swal.fire("Error", response.message || response.error, "error");
        }
    };

    const handleSave = async () => {
        try {
            const loadingSwal = Swal.fire({
                title: "Updating...",
                text: "Please wait",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const data = {
                id: item.id,
                studentId: formData.studentId,
                courseId: formData.courseId,
                accessAllowed: formData.accessAllowed,
                completed: formData.completed,
                creatorId: formData.creatorId,
            };

            const response = await enrollment.updateEnrollment(data);
            loadingSwal.close();
            showAlert(response);
            setOpen(false);
        } catch (err) {
            console.error("Error while updating enrollment:", err);
        }
    };

    // Находим выбранного студента (может быть из item.student или из списка students)
    const selectedStudent = students.find((s) => s.id === formData.studentId) ||
        (item && item.student ? item.student : null);

    // Создаем опцию для текущего выбранного студента
    const getSelectedOption = () => {
        if (!formData.studentId) return null;

        const student = students.find(s => s.id === formData.studentId) ||
            (item && item.student && item.student.id === formData.studentId ? item.student : null);

        if (student) {
            return {
                label: `${student.firstName} ${student.lastName}`,
                value: student.id,
            };
        }
        return null;
    };

    return (
        <>
            <SoftTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => setOpen(true)}
            >
                <Tooltip title="Edit" placement="top">
                    <Icon>edit</Icon>
                </Tooltip>
            </SoftTypography>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Enrollment</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <SoftBox>
                                <SoftTypography variant="subtitle2">Select Student</SoftTypography>

                                {selectedStudent && (
                                    <SoftTypography variant="body2" color="text" sx={{ mb: 1 }}>
                                        Current Student: {selectedStudent.firstName} {selectedStudent.lastName}
                                    </SoftTypography>
                                )}

                                <SoftSelect
                                    placeholder="Select student"
                                    value={getSelectedOption()}
                                    options={students.map((s) => ({
                                        label: `${s.firstName} ${s.lastName}`,
                                        value: s.id,
                                    }))}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, studentId: selected ? selected.value : null }))
                                    }
                                />
                            </SoftBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <SoftBox>
                                <SoftTypography variant="subtitle2">Access Allowed</SoftTypography>
                                <Switch
                                    checked={formData.accessAllowed}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            accessAllowed: e.target.checked,
                                        }))
                                    }
                                />
                            </SoftBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <SoftBox>
                                <SoftTypography variant="subtitle2">Completed</SoftTypography>
                                <Switch
                                    checked={formData.completed}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            completed: e.target.checked,
                                        }))
                                    }
                                />
                            </SoftBox>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

EditEnrollment.propTypes = {
    refetch: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    students: PropTypes.array,
};