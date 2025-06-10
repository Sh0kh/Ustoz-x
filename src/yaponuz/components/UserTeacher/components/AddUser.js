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

import { Teacher } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";

export default function AddUser({ refetch }) {
  const [open, setOpen] = useState(false);

  // State variables
  const [dateBirth, setDateBirth] = useState("2007-01-01");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const [genderType, setGenderType] = useState("ERKAK");

  // Modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const { value } = e.target;

    if (/^\+998\d*$/.test(value)) {
      if (value.length <= 13) {
        setPhoneNumber(value);
      }
    } else if (value === "") {
      setPhoneNumber("+998");
    }
  };

  // Save the data and add new user function
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

  // Show alert after adding a new user
  const showAlert = (response) => {
    function reload() {
      refetch();
      handleClose();

      // Clear data
      setDateBirth("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("+998");
      setPassword("");
      setGenderType("ERKAK");
    }

    if (response.success) {
      Swal.fire("Yangi o‘qituvchi qo‘shildi", response.message, "success").then(() => reload());
    } else {
      Swal.fire("Xatolik", response.message || response.error, "error").then(() => reload());
    }
  };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + Yangi o‘qituvchi qo‘shish
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
          Yangi o‘qituvchi qo‘shish
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {/* Ism */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Ism
              </SoftTypography>
              <SoftInput
                placeholder="Ism kiriting"
                value={firstName}
                fullWidth
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>

            {/* Familiya */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Familiya
              </SoftTypography>
              <SoftInput
                placeholder="Familiya kiriting"
                value={lastName}
                fullWidth
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>

            {/* Telefon raqami */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Telefon raqami
              </SoftTypography>
              <SoftInput
                placeholder="+998"
                value={phoneNumber}
                fullWidth
                onChange={handlePhoneChange}
              />
            </Grid>

            {/* Parol */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Parol
              </SoftTypography>
              <SoftInput
                placeholder="Parol kiriting"
                type="password"
                value={password}
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            {/* Jinsi */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Jinsi
              </SoftTypography>
              <SoftSelect
                placeholder="Jinsini tanlang"
                value={genderType}
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
            </Grid>

            {/* Tug‘ilgan sana */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Tug‘ilgan sana
              </SoftTypography>
              <SoftDatePicker
                placeholder="Tug‘ilgan sana"
                value={dateBirth}
                fullWidth
                onChange={(newDate) => setDateBirth(newDate)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleClose} color="secondary">
            Bekor qilish
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            O‘qituvchi qo‘shish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddUser.propTypes = {
  refetch: PropTypes.func.isRequired,
};