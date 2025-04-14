import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Switch from "@mui/material/Switch";
import SoftDatePicker from "yaponuz/components/SoftDatePicker";

import { Attendance } from "yaponuz/data/controllers/attendance";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function AddGroup({ refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [formData, setFormData] = useState();

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // then add new group function
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

  // add new group function
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
      const response = await Attendance.createAttendance(formData);
      loadingSwal.close();
      showAlert(response);
      setFormData({});
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Group: ", err);
    }
  };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new Attendance
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Attendance</DialogTitle>
        <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SoftBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              height="100%"
            >
              <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Student
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                options={[
                  { label: "CAME", value: "3" },
                  { label: "EXCUSED", value: "5" },
                  { label: "LATE_CAME", value: "1" },
                  { label: "NOT_CAME", value: "9" },
                ]}
                onChange={(e) => setFormData({...formData, status: e.value})}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={6}>
            <SoftBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              height="100%"
            >
              <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                <SoftTypography variant="caption">Status</SoftTypography>
              </SoftBox>
              <SoftSelect
                options={[
                  { label: "CAME", value: "CAME" },
                  { label: "EXCUSED", value: "EXCUSED" },
                  { label: "LATE_CAME", value: "LATE_CAME" },
                  { label: "NOT_CAME", value: "NOT_CAME" },
                ]}
                onChange={(e) => setFormData({...formData, status: e.value})}
              />
            </SoftBox>
          </Grid>
        </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Comment
              </SoftTypography>
              <SoftInput
                placeholder="Comment"
                style={my}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
              />

              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Day
              </SoftTypography>
              <SoftDatePicker onChange={(e) => setFormData({...formData, day: e.value})} />

              <SoftTypography component="label" variant="caption" fontWeight="bold">
                TimeOfLate
              </SoftTypography>
              <SoftInput
                placeholder="TimeOfLate"
                style={my}
                onChange={(e) => setFormData({...formData, timeOfLate: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Attendance</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddGroup.propTypes = {
  refetch: PropTypes.func,
};
