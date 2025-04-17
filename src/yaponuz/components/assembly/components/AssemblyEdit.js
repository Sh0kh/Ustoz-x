import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import PropTypes from "prop-types";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import Swal from "sweetalert2";
import { Assembly } from "yaponuz/data/api";

export default function AssemblyEdit({ item, refetch }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');
    const [groups, setGroups] = useState([]);
    const [info, setInfo] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null); // Изменено на объект
    const my = { margin: "5px 0px" };

    const getGroup = async () => {
        try {
            const response = await Group.getAllGroup();
            setGroups(response.object.map(group => ({
                value: group.id,
                label: group.name
            })));
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    useEffect(() => {
        if (open) {
            getGroup();
        }
    }, [open]);

    useEffect(() => {
        if (item) {
            setTitle(item?.title || '');
            setDate(item?.date || '');
            setTime(item?.time || '');
            setLink(item?.googleMeetUrl || '');
            setInfo(item?.description || '');
            if (item?.group?.id && groups.length > 0) {
                const selected = groups.find(group => group.value === item?.group?.id);
                setSelectedGroup(selected || null);
            }
        }
    }, [item, groups]);

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
            const data = { id: item.id, title, date, time, link, selectedGroup, info };
            const response = await Assembly.EditAssembly(data);
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
                        height: '78vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Edit assembly
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
                            <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" gap={'10px'}>
                                <SoftBox width={'100%'}>
                                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                                        Date
                                    </SoftTypography>
                                    <SoftInput
                                        placeholder="Enter the Date (2024-01-01)"
                                        value={date}
                                        style={my}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </SoftBox>
                                <SoftBox width={'100%'}>
                                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                                        Time
                                    </SoftTypography>
                                    <SoftInput
                                        placeholder="Enter the Time (14:00)"
                                        value={time}
                                        style={my}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </SoftBox>
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Google meet link
                                </SoftTypography>
                                <SoftInput
                                    placeholder="Enter the google meet link"
                                    value={link}
                                    style={my}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Select Group
                                </SoftTypography>
                                <SoftSelect
                                    placeholder="Choose a group"
                                    options={groups} // Передаем список групп
                                    value={selectedGroup} // Выбранная группа
                                    onChange={(group) => setSelectedGroup(group)} // Обновляем выбранную группу
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
                                <Button onClick={handleSave}>Edit Assembly</Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

AssemblyEdit.propTypes = {
    refetch: PropTypes.func.isRequired,
    item: PropTypes.array.isRequired
};