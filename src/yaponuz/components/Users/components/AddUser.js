import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import SoftButton from "components/SoftButton";
import { useState } from "react";
import PropTypes from "prop-types";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import { Users } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import { Group } from "yaponuz/data/controllers/group";

export default function AddUser({ refetch }) {
  const [open, setOpen] = useState(false);

  // State variables
  const [dateBirth, setDateBirth] = useState("2025-01-02");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const [genderType, setGenderType] = useState("ERKAK");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroupValue, setSelectedGroupValue] = useState("");

  // Modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Save the data and add new user function
  const handleSave = async () => {
    const data = {
      dateOfBirth: new Date(dateBirth).toISOString(),
      firstName,
      lastName,
      phoneNumber,
      password,
      genderType: genderType?.value || null,
      accountType: "STUDENT",
      creatorId: localStorage.getItem("userId"),
      confirmPassword: password,
      email,
      groupId: selectedGroupValue.value || null,
    };

    try {
      const response = await Users.createUser(data);
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
      setDateBirth("2025-01-02");
      setFirstName("");
      setLastName("");
      setPhoneNumber("+998");
      setPassword("");
      setGenderType("ERKAK");
      setEmail("");
      setSelectedGroupValue("");
    }

    if (response.success) {
      Swal.fire("New user added", response.message, "success").then(() => reload());
    } else {
      Swal.fire("Error", response.message || response.error, "error").then(() => reload());
    }
  };

  // Fetch all groups
  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      const groups = response.object || [];

      // Map the fetched data to match the expected format of SoftSelect options
      const formattedOptions = groups.map((group) => ({
        label: group.name,
        value: group.id,
      }));

      setGroupOptions(formattedOptions);
    } catch (err) {
      console.error("Error fetching groups list: ", err);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;

    // Проверяем, что значение соответствует формату +998 и содержит только цифры
    if (/^\+998\d*$/.test(value)) {
      // Ограничиваем длину номера до 13 символов (+998 и 9 цифр)
      if (value.length <= 13) {
        setPhoneNumber(value);
      }
    } else if (value === "") {
      // Если поле очищено, возвращаем значение по умолчанию "+998"
      setPhoneNumber("+998");
    }
  };
  // Fetch groups on component mount
  React.useEffect(() => {
    getAllGroups(page, size);
  }, [page, size]);



  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + Yangi talaba qo‘shish
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
          Yangi talaba qo‘shish
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {/* Guruh tanlash */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Guruh
              </SoftTypography>
              <SoftSelect
                placeholder="Guruh tanlang"
                value={selectedGroupValue}
                onChange={(selectedOption) => setSelectedGroupValue(selectedOption)}
                options={groupOptions}
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

            {/* Ism */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Ism
              </SoftTypography>
              <SoftInput
                placeholder="Ism"
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
                placeholder="Familiya"
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
                // placeholder="Telefon raqami"
                value={phoneNumber}
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Email
              </SoftTypography>
              <SoftInput
                placeholder="Email"
                value={email}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            {/* Parol */}
            <Grid item xs={12}>
              <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Parol
              </SoftTypography>
              <SoftInput
                placeholder="Parol"
                value={password}
                type="password"
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
                onChange={(selectedOption) => setGenderType(selectedOption)}
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
          <Button onClick={handleSave} variant="contained" color="white" >
            Talaba qo‘shish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
AddUser.propTypes = {
  refetch: PropTypes.func.isRequired,
};