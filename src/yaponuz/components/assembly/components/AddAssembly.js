import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import Swal from "sweetalert2";
import { Assembly } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";


export default function AddAssembly({ refetch }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');
    const [groups, setGroups] = useState([]);
    const [info, setInfo] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

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


            let formattedDate = date;
            if (Array.isArray(date)) {
                formattedDate = date[0]; // Take the first element from the array
            }

            const data = { title, date: formattedDate, time, link, selectedGroup, info };
            const response = await Assembly?.createAssembly(data);
            loadingSwal.close();

            showAlert(response);

            // clear the data
            setTitle('')
            setInfo('')
            setLink('')
            setTime('')
            setSelectedGroup(null)
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
                + add new assembly
            </SoftButton>
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
                    Add new assembly
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
                                    <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                        Date
                                    </SoftTypography>
                                    <SoftDatePicker
                                        placeholder="Select Date"
                                        value={date}
                                        fullWidth
                                        onChange={(newDate) => setDate(newDate)}
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
                                    onChange={(value) => setSelectedGroup(value)} // Обновляем выбранную группу
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
                                <Button onClick={handleSave}>Add Group</Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
AddAssembly.propTypes = {
    refetch: PropTypes.func.isRequired,
};