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
import Tooltip from "@mui/material/Tooltip";
import SoftDatePicker from "yaponuz/components/SoftDatePicker";
import { FileController } from "yaponuz/data/api";
import { Course } from "yaponuz/data/controllers/course";


import { Module } from "yaponuz/data/controllers/module";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function UpdateModule({ id, item, refetch }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(item);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  // Handle modal open and close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle save/update
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

      const response = await Module.updateModule(formData);
      loadingSwal.close();

      if (response.success) {
        Swal.fire("Updated", response.message, "success").then(() => refetch());
      } else {
        Swal.fire("Error", response.message || response.error, "error");
      }

      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave in Update Module: ", err);
    }
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

  const selectedCourseLabel = () => {
    const result = courses.find((item) => item.id === formData.courseId);
    return {label: result.name + ` (${result.teacherName})`, value: result.id};
  }

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
        <DialogTitle>Update Module</DialogTitle>
        <DialogContent>
          {/* Start form */}
          <Grid container spacing={2}>
            {/* Module Name */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Module Name</SoftTypography>
                <SoftInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Price */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Price</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Course ID */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Select Course</SoftTypography>
                <SoftSelect
                  defaultValue={selectedCourseLabel}
                  options={courses.map((course) => ({
                    value: course.id,
                    label: `${course.name} (${course.teacherName})`,
                  }))}
                  onChange={(e) => setFormData({ ...formData, courseId: e.value })}
                  placeholder="Select a course"
                />
              </SoftBox>
            </Grid>

            {/* Lesson Minutes */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Lesson Minutes</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.lessonMinutes}
                  onChange={(e) => setFormData({ ...formData, lessonMinutes: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Question Count */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Question Count</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.questionCount}
                  onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Video Count */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Video Count</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.videoCount}
                  onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Icon ID */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Icon {formData.iconId}</SoftTypography>
                  <SoftInput
                    type="file"
                    onChange={handleFileChange}
                  />
              </SoftBox>
            </Grid>

            {/* Discounted Price */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Discounted Price</SoftTypography>
                <SoftInput
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                />
              </SoftBox>
            </Grid>

            {/* Block */}
            <Grid item xs={12} md={6}>
              <SoftBox>
                <SoftTypography variant="subtitle2">Block</SoftTypography>
                <Switch
                  checked={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.checked })}
                />
              </SoftBox>
            </Grid>

            {/* Hidden */}
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
          {/* End form */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Module</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateModule.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
