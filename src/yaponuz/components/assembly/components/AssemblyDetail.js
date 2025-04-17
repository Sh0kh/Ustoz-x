import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import { useState } from "react";

export default function AssemblyDetail({ item }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SoftTypography
                onClick={() => setOpen(true)}
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
            >
                <Tooltip title="Detail" placement="top">
                    <VisibilityIcon />
                </Tooltip>
            </SoftTypography>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '70%',
                        height: '65vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Detail assembly
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <SoftBox
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginBottom: '16px',
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="h5" fontWeight="bold">
                                                {item.title}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Description:</strong> {item.description || "No description provided"}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Time:</strong> {item.time}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Google Meet URL:</strong> {item.googleMeetUrl || "Not provided"}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Group Name:</strong> {item.group?.name || "N/A"}
                                            </SoftTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1">
                                                <strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}
                                            </SoftTypography>
                                        </Grid>
                                    </Grid>
                                </SoftBox>
                            </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

AssemblyDetail.propTypes = {
    item: PropTypes.array.isRequired,
};