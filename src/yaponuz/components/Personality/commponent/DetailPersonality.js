import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import { useState } from "react";

export default function DetailPersonality({ item }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Кнопка для открытия диалогового окна */}
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

            {/* Диалоговое окно */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Score */}
                        <Grid item xs={12}>
                            <SoftTypography variant="body1">
                                <strong>Score:</strong> {item.score !== undefined ? item.score : "N/A"}
                            </SoftTypography>
                        </Grid>

                        {/* Date */}
                        <Grid item xs={12}>
                            <SoftTypography variant="body1">
                                <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                            </SoftTypography>
                        </Grid>

                        {/* Comment */}
                        <Grid item xs={12}>
                            <SoftTypography variant="body1">
                                <strong>Comment:</strong> {item.comment || "No comment provided"}
                            </SoftTypography>
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

// PropTypes validation
DetailPersonality.propTypes = {
    item: PropTypes.shape({
        score: PropTypes.number, // Score
        date: PropTypes.string, // Date
        comment: PropTypes.string, // Comment
    }).isRequired,
};