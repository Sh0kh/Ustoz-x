import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import { Other, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function UpdateOther({ myid, itemme, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [context, setContext] = useState(itemme.description);
  const [title, setTitle] = useState(itemme.title);
  const [phone, setPhone] = useState(itemme.phone);
  const [active, setActive] = useState(itemme.deleted);
  const [createdBy, setCreatedBy] = useState(itemme.createdBy);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    setContext(itemme.description);
    setTitle(itemme.title);
    setPhone(itemme.phone);
    setActive(itemme.deleted);
    setCreatedBy(itemme.createdBy);
  }, [itemme]);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
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
      description: context,
      creatorId: createdBy,
      id: myid,
      phone,
      title,
      active,
    };

    try {
      const response = await Other.updateOther(data);
      loadingSwal.close();
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Other Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ width: "400px", minHeight: "400px" }}>
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
              <SoftTypography variant="caption">Status</SoftTypography>

              <SoftBox display="flex" style={{ margin: "5px 0px" }} alignItems="center">
                <Switch checked={active} onChange={() => setActive(!active)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={() => setActive(!active)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;is Active
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Other Service</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateOther.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
