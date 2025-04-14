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

import { GetAuth, Air } from "yaponuz/data/api";

export default function AddAir({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const [context, setContext] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const userId = GetAuth.getUserId();
    const data = {
      context: context,
      creator: userId,
      price: price,
      title: title,
    };

    try {
      const response = await Air.createAiricket(data);
      console.log(response);
      showAlert(response);
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
        + add air ticket
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Air Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ width: "300px" }}>
            <Grid item xs={12}>
              <SoftInput
                placeholder="title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />

              <SoftInput
                placeholder="price"
                value={price}
                style={my}
                onChange={(e) => setPrice(e.target.value)}
              />
              <SoftInput
                placeholder="description"
                value={context}
                multiline
                rows={5}
                style={my}
                onChange={(e) => setContext(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Job</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddAir.propTypes = {
  refetch: PropTypes.func,
};
