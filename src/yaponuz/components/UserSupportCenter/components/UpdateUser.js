import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import { Users, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function UpdateUser({ item, refetch }) {
  const [open, setOpen] = React.useState(false);

  console.log(item, "salom");

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [genderType, setGenderType] = useState();
  const [id, setId] = useState(item.id);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verification, setVerification] = useState();
  const [email, setEmail] = useState();
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setGenderType({ value: item.genderType, label: item.genderType });
    setId(item.id);
    setPhoneNumber(item.phoneNumber);
    setVerification(item.verification);
    setEmail(item.email);
    setDateOfBirth(
      new Date(item.dateBirth).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null"
    );
  }, [item]);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const data = {
      firstName,
      lastName,
      genderType: genderType.value,
      creatorId: localStorage.getItem("userId"),
      verification,
      email,
      id,
    };
    try {
      const response = await Users.updateUser(data);
      showAlert(response);
    } catch (error) {
      showAlert(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SoftBox style={my}>
                {/* <SoftSelect
                  placeholder="Select a Country"
                  onChange={(selectedOption) => setCountry(selectedOption.value)} // Adjusted onChange function
                  options={[
                    { value: "JAPAN", label: "JAPAN" },
                    { value: "UZBEKISTAN", label: "UZBEKISTAN" },
                  ]}
                /> */}
              </SoftBox>
              <SoftInput
                placeholder="FirstName"
                value={firstName}
                style={my}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <SoftInput
                placeholder="LastName"
                value={lastName}
                style={my}
                onChange={(e) => setLastName(e.target.value)}
              />

              <SoftInput
                placeholder="phoneNumber"
                value={phoneNumber}
                style={my}
                disabled
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftBox style={my}>
                <SoftSelect
                  placeholder="Select a Gender"
                  onChange={(selectedOption) => setGenderType(selectedOption)}
                  value={genderType}
                  options={[
                    { value: "ERKAK", label: "ERKAK" },
                    { value: "AYOL", label: "AYOL" },
                  ]}
                />
              </SoftBox>
              <SoftInput
                placeholder="birhtday"
                value={dateOfBirth}
                style={my}
                disabled
                onChange={(e) => setDateOfBirth(e.target.value)}
              />

              <SoftInput
                placeholder="email"
                value={email}
                style={my}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SoftBox display="flex" style={{ marginTop: "10px" }} alignItems="center">
                <Switch checked={verification} onChange={() => setVerification(!verification)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onChange={() => setVerification(!verification)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;{verification ? "VERIFICATION TRUE" : "VERIFICATION FALSE"}
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateUser.propTypes = {
  // myid: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func,
};
