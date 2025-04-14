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
import { ArticleCategories, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";

export default function UpdateCategory({ myid, itemme, refetch }) {
  const [open, setOpen] = React.useState(false);
  const [iconId, setIconId] = useState(itemme.iconId);
  const [name, setName] = useState(itemme.name);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const userId = GetAuth.getUserId();

    try {
      const data = {
        id: myid,
        iconId: iconId,
        name,
        userId,
      };

      if (itemme.parentId !== null) {
        data.parentId = itemme.parentId;
      }

      const response = await ArticleCategories.updateCategory(data);
      showAlert(response);
      setOpen(false);
    } catch (error) {
      showAlert(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async (file) => {
    const category = "icon";
    const userHashId = GetAuth.getUserHashId();
    try {
      const response = await FileController.uploadFile(file, category, userHashId);
      setIconId(response.object);
      console.log(response);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const my = { margin: "5px 0px" };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftInput
                id="dropzone-file"
                type="file"
                onChange={(e) => handleUpload(e.target.files[0])}
                style={my}
              />
              <SoftInput
                placeholder="Category name"
                value={name}
                style={my}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Category</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateCategory.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
