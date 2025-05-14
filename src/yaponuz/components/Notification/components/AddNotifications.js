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
import { useParams } from "react-router-dom";
import SoftBox from "components/SoftBox";
import { FileController } from "yaponuz/data/api";

export default function AddNotification({ refetch, selectedStudents }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ID } = useParams()

  // variables
  const [fileId, setFileId] = useState(null)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");



  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  // css variables
  const my = { margin: "5px 0px" };


  const uploadHandle = async (file, category) => {
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

    try {
      const response = await FileController.uploadFile(
        file,
        category,
        localStorage.getItem("userId")
      );
      loadingSwal.close();
      if (response.success) {
        Swal.fire("Added", response.message, "success");
      } else {
        Swal.fire("error", response.message || response.error, "error");
      }
      return response;
    } catch (err) {
      loadingSwal.close();
      console.error("Error uploading file:", err.response || err);
      Swal.fire("Upload Failed", err.response?.data?.message || err.message, "error");
      return false;
    }
  };

  const upload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("Iltimos, fayl tanlang!");
      return;
    }
    const response = await uploadHandle(selectedFile, "education_icon");
    setFileId(response?.object?.id)
  };

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
        photoId: fileId,
        studentIds: ID ? [Number(ID)] : selectedStudents,
        title: title,
      };

      const response = await Notification.createNotification(data);
      Swal.close();
      showAlert(response);
      handleClose()
      refetch()
      // clear the data after success response
      setTitle("");
      setDescription("");
      setFileId(null)
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



              <SoftBox>
                <SoftTypography variant="caption">Upload file</SoftTypography>
                <SoftInput
                  type="file"
                  onChange={(e) => upload(e)}
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                />
              </SoftBox>

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
  selectedStudents:PropTypes.array
};
