import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import SoftDatePicker from "yaponuz/components/SoftDatePicker";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import { Group } from "yaponuz/data/controllers/group";
import { Teacher } from "yaponuz/data/api";

export default function AddGroup({ refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [teacherId, setTeacherId] = useState(null); // Новый стейт для teacher
  const [teachers, setTeachers] = useState([]); // Для списка teachers

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  const getAllUsers = async () => {
    try {
      const response = await Teacher.getUsers(page, size, firstName, lastName, phoneNumber);
      setTeachers(response.object.content);
      console.log(response, "all users");
      console.log("all users");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [page, size, firstName, lastName, phoneNumber]);


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
      const data = { groupName, startDate, endDate, teacherId };
      const response = await Group?.createGroup(data);
      loadingSwal.close();

      showAlert(response);

      // clear the data
      setGroupName("");
      setStartDate(null);
      setEndDate(null);
      setTeacherId(null);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Group: ", err);
    }
  };


  console.log(teachers)

  // return the JSX code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new group
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Group</DialogTitle>
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

              {/* Teacher Select */}
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
          <Button onClick={handleSave}>Add Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddGroup.propTypes = {
  refetch: PropTypes.func,
};
