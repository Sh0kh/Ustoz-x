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

import { Teacher } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function addUser({ refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [dateBirth, setDateBirth] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [genderType, setGenderType] = useState("ERKAK");

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // save the data add new user function
  const handleSave = async () => {
    const data = {
      dateOfBirth: new Date(dateBirth).toISOString(),
      firstName,
      lastName,
      phoneNumber,
      password,
      genderType,
      accountType: "TEACHER",
      creatorId: localStorage.getItem("userId"),
      confirmPassword: password,
    };


    try {
      const response = await Teacher.createUser(data);
      showAlert(response);
    } catch (error) {
      console.log(error);
    }
  };

  // then add new user function
  const showAlert = (response) => {
    function reload() {
      refetch();
      handleClose();

      // clear data
      setDateBirth("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setPassword("");
      setGenderType("");
    }
    if (response.success) {
      Swal.fire("new user added", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  // jsx html code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add new teacher
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* dateBirth */}
              <SoftInput
                placeholder="dateBirth"
                value={dateBirth}
                style={my}
                onChange={(e) => setDateBirth(e.target.value)}
              />
              {/* firstName */}
              <SoftInput
                placeholder="firstName"
                value={firstName}
                style={my}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {/* phoneNumber */}
              <SoftInput
                placeholder="phoneNumber"
                value={phoneNumber}
                style={my}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              {/* genderType */}
              <SoftBox style={my}>
                <SoftSelect
                  placeholder="Select Gender Type"
                  onChange={(selectedOption) => setGenderType(selectedOption.value)} // Adjusted onChange function
                  options={[
                    { value: "ERKAK", label: "ERKAK" },
                    { value: "AYOL", label: "AYOL" },
                  ]}
                />
              </SoftBox>
              {/* lastName */}
              <SoftInput
                placeholder="lastName"
                value={lastName}
                style={my}
                onChange={(e) => setLastName(e.target.value)}
              />
              {/* password */}
              <SoftInput
                placeholder="password"
                value={password}
                style={my}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
