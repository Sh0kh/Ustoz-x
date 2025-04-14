import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import { Air, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";

export default function UpdateAir({ myid, itemme, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [context, setContext] = useState(itemme.context);
  const [title, setTitle] = useState(itemme.title);
  const [price, setPrice] = useState(itemme.price);
  const [active, setActive] = useState(itemme.deleted);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  React.useEffect(() => {
    setContext(itemme.context);
    setTitle(itemme.title);
    setPrice(itemme.price);
    setActive(itemme.deleted);
  }, [itemme]);

  const handleSave = async () => {
    // const userId = GetAuth.getUserId();

    const data = {
      active,
      context: context,
      creator: itemme.createdBy,
      price: price,
      title: title,
      id: myid,
    };

    console.log(JSON.stringify(data));

    try {
      const response = await Air.updateAirticket(data);
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
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Update Air Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ width: "300px" }}>
            <Grid item xs={12}>
              <SoftInput
                placeholder="Title"
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
              <SoftBox display="flex" alignItems="center">
                <Switch checked={active} onChange={() => setActive(!active)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onChange={() => setActive(!active)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;{active ? "active" : "not active"}
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Air Ticket</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateAir.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
  refetch: PropTypes.func,
};
