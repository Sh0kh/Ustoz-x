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
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FileController } from "yaponuz/data/api";
import { Course } from "yaponuz/data/controllers/course";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddCourse({ refetch }) {
  const [file, setFile] = useState(null);
  const [homeIconFile, setHomeIconFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    block: true,
    hidden: true,
    iconId: '',
    iconFromHome: '',
    name: "",
    sort: 0,
    teacherName: "",
    isPopular: true,
    isDiscounted: true,
    price: '',
    discounted: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Конфигурация для ReactQuill
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

  const upload = async (e, isHomeIcon = false) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("Iltimos, fayl tanlang!");
      return;
    }

    if (isHomeIcon) {
      setHomeIconFile(selectedFile);
    } else {
      setFile(selectedFile);
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

  // Validation function
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
    if (!formData.iconId) {
      validationErrors.iconId = "Course icon is required";
    }
    if (!formData.iconFromHome) {
      validationErrors.iconFromHome = "Home icon is required";
    }
    if (!formData.price || formData.price.trim() === "") {
      validationErrors.price = "Course price is required";
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
        iconFromHome: formData.iconFromHome,
        name: formData.name,
        sort: formData.sort,
        teacherName: formData.teacherName,
        isPopular: formData.isPopular,
        isDiscounted: formData.isDiscounted,
        price: formData.price,
        discounted: formData.discounted,
        description: formData.description
      };

      const response = await Course.createCourse(data);
      loadingSwal.close();
      showAlert(response);

      // clear the data
      setFormData({
        block: true,
        hidden: true,
        iconId: 0,
        iconFromHome: 0,
        name: "",
        sort: 0,
        teacherName: "",
        isPopular: true,
        isDiscounted: true,
        price: '',
        discounted: '',
        description: ''
      });
      setFile(null);
      setHomeIconFile(null);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Course: ", err);
      Swal.fire("Error", "Failed to create course", "error");
    }
  };


  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new course
      </SoftButton>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Course Name */}
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
                  onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })}
                />
              </SoftBox>
            </Grid>
            {/* Price */}
            <Grid item xs={12} md={12}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Price</SoftTypography>
                <SoftInput
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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

            {/* Icon ID */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Course Icon</SoftTypography>
                <SoftInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e)}
                  style={{
                    border: errors.iconId ? "1px solid #f44336" : "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
                {errors.iconId && (
                  <SoftTypography variant="caption" color="error">
                    {errors.iconId}
                  </SoftTypography>
                )}
                {formData?.iconId && (
                  <img className="w-[200px] mt-[10px] block rounded" src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${formData?.iconId}`} />
                )}
              </SoftBox>
            </Grid>

            {/* Icon From Home */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Home Page Icon</SoftTypography>
                <SoftInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e, true)}
                  style={{
                    border: errors.iconFromHome ? "1px solid #f44336" : "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
                {errors.iconFromHome && (
                  <SoftTypography variant="caption" color="error">
                    {errors.iconFromHome}
                  </SoftTypography>
                )}
                {formData?.iconFromHome && (
                  <img className="w-[200px] mt-[10px] block rounded" src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${formData?.iconFromHome}`} />
                )}
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

            {/* Rich Text Editor для описания */}
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
                    placeholder="Введите описание курса..."
                  />
                </div>
                {errors.description && (
                  <SoftTypography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {errors.description}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Add Course</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddCourse.propTypes = {
  refetch: PropTypes.func,
};