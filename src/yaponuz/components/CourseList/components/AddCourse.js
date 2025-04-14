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
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FileController } from "yaponuz/data/api";

import { Course } from "yaponuz/data/controllers/course";

export default function AddCourse({ refetch }) {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    block: true,
    hidden: true,
    iconId: 0,
    name: "",
    sort: 0,
    teacherName: "",
  });
  const [errors, setErrors] = useState({}); // Error state for validation

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    setFile(selectedFile);
    const response = await uploadHandle(selectedFile, "education_icon");
    setFormData({ ...formData, iconId: response.object.id })
  };

  // Validation function
  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      validationErrors.name = "Course name is required";
    }
    if (!formData.teacherName || formData.teacherName.trim() === "") {
      validationErrors.teacherName = "Teacher name is required";
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  // show alert
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

  // add new course function
  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: Object.values(validationErrors)
          .map((err) => `<p>${err}</p>`)
          .join(""),
        icon: "error",
      });
      return;
    }

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

      const data = {
        block: formData.block,
        hidden: formData.hidden,
        iconId: formData.iconId,
        name: formData.name,
        sort: formData.sort,
        teacherName: formData.teacherName,
      };

      const response = await Course.createCourse(data);
      loadingSwal.close();
      showAlert(response);

      // clear the data
      setFormData({
        block: true,
        hidden: true,
        iconId: 0,
        name: "",
        sort: 0,
        teacherName: "",
      });

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Course: ", err);
    }
  };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new course
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Course Name */}
            <Grid item xs={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Course Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                />
                {errors.name && (
                  <SoftTypography variant="caption" color="error">
                    {errors.name}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>

            {/* Teacher Name */}
            <Grid item xs={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Teacher Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  error={!!errors.teacherName}
                />
                {errors.teacherName && (
                  <SoftTypography variant="caption" color="error">
                    {errors.teacherName}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Sort</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.sort}
                  onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })}
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
                  onChange={(e) => setFormData({ ...formData, block: e.target.checked })}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Hidden</SoftTypography>
                <Switch
                  checked={formData.hidden}
                  onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })}
                />
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Course</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddCourse.propTypes = {
  refetch: PropTypes.func,
};
