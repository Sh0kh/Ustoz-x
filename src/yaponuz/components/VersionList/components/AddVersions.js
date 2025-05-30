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

import { Version } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function AddVersion({ refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [version, setVersion] = useState("");
  const [life, setLife] = useState(false);
  const [comment, setComment] = useState("");

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // then add new version function
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

  // add new version function
  const handleSave = async () => {
    try {
      const loadingSwal = Swal.fire({
        title: "Adding...",
        text: "Please Wait!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const data = { version, life, comment };
      const response = await Version.createVersion(data);
      loadingSwal.close();

      showAlert(response);

      // clear the data
      setVersion("");
      setComment("");
      setLife(false);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Version: ", err);
    }
  };

  // return the JSX code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new version
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Version</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* version */}
              <SoftTypography variant="caption">Version</SoftTypography>
              <SoftInput
                placeholder="version"
                value={version}
                style={my}
                onChange={(e) => setVersion(e.target.value)}
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
          <Button onClick={handleSave}>Add Version</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddVersion.propTypes = {
  refetch: PropTypes.func,
};
