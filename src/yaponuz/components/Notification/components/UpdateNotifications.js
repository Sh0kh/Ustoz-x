import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

import { Notification } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function UpdateNotification({ id, item, refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [Notification, setNotification] = useState("");
  const [life, setLife] = useState(false);
  const [comment, setComment] = useState("");

  React.useEffect(() => {
    setNotification(item.Notification);
    setLife(item.life);
    setComment(item.comment);
  }, [id, item]);

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // then add new Notification function
  const showAlert = (response) => {
    function reload() {
      refetch();
    }
    if (response.success) {
      Swal.fire("Added", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  // add new Notification function
  const handleSave = async () => {
    try {
      const loadingSwal = Swal.fire({
        title: "Updating...",
        text: "Please Wait!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const data = { Notification, id, life, comment };
      const response = await Notification.updateNotification(id, data);
      loadingSwal.close();

      showAlert(response);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Notification: ", err);
    }
  };

  // return the JSX code
  return (
    <>
      <SoftTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
        onClick={handleClickOpen}
      >
        <Tooltip title="Edit" placement="top">
          <Icon>edit</Icon>
        </Tooltip>
      </SoftTypography>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Update Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Notification */}
              <SoftTypography variant="caption">Notification</SoftTypography>
              <SoftInput
                placeholder="Notification"
                value={Notification}
                style={my}
                onChange={(e) => setNotification(e.target.value)}
              />
              {/* life */}
              <SoftTypography variant="caption">Life</SoftTypography>

              <SoftBox display="flex" alignItems="center">
                <Switch checked={life} onChange={() => setLife(!life)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={() => setLife(!life)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;LIFE - {life ? "TRUE" : "FALSE"}
                </SoftTypography>
              </SoftBox>

              {/* Comment */}
              <SoftTypography variant="caption">Comment</SoftTypography>

              <SoftInput
                placeholder="comment"
                value={comment}
                multiline
                rows={5}
                style={my}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Notification</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateNotification.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func,
};
