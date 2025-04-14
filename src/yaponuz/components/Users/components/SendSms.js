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
import { Users, SMS, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function SendSms({ id, item }) {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setPhoneNumber(item.phoneNumber);
  }, [item]);

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
      const response = await SMS.smsTest(data);
      showAlert(response);
    } catch (err) {
      console.log("error send sms", err);
    }
  };

  return (
    <>
      <Tooltip title="Send SMS" onClick={handleClickOpen} placement="top">
        <Icon>send</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>SEND MESSAGE</DialogTitle>
        <DialogContent style={{ width: "300px" }}>
          <SoftInput
            placeholder="phoneNumber"
            value={phoneNumber}
            style={my}
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

SendSms.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
};
