// @mui material komponentlar
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React komponentlar
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Sozlamalar sahifasi komponentlari
import FormField from "layouts/pages/account/components/FormField";
import { Users } from "yaponuz/data/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function ChangePassword() {
  const { ID } = useParams();
  const [password, setPassword] = useState("");

  const passwordRequirements = [
    "Bitta maxsus belgi",
    "Kamida 8 ta belgidan iborat bo‘lsin",
    "Bitta raqam (2 ta tavsiya etiladi)",
    "Tez-tez o‘zgartirib turing",
  ];

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Yangilandi!", response.message, "success");
    } else {
      Swal.fire("Yangilanmadi!", response.message || response.error, "error");
    }
  };

  const editPassword = async () => {
    try {
      const data = {
        id: ID,
        password: password,
      };
      const response = await Users.updateUserPassword(data);
      showAlert(response);
    } catch (error) {
      console.error(error);
      showAlert(error);
    }
  };

  const renderPasswordRequirements = passwordRequirements.map((item, key) => (
    <SoftBox key={`requirement-${key}`} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
      <SoftTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
        {item}
      </SoftTypography>
    </SoftBox>
  ));

  return (
    <Card id="change-password">
      <SoftBox p={3}>
        <SoftTypography variant="h5">Parolni o‘zgartirish</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormField
              label="Yangi parol"
              placeholder="Yangi parolni kiriting"
              inputProps={{ type: "password", autoComplete: "new-password" }}
              value={password}
              onChange={handlePasswordChange}
            />
          </Grid>
        </Grid>
        <SoftBox mt={6} mb={1}>
          <SoftTypography variant="h5">Parol talablari</SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftTypography variant="body2" color="text">
            Kuchli parol uchun ushbu qo‘llanmaga rioya qiling
          </SoftTypography>
        </SoftBox>
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <SoftBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
            {renderPasswordRequirements}
          </SoftBox>
          <SoftBox ml="auto">
            <SoftButton onClick={editPassword} variant="gradient" color="dark" size="small">
              Parolni yangilash
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ChangePassword;
