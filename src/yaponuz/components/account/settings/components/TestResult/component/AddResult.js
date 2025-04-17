import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import Swal from "sweetalert2";
import { FileController } from "yaponuz/data/api";
import { useParams } from "react-router-dom";
import { report } from "yaponuz/data/api";
import { testResult } from "yaponuz/data/controllers/testResult";


export default function AddResult({ refetch }) {
    const { ID } = useParams()
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [score, setScore] = useState('')
    const [date, setDate] = useState('')




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

    const handleSave = async () => {
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
            const data = { studentId: ID, title, date, score };
            const response = await testResult?.createTestResult(data);
            loadingSwal.close();

            showAlert(response);

            // clear the data
            setTitle('')
            setScore('')
            setDate('')



            // close the modal
            setOpen(false);
        } catch (err) {

        }
    };







    const my = { margin: "5px 0px" };

    return (
        <>
            <SoftButton onClick={() => setOpen(true)} variant="gradient" color='dark'>
                + add new result
            </SoftButton>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '70%',
                        height: '50vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Add new result
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <SoftBox width='100%'>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Title
                                </SoftTypography>
                                <SoftInput
                                    placeholder="Enter the title"
                                    value={title}
                                    style={my}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </SoftBox>
                            <SoftBox width='100%'>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Score
                                </SoftTypography>
                                <SoftInput
                                    type={'number'}
                                    placeholder="Enter the score"
                                    value={score}
                                    style={my}
                                    onChange={(e) => setScore(e.target.value)}
                                />
                            </SoftBox>
                            <SoftBox width='100%'>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Date
                                </SoftTypography>
                                <SoftInput
                                    type={'date'}
                                    placeholder="Enter the Date"
                                    value={date}
                                    style={my}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </SoftBox>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Add report</Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
AddResult.propTypes = {
    refetch: PropTypes.func.isRequired,
};