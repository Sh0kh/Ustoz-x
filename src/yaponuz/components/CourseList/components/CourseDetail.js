import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
    Icon,
    Box,
    Typography,
    Divider,
    Grid,
} from "@mui/material";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";

function formatReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

export default function CourseDetail({ item }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const otherFields = {
        id: "ID",
        createdAt: "Created At",
        iconId: "Icon ID",
        score: "Score",
        sort: "Sort Order",
        isDiscounted: "Has Discount",
        discounted: "Discount Amount",
        isPopular: "Popular",
        block: "Blocked",
        hidden: "Hidden",
    };

    const renderValue = (key, value) => {
        if (value === null || value === undefined) return <i style={{ color: "#aaa" }}>Empty</i>;
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (key === "createdAt") return formatReadableDate(value);
        return value.toString();
    };

    return (
        <>
            <SoftTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={handleClickOpen}
            >
                <Tooltip title="Preview" placement="top">
                    <Icon onClick={handleClickOpen} sx={{ cursor: "pointer" }}>
                        visibility
                    </Icon>
                </Tooltip>
            </SoftTypography>


            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="h5" fontWeight="bold">
                        {item.name || "Untitled Course"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {item.teacherName || "Unknown Teacher"}
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                    {/* Description */}
                    <Box
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: 2,
                            backgroundColor: "#fafafa",
                            mb: 3,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Description
                        </Typography>
                        <Box
                            sx={{
                                fontSize: 14,
                                color: "#444",
                            }}
                            dangerouslySetInnerHTML={{ __html: item.description || "<p>No description</p>" }}
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Other Info */}
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Details
                    </Typography>
                    <Grid container spacing={1}>
                        {Object.entries(otherFields).map(([key, label]) => (
                            <Grid item xs={6} key={key}>
                                <Typography variant="body2" color="text.secondary">
                                    {label}
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                    {renderValue(key, item[key])}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" size="small">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

CourseDetail.propTypes = {
    item: PropTypes.object.isRequired,
};
