import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip, CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { API_PATH } from "../../../data/headers";
import { File } from "yaponuz/data/controllers/files";

export default function FilePreview({ item }) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilePreview = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await File.getOnePhoto(item?.id);
            console.log("File response:", response); // Для отладки
            setFile(response);
        } catch (error) {
            console.error("Error fetching file:", error);
            setError("Failed to load file preview");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchFilePreview();
        } else {
            // Clear file when dialog is closed to prevent showing old image
            setFile(null);
        }
    }, [open]);

    const renderFileContent = () => {
        if (loading) {
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </SoftBox>
            );
        }

        if (error) {
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <SoftTypography variant="body1" color="error">
                        {error}
                    </SoftTypography>
                </SoftBox>
            );
        }

        if (!file) {
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <SoftTypography variant="body1">
                        No file to preview
                    </SoftTypography>
                </SoftBox>
            );
        }

        // Напрямую отображаем фото независимо от типа файла
        if (file && typeof file === 'string') {
            // Если ответ - строка (возможно base64 или URL)
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <img
                        src={file}
                        alt="File preview"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                </SoftBox>
            );
        } else if (file && file.data) {
            // Если ответ содержит данные в формате blob или base64
            const imgSrc = file.data.startsWith('data:') ? file.data : `data:image/jpeg;base64,${file.data}`;
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <img
                        src={imgSrc}
                        alt={file.orginalName || "File preview"}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                </SoftBox>
            );
        } else if (file && (file.id || file.hashId)) {
            // Если у нас есть id или hashId, используем его для формирования URL
            return (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <img
                        src={`${API_PATH}/files/${file.id || file.hashId}`}
                        alt={file.orginalName || "File preview"}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                </SoftBox>
            );
        } else {
            // Для остальных случаев
            return (
                <SoftBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                    <SoftTypography variant="body1" mb={2}>
                        Файл не может быть предпросмотрен.
                    </SoftTypography>
                </SoftBox>
            );
        }
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
                <DialogTitle>
                    {file?.orginalName || "File Preview"}
                    {file?.extension && ` (${file.extension})`}
                </DialogTitle>
                <DialogContent>
                    <Grid container sx={{ height: "calc(100% - 20px)" }}>
                        <Grid item xs={12} sx={{ height: "100%" }}>
                            {renderFileContent()}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {/* {file && (
                        <Button
                            onClick={() => {
                                // Функция для скачивания файла
                                const downloadFile = () => {
                                    // Если файл - строка с base64
                                    if (typeof file === 'string' && file.startsWith('data:')) {
                                        const link = document.createElement('a');
                                        link.href = file;
                                        link.download = 'download.jpg'; // Имя по умолчанию
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }
                                    // Если файл имеет данные base64
                                    else if (file.data && typeof file.data === 'string') {
                                        const imgData = file.data.startsWith('data:') ? file.data : `data:image/jpeg;base64,${file.data}`;
                                        const link = document.createElement('a');
                                        link.href = imgData;
                                        link.download = file.orginalName || 'download.jpg';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }
                                    // Если файл имеет id или hashId
                                    else if (file.id || file.hashId) {
                                        const link = document.createElement('a');
                                        link.href = `${API_PATH}/files/${file.id || file.hashId}`;
                                        link.download = file.orginalName || 'download';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }
                                };

                                downloadFile();
                            }}
                            color="primary"
                        >
                            Скачать
                        </Button>
                    )} */}
                    <Button onClick={() => setOpen(false)} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// PropTypes validation
FilePreview.propTypes = {
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