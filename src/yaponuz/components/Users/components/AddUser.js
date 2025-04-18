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

import { Users } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import { Group } from "yaponuz/data/controllers/group";
import SoftDatePicker from "components/SoftDatePicker";


export default function addUser({ refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [dateBirth, setDateBirth] = useState("2025-01-02");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [genderType, setGenderType] = useState("ERKAK");
  const [email, setEmail] = useState('')
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [GroupOptions, setGroupOptions] = useState([]);
  const [selectedGroupValue, setSelectedGroupValue] = useState("");

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
      accountType: "STUDENT",
      creatorId: localStorage.getItem("userId"),
      confirmPassword: password,
      email: email,
      groupId: selectedGroupValue.value || null
    };



    try {
      const response = await Users.createUser(data);
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
      setEmail('')
    }
    if (response.success) {
      Swal.fire("new user added", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      const groups = response.object || []; // Assuming response.object.data holds the array of groups

      // Map the fetched data to match the expected format of SoftSelect options
      const formattedOptions = groups?.map((group) => ({
        label: group.name, // Replace 'name' with the actual property for group label
        value: group.id,   // Replace 'id' with the actual property for group value
      }));

      setGroupOptions(formattedOptions);
      console.log(formattedOptions)
    } catch (err) {
      console.error("Error from groups list GET: ", err);
    }
  };

  // mounting
  React.useEffect(() => {
    getAllGroups(page, size);
  }, [page, size]);




  // jsx html code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add new student
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Group Select */}
              <SoftSelect
                placeholder="Select Group"
                value={selectedGroupValue}
                onChange={(selectedOption) => setSelectedGroupValue(selectedOption)}
                options={GroupOptions}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    position: "absolute",
                    zIndex: 9999,
                  }),
                  container: (provided) => ({
                    ...provided,
                    position: "relative",
                  }),
                }}
              />
              {/* First Name */}
              <SoftInput
                placeholder="First Name"
                value={firstName}
                style={{ marginTop: "16px", width: "100%" }}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {/* Phone Number */}
              <SoftInput
                placeholder="Phone Number"
                value={phoneNumber}
                style={{ marginTop: "16px", width: "100%" }}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.startsWith("+998")) {
                    setPhoneNumber(input);
                  } else {
                    setPhoneNumber("+998");
                  }
                }}
              />

            </Grid>
            <Grid item xs={6}>
              {/* Gender Type */}
              <SoftSelect
                placeholder="Select Gender Type"
                onChange={(selectedOption) => setGenderType(selectedOption.value)}
                options={[
                  { value: "ERKAK", label: "ERKAK" },
                  { value: "AYOL", label: "AYOL" },
                ]}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    position: "absolute",
                    zIndex: 9999,
                  }),
                  container: (provided) => ({
                    ...provided,
                    position: "relative",
                  }),
                }}
              />
              {/* Last Name */}
              <SoftInput
                placeholder="Last Name"
                value={lastName}
                style={{ marginTop: "16px", width: "100%" }}
                onChange={(e) => setLastName(e.target.value)}
              />
              {/* Password */}
              <SoftInput
                placeholder="Password"
                value={password}
                style={{ marginTop: "16px", width: "100%" }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
            <SoftInput
              placeholder="Email"
              value={email}
              style={{ flex: 1 }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div style={{ flex: 1 }}>
              <SoftDatePicker
              placeholder={'Date birdth'}
                value={dateBirth}
                onChange={(newDate) => setDateBirth(newDate)}
              />
            </div>
          </div>


        </DialogContent>


        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Student</Button>
        </DialogActions>
      </Dialog >
    </>
  );
}
