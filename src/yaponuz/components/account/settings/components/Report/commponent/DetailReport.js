import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import { useState } from "react";
import { API_PATH } from "../../../../../../data/headers";

export default function DetailReport({ item }) {
    const [open, setOpen] = useState(false);

    // Функция для создания полного URL изображения
    const getImageUrl = (filePath) => {
        if (!filePath) return null;
        // Предполагаем, что API_PATH - это базовый URL для доступа к файлам
        return `${API_PATH}/${filePath.replace(/^\//, "")}`;
    };

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
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '70%',
                        height: '65vh',
                        maxHeight: '90vh',
                    },
                }}
            >
                <DialogTitle>Detail Report</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                    {/* Title */}
                                    <Grid item xs={12}>
                                        <SoftTypography variant="h5" fontWeight="bold">
                                            {item.title || "No title provided"}
                                        </SoftTypography>
                                    </Grid>

                                    {/* Context */}
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>Context:</strong> {item.context || "No context provided"}
                                        </SoftTypography>
                                    </Grid>

                                    {/* File Information */}
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>File Name:</strong> {item.file?.orginalName || "No file provided"}
                                        </SoftTypography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>File Size:</strong> {item.file?.size ? `${(item.file.size / 1024).toFixed(2)} KB` : "N/A"}
                                        </SoftTypography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>File Type:</strong> {item.file?.contentType || "N/A"}
                                        </SoftTypography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>Uploaded At:</strong> {new Date(item.file?.createdAt).toLocaleString() || "N/A"}
                                        </SoftTypography>
                                    </Grid>

                                    {/* Image Preview */}
                                    {item.file?.uploadPath && (
                                        <Grid item xs={12}>
                                            <SoftTypography variant="body1" fontWeight="bold">
                                                File Preview:
                                            </SoftTypography>
                                            <img
                                                src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${item?.file.id}`}
                                                alt={item.file.orginalName || "File preview"}
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "300px",
                                                    objectFit: "contain",
                                                    marginTop: "8px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Grid>
                                    )}

                                    {/* Report Type */}
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>Report Type:</strong> {item.reportType || "N/A"}
                                        </SoftTypography>
                                    </Grid>

                                    {/* Created At */}
                                    <Grid item xs={12}>
                                        <SoftTypography variant="body1">
                                            <strong>Created At:</strong> {new Date(item.createdAt).toLocaleString() || "N/A"}
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

// PropTypes validation
DetailReport.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        context: PropTypes.string,
        studentId: PropTypes.number,
        fileId: PropTypes.number,
        file: PropTypes.shape({
            id: PropTypes.number,
            createdAt: PropTypes.string,
            createdBy: PropTypes.number,
            deleted: PropTypes.bool,
            name: PropTypes.string,
            orginalName: PropTypes.string,
            type: PropTypes.string,
            size: PropTypes.number,
            extension: PropTypes.string,
            hashId: PropTypes.string,
            contentType: PropTypes.string,
            uploadPath: PropTypes.string,
            fileType: PropTypes.string,
            fileCategory: PropTypes.string,
        }),
        reportType: PropTypes.string,
        createdAt: PropTypes.string,
    }).isRequired,
};