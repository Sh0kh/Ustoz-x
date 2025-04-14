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
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import { Notification } from "yaponuz/data/controllers/notification";

import SoftTypography from "components/SoftTypography";

export default function AddNotification() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");
  const [photoId, setPhotoId] = useState(0);


  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [users, setUsers] = useState([]);

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    const getAllUsers = async () => {
      setLoading(true);
      try {
        const response = await Users.getUsers(page, size, firstName, lastName, phoneNumber);
        setUsers(response.object.content);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  const usersList = users.map((user) => ({
    value: user.firstName,
    label: user.firstName,
    id: user.id,
  }));

  // css variables
  const my = { margin: "5px 0px" };

  // then add new Notification function
  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added", response.message, "success").then();
    } else {
      Swal.fire("error", response.message || response.error, "error").then();
    }
  };

  // add new Notification function
  const handleSave = async () => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Adding...",
        text: "Please Wait!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const data = {
        creatorId: localStorage.getItem("userId"),
        description: description,
        id: 0,
        photoId: photoId,
        studentId: studentId,
        title: title,
      };

      const response = await Notification.createNotification(data);
      Swal.close();
      showAlert(response);

      // clear the data after success response
      setTitle("");
      setDescription("");
      setStudentId("");

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Notification: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">
        + add new Notification
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add New Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Title */}
              <SoftTypography variant="caption">Title</SoftTypography>
              <SoftInput
                placeholder="Title"
                style={my}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Student ID */}
              <SoftTypography variant="caption">Student ID</SoftTypography>
              <SoftSelect
                placeholder="Select Student"
                options={usersList}
                onChange={(e) => setStudentId(e.id)}
              />

              {/* Photo ID */}
              <SoftTypography variant="caption">Photo ID</SoftTypography>
              <SoftInput
                placeholder="Photo ID"
                style={my}
                value={photoId}
                onChange={(e) => setPhotoId(e.target.value)}
              />

              {/* Description */}
              <SoftTypography variant="caption">Description</SoftTypography>
              <SoftInput
                placeholder="Description"
                multiline
                rows={5}
                style={my}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Adding..." : "Add Notification"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddNotification.propTypes = {
  refetch: PropTypes.func,
};
