// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";
import { Users } from "yaponuz/data/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function ChangePassword() {
  const { ID } = useParams();
  const [password, setPassword] = useState("");

  const passwordRequirements = [
    "One special character",
    "Min 8 characters",
    "One number (2 are recommended)",
    "Change it often",
  ];

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success");
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error");
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
        <SoftTypography variant="h5">Change Password</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormField
              label="New Password"
              placeholder="Enter new password"
              inputProps={{ type: "password", autoComplete: "new-password" }}
              value={password}
              onChange={handlePasswordChange}
            />
          </Grid>
        </Grid>
        <SoftBox mt={6} mb={1}>
          <SoftTypography variant="h5">Password requirements</SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftTypography variant="body2" color="text">
            Please follow this guide for a strong password
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
              Update Password
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ChangePassword;
