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

import { GetAuth, Other } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";

export default function AddOther({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const [context, setContext] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
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
    const userId = GetAuth.getUserId();
    const data = {
      description: context,
      creatorId: userId,
      phone,
      title,
    };

    try {
      // request
      const response = await Other.createOther(data);
      loadingSwal.close();
      showAlert(response);

      // clearing
      setTitle("");
      setContext("");
      setPhone("");

      // closing
      setOpen(false);
    } catch (error) {
      console.error("Error creating article category:", error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add other services
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Other Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ width: "300px" }}>
            <Grid item xs={12}>
              <SoftTypography variant="caption">Title</SoftTypography>
              <SoftInput
                placeholder="Title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />
              <SoftTypography variant="caption">Phone Number</SoftTypography>

              <SoftInput
                placeholder="Phone Number"
                value={phone}
                style={my}
                onChange={(e) => setPhone(e.target.value)}
              />

              <SoftTypography variant="caption">Description</SoftTypography>

              <SoftInput
                value={context}
                onChange={(e) => setContext(e.target.value)}
                style={my}
                placeholder="Description ..."
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Service</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddOther.propTypes = {
  refetch: PropTypes.func,
};
