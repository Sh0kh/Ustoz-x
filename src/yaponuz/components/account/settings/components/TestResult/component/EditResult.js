import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { testResult } from "yaponuz/data/controllers/testResult";

export default function EditResult({ item, refetch }) {
    const { ID } = useParams()
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [score, setScore] = useState('')
    const [date, setDate] = useState('')
    const my = { margin: "5px 0px" };





    useEffect(() => {
        if (item) {
            setTitle(item?.title)
            setScore(item?.score)
            setDate(item?.date)
        }
    }, [item]);

    const showAlert = (response) => {
        function reload() {
            refetch();
        }
        if (response.success) {
            Swal.fire("Update", response.message, "success").then(() => reload());
        } else {
            Swal.fire("error", response.message || response.error, "error").then(() => reload());
        }
    };

    const handleSave = async () => {
        try {
            const loadingSwal = Swal.fire({
                title: "Updating...",
                text: "Please Wait!",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const data = { id: item.id, studentId: ID, title, date, score };
            const response = await testResult.EditResult(data);
            loadingSwal.close();

            showAlert(response);

            setOpen(false);
        } catch (err) {
            console.log("Error from handleSave from add Group: ", err);
        }
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
                    Edit result
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
                                <Button onClick={handleSave}>Edit report</Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

EditResult.propTypes = {
    refetch: PropTypes.func.isRequired,
    item: PropTypes.array.isRequired
};