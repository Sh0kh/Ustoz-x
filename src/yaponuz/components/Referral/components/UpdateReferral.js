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

import { Module } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function UpdateGroup({ id, item, refetch }) {
  const [open, setOpen] = useState(false);

  // variables
  const [formData, setFormData] = useState({});

  React.useEffect(() => {
    setFormData(item)
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

  // then add new Group function
  const showAlert = (response) => {
    function reload() {
      refetch();
    }
    if (response.success) {
      Swal.fire("Update", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  // add new Module function
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
      const response = await Module.updateModule(formData);
      loadingSwal.close();
      showAlert(response);
      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Group: ", err);
    }
  };

  console.log(formData)

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
        <DialogTitle>Update Group</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftTypography variant="caption">Group name</SoftTypography>
              <SoftInput
                placeholder="Group name"
                value={formData.name}
                style={my}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <SoftTypography variant="caption">Course id</SoftTypography>
              <SoftInput
                placeholder="Course id"
                value={formData.courseId}
                style={my}
                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              />

              <SoftTypography variant="caption">Icon id</SoftTypography>
              <SoftInput
                placeholder="Icon id"
                value={formData.iconId}
                style={my}
                onChange={(e) => setFormData({...formData, iconId: e.target.value})}
              />

              <SoftTypography variant="caption">Group price</SoftTypography>
              <SoftInput
                placeholder="Group price"
                value={formData.price}
                style={my}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateGroup.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func,
};