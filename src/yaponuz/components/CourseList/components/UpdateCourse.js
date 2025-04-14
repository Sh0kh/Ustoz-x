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
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

import { Course } from "yaponuz/data/controllers/course";
import { FileController } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function UpdateCourse({ id, item, refetch }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(item); // initial form data

  // modal functions
  const handleClickOpen = () => {
    setFormData(item); // Set initial data when modal opens
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // show alert function
  const showAlert = (response) => {
    function reload() {
      refetch();
    }
    if (response.success) {
      Swal.fire("Updated", response.message, "success").then(() => reload());
    } else {
      Swal.fire("Error", response.message || response.error, "error").then(() => reload());
    }
  };

  // save updated data
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

      const response = await Course.updateCourse(formData);
      loadingSwal.close();

      showAlert(response);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from update Course: ", err);
    }
  };

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
    setFormData({ ...formData, iconId: response.object.id })
  };

  return (
    <>
      <SoftTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
        onClick={handleClickOpen}
      >
        <Tooltip title="Edit" placement="top">
          <Icon>edit</Icon>
        </Tooltip>
      </SoftTypography>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent>
          {/* Start form */}
          <Grid container spacing={2}>
            {/* Course Name */}
            <Grid item xs={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Course Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </SoftBox>
            </Grid>

            {/* Teacher Name */}
            <Grid item xs={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Teacher Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherName: e.target.value })
                  }
                />
              </SoftBox>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Sort</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.sort}
                  onChange={(e) =>
                    setFormData({ ...formData, sort: Number(e.target.value) })
                  }
                />
              </SoftBox>
            </Grid>

            {/* Icon ID */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Icon ID</SoftTypography>
                <SoftInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e)}
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
              </SoftBox>
            </Grid>

            {/* Switches for Block and Hidden */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Block</SoftTypography>
                <Switch
                  checked={formData.block}
                  onChange={(e) =>
                    setFormData({ ...formData, block: e.target.checked })
                  }
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Hidden</SoftTypography>
                <Switch
                  checked={formData.hidden}
                  onChange={(e) =>
                    setFormData({ ...formData, hidden: e.target.checked })
                  }
                />
              </SoftBox>
            </Grid>
          </Grid>
          {/* End form */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Course</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateCourse.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
