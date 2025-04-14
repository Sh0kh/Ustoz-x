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
import { FileController } from "yaponuz/data/api";

import { Module } from "yaponuz/data/controllers/module";
import { Course } from "yaponuz/data/controllers/course";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function AddModule({ refetch }) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({}); // Error state for validation

  // variables
  const [formData, setFormData] = useState({
    "block": true,
    "hidden": true,
    "courseId": '',
    "discountedPrice": '',
    "iconId": '',
    "lessonMinutes": '',
    "name": "",
    "price": '',
    "questionCount": '',
    "videoCount": ''
  });

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

  // then add new Module function
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

  // Validation function
  const validateForm = () => {
    const validationErrors = {};

    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "boolean") return;
      if (!formData[key] || formData[key].toString().trim() === "") {
        validationErrors[key] = `${key} is required`;
      }
    });

    if (!formData.courseId) {
      validationErrors.courseId = "Course selection is required";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  React.useEffect(() => {
    // fetching data function
    const getAllCourses = async (page, size) => {
      try {
        const response = await Course.getAllCourses(page, size);
        setCourses(response.object);
      } catch (err) {
        console.log("Error from courses list GET: ", err);
      }
    };

    getAllCourses(1, 30);
  }, []);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];

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

      const response = await FileController.uploadFile(file, 'education_icon', localStorage.getItem("userId"));
      console.log("Yuklash natijasi:", response);
      setFormData({...formData, iconId: response.object.id})
      loadingSwal.close();
      if (response.success) {
        Swal.fire("Added", response.message, "success");
      } else {
        Swal.fire("error", response.message || response.error, "error");
      }
    } catch (err) {
      console.log("File Upload Error: ", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

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
        const response = await Module.createModule(formData);
        loadingSwal.close();
        setFormData({
          block: true,
          hidden: true,
          courseId: "",
          discountedPrice: "",
          iconId: "",
          lessonMinutes: "",
          name: "",
          price: "",
          questionCount: "",
          videoCount: "",
        });
        showAlert(response);
        setOpen(false);
      } catch (err) {
        console.log("Error from handleSave from add Module: ", err);
      }

    } else {
      console.error("Validation errors:", errors);
    }
  };


  // return the JSX code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new module
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <SoftBox>
              <SoftTypography variant="subtitle2">Select Course</SoftTypography>
              <SoftSelect
                options={courses?.map((course) => ({
                  value: course.id,
                  label: `${course.name} (${course.teacherName})`,
                }))}
                onChange={(e) => setFormData({ ...formData, courseId: e.value })}
                placeholder="Select a course"
                error={!!errors.courseId}
              />
              {errors.courseId && (
                <SoftTypography variant="caption" color="error">
                  {errors.courseId}
                </SoftTypography>
              )}
            </SoftBox>
          </Grid>
          <SoftBox p={3}>
            <Grid container spacing={3}>
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
                  <SoftTypography variant="subtitle2">Discounted Price</SoftTypography>
                  <SoftInput
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: Number(e.target.value),
                      })
                    }
                    error={!!errors.discountedPrice}
                  />
                  {errors.discountedPrice && (
                    <SoftTypography variant="caption" color="error">
                      {errors.discountedPrice}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Lesson Minutes</SoftTypography>
                  <SoftInput
                    type="number"
                    value={formData.lessonMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lessonMinutes: Number(e.target.value),
                      })
                    }
                    error={!!errors.lessonMinutes}
                  />
                  {errors.lessonMinutes && (
                    <SoftTypography variant="caption" color="error">
                      {errors.lessonMinutes}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Name</SoftTypography>
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

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Price</SoftTypography>
                  <SoftInput
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    error={!!errors.price}
                  />
                  {errors.price && (
                    <SoftTypography variant="caption" color="error">
                      {errors.price}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Question Count</SoftTypography>
                  <SoftInput
                    type="number"
                    value={formData.questionCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        questionCount: Number(e.target.value),
                      })
                    }
                    error={!!errors.questionCount}
                  />
                  {errors.questionCount && (
                    <SoftTypography variant="caption" color="error">
                      {errors.questionCount}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Video Count</SoftTypography>
                  <SoftInput
                    type="number"
                    value={formData.videoCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videoCount: Number(e.target.value),
                      })
                    }
                    error={!!errors.videoCount}
                  />
                  {errors.videoCount && (
                    <SoftTypography variant="caption" color="error">
                      {errors.videoCount}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="subtitle2">Icon</SoftTypography>
                  <SoftInput
                    type="file"
                    onChange={handleFileChange}
                    error={!!errors.iconId}
                  />
                  {errors.iconId && (
                    <SoftTypography variant="caption" color="error">
                      {errors.iconId}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Module</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddModule.propTypes = {
  refetch: PropTypes.func,
};
