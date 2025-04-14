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
import { Quiz } from "yaponuz/data/api";
import PropTypes from "prop-types";

export default function AddModule({refresh, lessonID }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  // variables


  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = {
    margin: "5px 0px",
    width: '100%'
  };

  const createQuizModule = async () => {
    try {
      const data = {
        name: name,
        creatorId: localStorage.getItem('userId'),
        lessonId: lessonID
      }
      const response = await Quiz.createQuizModule(data)
      Swal.fire("new Module added", response.message, "success");
      handleClose()
      refresh()
    } catch (error) {
      Swal.fire("error", response.message || response.error, "error");
    }
  }


  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add new Module
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <SoftInput
            placeholder="Name"
            value={name}
            style={my}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createQuizModule}>Add new Module</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddModule.propTypes = {
  lessonID: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
};