import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Tooltip from "@mui/material/Tooltip";

import { Course } from "yaponuz/data/controllers/course";
import { FileController } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function UpdateCourse({ id, item, refetch }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(item);
  const [errors, setErrors] = useState({});

  // modal functions
  const handleClickOpen = () => {
    setFormData(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // File upload handler
  const uploadHandle = async (file, category) => {
    const loadingSwal = Swal.fire({
      title: "Uploading...",
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
        Swal.fire("Success", "File uploaded successfully", "success");
      } else {
        Swal.fire("Error", response.message || response.error, "error");
      }
      return response;
    } catch (err) {
      loadingSwal.close();
      console.error("Error uploading file:", err.response || err);
      Swal.fire("Upload Failed", err.response?.data?.message || err.message, "error");
      return false;
    }
  };

  // Handle file upload for both icons
  const handleFileUpload = async (e, isHomeIcon = false) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    const response = await uploadHandle(selectedFile, "education_icon");
    if (response && response.success) {
      if (isHomeIcon) {
        setFormData({ ...formData, iconFromHome: response.object.id });
      } else {
        setFormData({ ...formData, iconId: response.object.id });
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      validationErrors.name = "Course name is required";
    }
    if (!formData.teacherName || formData.teacherName.trim() === "") {
      validationErrors.teacherName = "Teacher name is required";
    }
    if (!formData.description || formData.description.trim() === "") {
      validationErrors.description = "Course description is required";
    }
    if (!formData.price || formData.price.trim() === "") {
      validationErrors.price = "Course price is required";
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  // Save updated data
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
      setOpen(false);
    } catch (err) {
      console.log("Error updating course: ", err);
      Swal.fire("Error", "Failed to update course", "error");
    }
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Course Name */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Course Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Teacher Name</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherName: e.target.value })
                  }
                  error={!!errors.teacherName}
                />
                {errors.teacherName && (
                  <SoftTypography variant="caption" color="error">
                    {errors.teacherName}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>

            {/* Price */}


            {/* Discounted Price */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Discounted Price</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.discounted}
                  onChange={(e) => setFormData({ ...formData, discounted: e.target.value })}
                  placeholder="Enter discounted price (optional)"
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
            
            <Grid item xs={12} md={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Price</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  error={!!errors.price}
                  placeholder="Enter course price"
                />
                {errors.price && (
                  <SoftTypography variant="caption" color="error">
                    {errors.price}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>



            {/* Course Icon */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Course Icon</SoftTypography>
                <SoftInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e)}
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
                {formData?.iconId && (
                  <img
                    className="w-[200px] mt-[10px] block rounded"
                    src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${formData?.iconId}`}
                    alt="Course Icon"
                  />
                )}
              </SoftBox>
            </Grid>

            {/* Home Page Icon */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Home Page Icon</SoftTypography>
                <SoftInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
                {formData?.iconFromHome && (
                  <img
                    className="w-[200px] mt-[10px] block rounded"
                    src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${formData?.iconFromHome}`}
                    alt="Home Page Icon"
                  />
                )}
              </SoftBox>
            </Grid>

            {/* Switches */}
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
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Popular</SoftTypography>
                <Switch
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Discounted</SoftTypography>
                <Switch
                  checked={formData.isDiscounted}
                  onChange={(e) => setFormData({ ...formData, isDiscounted: e.target.checked })}
                />
              </SoftBox>
            </Grid>
          </Grid>

          {/* Description Editor */}
          <Grid item xs={12}>
            <SoftBox>
              <SoftTypography variant="subtitle2" sx={{ mb: 1 }}>
                Course Description
              </SoftTypography>
              <div style={{
                border: errors.description ? '1px solid #f44336' : '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{
                    backgroundColor: '#fff',
                    height: '500px'
                  }}
                  placeholder="Enter course description..."
                />
              </div>
              {errors.description && (
                <SoftTypography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.description}
                </SoftTypography>
              )}
            </SoftBox>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Update Course</Button>
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