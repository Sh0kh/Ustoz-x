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

import { GetAuth, ArticleCategories, FileController } from "yaponuz/data/api";

export default function AddCategory({ parentId, refetch }) {
  const [open, setOpen] = useState(false);
  const [iconId, setIconId] = useState("");
  const [name, setName] = useState("");

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
      iconId,
      name,
      userId,
    };

    if (parentId != null) {
      data.parentId = parentId;
    }

    console.log(data);

    try {
      const response = await ArticleCategories.createCategory(data);
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
      <SoftButton variant="outlined" onClick={handleClickOpen} color="info">
        + add category
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Category</DialogTitle>
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
          <Button onClick={handleSave}>Add Category</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddCategory.propTypes = {
  parentId: PropTypes.number,
  refetch: PropTypes.func,
};
