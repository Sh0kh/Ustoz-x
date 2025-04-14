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

export default function SendSMS() {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("sended!", response.message, "success");
    } else {
      Swal.fire("error", response.message || response.error, "error");
    }
  };

  const handleSend = async () => {
    const data = {
      phoneNumber,
      message,
    };

    try {
      const response = await SMS.sendSMS(data);
      showAlert(response);
      setOpen(false);
    } catch (err) {
      console.log("error send sms", err);
    }
  };

  return (
    <>
      <SoftButton
        onClick={handleClickOpen}
        color="info"
        style={{ width: "80%" }}
        variant="outlined"
        size="small"
      >
        Send SMS
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>SEND MESSAGE</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <SoftInput
            placeholder="phoneNumber"
            value={phoneNumber}
            style={{ ...my, marginBottom: "16px" }}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <SoftInput
            placeholder="message"
            value={message}
            size="large"
            style={my}
            multiline
            rows={5}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SoftTypography
            color="secondary"
            opacity="0.7"
            variant="overline"
          >{`${message.length}/160`}</SoftTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend}>SEND MESSAGE</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
