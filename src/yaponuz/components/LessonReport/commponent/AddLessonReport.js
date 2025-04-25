import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { personality } from "yaponuz/data/controllers/personality";
import SoftDatePicker from "components/SoftDatePicker";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { lessonReport } from "yaponuz/data/controllers/lessonReport";

export default function AddLessonReport({ refetch }) {
    const { groupID, studentID } = useParams()
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState('');
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [scores, setScores] = useState([{ description: '', score: '' }]);

    const addScoreField = () => {
        setScores([...scores, { description: '', score: '' }]);
    };

    const removeScoreField = (index) => {
        const newScores = scores.filter((_, i) => i !== index);
        setScores(newScores);
    };

    const updateScoreField = (index, field, value) => {
        const newScores = [...scores];
        newScores[index][field] = value;
        setScores(newScores);
    };

    const showAlert = (response) => {
        function reload() {
            refetch();
        }
        if (response.success) {
            Swal.fire("Added", response.message, "success").then(() => reload());
        } else {
            Swal.fire("error", response.message || response.error, "error").then(() => reload());
        }
    };

    const validateForm = () => {
        // Check if date is selected
        if (!date) {
            setError("Please select a date");
            return false;
        }

        // Check if at least one score is provided and all fields are filled
        if (scores.length === 0) {
            setError("Please add at least one score");
            return false;
        }

        for (let i = 0; i < scores.length; i++) {
            if (scores[i].description.trim() === '' || scores[i].score === '') {
                setError(`Please fill in all details for score entry ${i + 1}`);
                return false;
            }
        }

        setError("");
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
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

            // Format the date properly - convert from array to string if needed
            let formattedDate = date;
            if (Array.isArray(date)) {
                formattedDate = date[0]; // Take the first element from the array
            }

            // Format the scores array to match the expected backend format
            const formattedScores = scores.map(item => ({
                description: item.description,
                score: Number(item.score)
            }));

            const data = {
                studentId: Number(studentID),
                groupId: Number(groupID), // You might need to adjust this
                reportDate: formattedDate,
                scores: formattedScores
            };

            const response = await lessonReport.createLessonReport(data);
            loadingSwal.close();

            showAlert(response);

            // clear the data
            resetForm();

            // close the modal
            setOpen(false);
        } catch (err) {
            console.error("Error saving report:", err);
            Swal.fire("Error", "Failed to save report. Please try again.", "error");
        }
    };

    const resetForm = () => {
        setScores([{ description: '', score: '' }]);
        setInfo('');
        setDate('');
        setError('');
    };

    const my = { margin: "5px 0px" };

    return (
        <>
            <SoftButton onClick={() => setOpen(true)} variant="gradient" color='dark'>
                + Add New Personality Report
            </SoftButton>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '70%',
                        height: '80vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Add New Lesson Report
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                    Date
                                </SoftTypography>
                                <SoftDatePicker
                                    placeholder="Select Date"
                                    value={date}
                                    fullWidth
                                    onChange={(newDate) => setDate(newDate)}
                                />
                            </Grid>

                            <SoftBox width='100%' sx={{ mt: 3 }}>
                                <SoftTypography variant="h6" fontWeight="medium">
                                    Scores
                                </SoftTypography>

                                {scores.map((scoreItem, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mt: 1, mb: 2, alignItems: "   " }}>
                                        <Grid item xs={7}>
                                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                Description
                                            </SoftTypography>
                                            <SoftInput
                                                placeholder="Enter description"
                                                value={scoreItem.description}
                                                onChange={(e) => updateScoreField(index, 'description', e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                Score
                                            </SoftTypography>
                                            <SoftInput
                                                placeholder="Score"
                                                value={scoreItem.score}
                                                type='number'
                                                onChange={(e) => updateScoreField(index, 'score', e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeScoreField(index)}
                                                disabled={scores.length === 1}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                                <SoftButton
                                    variant="outlined"
                                    color="info"
                                    startIcon={<AddIcon />}
                                    onClick={addScoreField}
                                    sx={{ mt: 1 }}
                                    fullWidth
                                >
                                    Add Another Score
                                </SoftButton>
                            </SoftBox>

                            {error && (
                                <SoftBox style={my}>
                                    <SoftTypography color="error" fontSize="0.75rem">
                                        {error}
                                    </SoftTypography>
                                </SoftBox>
                            )}

                            <DialogActions sx={{ mt: 2 }}>
                                <Button onClick={() => setOpen(false)}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    Save Report
                                </Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

AddLessonReport.propTypes = {
    refetch: PropTypes.func.isRequired,
};