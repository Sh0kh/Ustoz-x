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

import { Referral } from "yaponuz/data/api";
import { Course } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";

export default function AddReferral() {
  const [open, setOpen] = useState(false);

  // variables
  const [formData, setFormData] = useState({recommendedUserId: localStorage.getItem('userId')})

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // then add new Referral function
  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added", response.message, "success");
    } else {
      Swal.fire("error", response.message || response.error, "error");
    }
  };

  // add new Referral function
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

        console.log("FormData before sending:", formData);
        const response = await Referral.createReferral(formData);
        console.log(response)
        loadingSwal.close();

        showAlert(response);
        setFormData((values) => ({ ...values, refCode: "" }));
        setOpen(false); // close the modal
      } catch (err) {
        console.log("Error from handleSave from add Referral: ", err);
      }
    };


  // return the JSX code
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new Referral
      </SoftButton>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Add New Referral</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Referral */}
              <SoftTypography variant="caption">Referral code</SoftTypography>
              <SoftInput
                placeholder="Referral name"
                value={formData.refCode}
                style={my}
                onChange={(e) => setFormData({...formData, refCode: e.target.value})}
              />

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Referral</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddReferral.propTypes = {
  refetch: PropTypes.func,
};