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

import { Notification } from "yaponuz/data/controllers/notification";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useParams } from "react-router-dom";
import { FileController } from "yaponuz/data/api";

export default function UpdateNotification({ id, item, refetch }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const { ID } = useParams()
  const [fileId, setFileId] = useState(null)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


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


  React.useEffect(() => {
    if (item) {
      setTitle(item?.title)
      setDescription(item?.description)
      setFileId(item?.photoId)
    }
  }, [item])

  const upload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("Iltimos, fayl tanlang!");
      return;
    }
    const response = await uploadHandle(selectedFile, "education_icon");
    setFileId(response?.object?.id)
  };
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

      const data = {
        id: id,
        creatorId: Number(localStorage.getItem("userId")),
        description: description,
        photoId: Number(fileId),
        studentId: Number(ID),
        title: title,
      };

      const response = await Notification.updateNotifiction(data);
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
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Notification</DialogTitle>
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
            {loading ? "Editing..." : "Edit Notification"}
          </Button>
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
