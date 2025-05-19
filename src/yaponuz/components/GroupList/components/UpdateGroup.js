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
import SoftDatePicker from "yaponuz/components/SoftDatePicker";

// import { Group } from "yaponuz/data/api";
import { Group } from "yaponuz/data/controllers/group";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import { Course } from "yaponuz/data/controllers/course";
import { Teacher } from "yaponuz/data/api";

export default function UpdateGroup({ id, item, refetch }) {
  const [open, setOpen] = useState(false);
  // variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [courseId, setCourseId] = useState('')
  const [courses, setCourses] = useState([])

  const [teacherId, setTeacherId] = useState(null); // Новый стейт для teacher
  const [teachers, setTeachers] = useState([]); // Для списка teachers

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  React.useEffect(() => {
    setGroupName(item.name);
    if (item.startDate) {
      setStartDate(new Date(item.startDate));
    }
    if (item.endDate) {
      setEndDate(new Date(item.endDate));
    }
    if (item.courseId) {
      setCourseId(item.courseId);
    }
    if (item.teacherId) {
      setTeacherId(item.teacherId);
    }
  }, [id, item]);

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

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

  const getAllUsers = async () => {
    try {
      const response = await Teacher.getUsers(page, size, firstName, lastName, phoneNumber);
      setTeachers(response.object.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAllCourses = async () => {
    try {
      const response = await Course.getAllCourses(0, 30);
      setCourses(response.object);
    } catch (err) {
      console.log("Error from courses list GET: ", err);
    }
  };
  React.useEffect(() => {
    if (open) {
      getAllCourses()
      getAllUsers()
    }
  }, [open]);

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
      const data = { id: item.id, groupName, startDate, endDate, courseId, teacherId };
      const response = await Group.updateGroup(data);
      loadingSwal.close();

      showAlert(response);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Group: ", err);
    }
  };

  // return the JSX code
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
        <DialogTitle>Update Group</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* group */}
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Group Name
              </SoftTypography>

              <SoftInput
                placeholder="Enter the Group Name"
                value={groupName}
                style={my}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Course
              </SoftTypography>
              <SoftSelect
                options={courses?.map((cr) => ({
                  value: cr.id,
                  label: `${cr.name} `,
                }))}
                placeholder="Choose a courses"
                value={courses
                  ?.map((cr) => ({
                    value: cr.id,
                    label: `${cr.name} `,
                  }))
                  .find((option) => option.value === courseId)} // Находим выбранный элемент
                onChange={(selectedOption) => setCourseId(selectedOption?.value)}
              />
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Select Teacher
              </SoftTypography>
              <SoftSelect
                options={teachers?.map((teacher) => ({
                  value: teacher.id,
                  label: `${teacher.firstName} ${teacher.lastName}`,
                }))}
                placeholder="Choose a Teacher"
                value={teachers
                  ?.map((teacher) => ({
                    value: teacher.id,
                    label: `${teacher.firstName} ${teacher.lastName}`,
                  }))
                  .find((option) => option.value === teacherId)} // Находим выбранный элемент
                onChange={(selectedOption) => setTeacherId(selectedOption?.value)}
              />
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
                        Start Date
                      </SoftTypography>
                    </SoftBox>
                    <SoftDatePicker value={startDate} onChange={handleSetStartDate} />
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
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        End Date
                      </SoftTypography>
                    </SoftBox>
                    <SoftDatePicker value={endDate} onChange={handleSetEndDate} />
                  </SoftBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateGroup.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func,
};
