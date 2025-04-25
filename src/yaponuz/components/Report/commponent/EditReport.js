import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import PropTypes from "prop-types";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { report } from "yaponuz/data/api";
import { useParams } from "react-router-dom";

export default function EditReport({ item, refetch }) {
    const { ID } = useParams()
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [fileId, setFileId] = useState(null)
    const my = { margin: "5px 0px" };
    const [Type, setType] = useState([
        {
            value: 'RECOMMENDATION',
            label: 'Tavsiya'
        },
        {
            value: 'REPORT',
            label: 'Hisobot'
        }
    ]);
    const [info, setInfo] = useState('');
    const [selectType, setselectType] = useState('');

    const uploadHandle = async (file, category) => {
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

        try {
            const response = await FileController.uploadFile(
                file,
                category,
                localStorage.getItem("userId")
            );
            loadingSwal.close();
            if (response.success) {
                Swal.fire("Added", response.message, "success");
            } else {
                Swal.fire("error", response.message || response.error, "error");
            }
            return response;
        } catch (err) {
            loadingSwal.close();
            console.error("Error uploading file:", err.response || err);
            Swal.fire("Upload Failed", err.response?.data?.message || err.message, "error");
            return false;
        }
    };

    const upload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            alert("Iltimos, fayl tanlang!");
            return;
        }
        const response = await uploadHandle(selectedFile, "education_icon");
        setFileId(response?.object?.id)
    };



    useEffect(() => {
        if (item) {
            setTitle(item?.title || '')
            setFileId(item?.fileId)
            if (item?.reportType && Type?.length > 0) {
                const selected = Type.find(i => i.value === item?.reportType);
                setselectType(selected || null);
            }
            setInfo(item?.context || '')
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
            const data = { id: item.id, studentId: ID, title, info, selectType, fileId };
            const response = await report.EditReport(data);
            loadingSwal.close();

            showAlert(response);

            // close the modal
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
                        height: '67vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Edit report
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
                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Select type
                                </SoftTypography>
                                <SoftSelect
                                    placeholder="Choose a group"
                                    options={Type}
                                    value={selectType}
                                    onChange={(value) => setselectType(value)}
                                />
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography variant="subtitle2">Upload file</SoftTypography>
                                <SoftInput
                                    type="file"
                                    onChange={(e) => upload(e)}
                                    style={{
                                        border: "1px solid #e0e0e0",
                                        padding: "10px",
                                        borderRadius: "5px",
                                    }}
                                />
                            </SoftBox>

                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Info
                                </SoftTypography>
                                <SoftInput
                                    multiline
                                    rows={4}
                                    placeholder="Enter additional information"
                                    value={info}
                                    style={my}
                                    onChange={(e) => setInfo(e.target.value)}
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

EditReport.propTypes = {
    refetch: PropTypes.func.isRequired,
    item: PropTypes.array.isRequired
};