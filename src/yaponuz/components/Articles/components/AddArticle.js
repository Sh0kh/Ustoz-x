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
import SoftEditor from "components/SoftEditor";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import SoftButton from "components/SoftButton";

import { GetAuth, Article, FileController } from "yaponuz/data/api";

export default function AddArticle({ parentId, refetch }) {
  const [open, setOpen] = useState(false);
  const [iconId, setIconId] = useState("");
  const [title, setTitle] = useState("");
  const [active, setActive] = useState(true);
  const [context, setContext] = useState("");
  const [youTubeLink, setYouTubeLink] = useState("");

  const handleActive = () => setActive(!active);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
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
  ];

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
      active,
      categoryId: parentId,
      context,
      creatorId: userId,
      photoId: iconId,
      title,
      youTubeLink,
    };

    console.log(data);

    try {
      const response = await Article.createArticleCategory(data);
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
  const pmy = { margin: "5px 0px", height: "100%" };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add article
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add article</DialogTitle>
        <DialogContent style={{ minHeight: "300px" }}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <ReactQuill
                className="my-4"
                theme="snow"
                value={context}
                onChange={setContext}
                modules={modules}
                formats={formats}
                style={{ height: "100%" }}
              />
            </Grid>
            <Grid item xs={5}>
              <SoftInput
                id="dropzone-file"
                type="file"
                onChange={(e) => handleUpload(e.target.files[0])}
                style={my}
              />
              <SoftInput
                placeholder="Article title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />
              <SoftInput
                placeholder="YouTube Link"
                value={youTubeLink}
                style={my}
                onChange={(e) => setYouTubeLink(e.target.value)}
              />
              <SoftBox display="flex" alignItems="center">
                <Switch checked={active} onChange={handleActive} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={handleActive}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;isActive
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Article</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddArticle.propTypes = {
  parentId: PropTypes.number,
  refetch: PropTypes.func,
};
