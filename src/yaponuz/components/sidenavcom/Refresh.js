import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import SoftInput from "components/SoftInput";
import { Users, SMS, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import PropTypes from "prop-types";

export default function Refresh() {
  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("sended!", response.message, "success");
    } else {
      Swal.fire("error", response.message || response.error, "error");
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await SMS.refreshToken();
      console.log(response);
      showAlert(response);
    } catch (err) {
      console.log("error send sms refresh token", err);
    }
  };

  return (
    <SoftButton
      onClick={handleRefresh}
      color="info"
      style={{ width: "80%" }}
      variant="outlined"
      size="small"
    >
      Refresh Token
    </SoftButton>
  );
}
