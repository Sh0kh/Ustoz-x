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
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import { Users } from "yaponuz/data/api";

import SoftSelect from "components/SoftSelect";

export default function UpdateUser({ item, refetch }) {
  const [open, setOpen] = React.useState(false);

  console.log(item)

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [genderType, setGenderType] = useState();
  const [id, setId] = useState(item.id);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verification, setVerification] = useState();
  const [email, setEmail] = useState();
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (item) {
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
    }
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
      genderType: genderType?.value,
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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: { minHeight: "600px" }, // Увеличиваем высоту модального окна
        }}
      >
        <DialogTitle>Update Teacher</DialogTitle>
        <DialogContent>
          {/* Каждый input в отдельном блоке с label */}
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              First Name
            </SoftTypography>
            <SoftInput
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Last Name
            </SoftTypography>
            <SoftInput
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Phone Number
            </SoftTypography>
            <SoftInput
              placeholder="Phone Number"
              value={phoneNumber}
              disabled
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Gender
            </SoftTypography>
            <SoftSelect
              placeholder="Select a Gender"
              value={genderType}
              onChange={(selectedOption) => setGenderType(selectedOption)}
              options={[
                { value: "ERKAK", label: "ERKAK" },
                { value: "AYOL", label: "AYOL" },
              ]}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Birthday
            </SoftTypography>
            <SoftInput
              placeholder="Birthday"
              value={dateOfBirth}
              disabled
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
            <SoftInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </SoftBox>
          <SoftBox display="flex" alignItems="center" style={{ marginTop: "10px" }}>
            <Switch checked={verification} onChange={() => setVerification(!verification)} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;{verification ? "VERIFICATION TRUE" : "VERIFICATION FALSE"}
            </SoftTypography>
          </SoftBox>
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
  item: PropTypes.object,
  refetch: PropTypes.func,
};