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
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";

export default function UpdateUser({ item, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [genderType, setGenderType] = useState({ value: "", label: "" });
  const [id, setId] = useState(item.id);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verification, setVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (item) {
      setFirstName(item.firstName || "");
      setLastName(item.lastName || "");
      setGenderType({ value: item.genderType || "", label: item.genderType || "" });
      setId(item.id || "");
      setPhoneNumber(item.phoneNumber || "");
      setVerification(item.verification || false);
      setEmail(item.email || "");
      const birthDate = item.dateBirth ? new Date(item.dateBirth) : null;
      setDateOfBirth(
        birthDate
          ? birthDate.toISOString().replace(/T/, " ").replace(/\..+/, "")
          : ""
      );
    }
  }, [item]);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Yangilandi!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Yangilanmadi!", response.message || response.error, "error").then(() => refetch());
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

  const my = { margin: "10px 0" }; // Отступы между элементами

  return (
    <>
      <Tooltip title="Tahrirlash" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: { minHeight: "600px" },
        }}
      >
        <DialogTitle>Adminni yangilash</DialogTitle>
        <DialogContent>
          {/* Har bir input uchun o‘zbekcha label va placeholder */}
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Ism
            </SoftTypography>
            <SoftInput
              placeholder="Ism"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Familiya
            </SoftTypography>
            <SoftInput
              placeholder="Familiya"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Telefon raqami
            </SoftTypography>
            <SoftInput
              placeholder="Telefon raqami"
              value={phoneNumber}
              disabled
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Jinsi
            </SoftTypography>
            <SoftSelect
              placeholder="Jinsini tanlang"
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
              Tug‘ilgan sana
            </SoftTypography>
            <SoftInput
              placeholder="Tug‘ilgan sana"
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
              &nbsp;&nbsp;{verification ? "TASDIQLANDI" : "TASDIQLANMAGAN"}
            </SoftTypography>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Bekor qilish</Button>
          <Button onClick={handleSave}>Adminni yangilash</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateUser.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    genderType: PropTypes.string,
    phoneNumber: PropTypes.string,
    verification: PropTypes.bool,
    email: PropTypes.string,
    dateBirth: PropTypes.string,
  }),
  refetch: PropTypes.func,
};