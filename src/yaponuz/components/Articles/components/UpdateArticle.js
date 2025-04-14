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
import { Article, GetAuth, FileController } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftEditor from "components/SoftEditor";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function UpdateArticle({ myid, itemme, refetch }) {
  const [open, setOpen] = useState(false);

  const [iconId, setIconId] = useState(itemme.photoId);
  const [title, setTitle] = useState(itemme.title);
  const [active, setActive] = useState(itemme.active);
  const [context, setContext] = useState(itemme.context);
  const [youTubeLink, setYouTubeLink] = useState(itemme.youTubeLink);
  const [createdBy, setCreatedBy] = useState(0);

  useEffect(() => {
    setIconId(itemme.photoId);
    setTitle(itemme.title);
    setActive(itemme.active);
    setContext(itemme.context);
    setYouTubeLink(itemme.youTubeLink);
    setCreatedBy(itemme.createdBy);
  }, [itemme]);

  const handleActive = () => setActive(!active);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const userId = GetAuth.getUserId();
    const data = {
      id: itemme.id,
      active,
      categoryId: itemme.categoryId,
      context: context,
      creatorId: createdBy,
      photoId: iconId,
      title,
      youTubeLink,
    };

    // console.log(data);

    try {
      const response = await Article.updateArticle(data);
      console.log(response);
      showAlert(response);
      setOpen(false);
    } catch (error) {
      console.error("Error creating article:", error.message);
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

  const my = { margin: "5px 0px" };
  const pmy = { margin: "5px 0px", height: "100%" };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Article</DialogTitle>
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
            <Grid item xs={5} p={2}>
              <SoftTypography variant="caption">Upload New Image</SoftTypography>
              <SoftInput
                id="dropzone-file"
                type="file"
                onChange={(e) => handleUpload(e.target.files[0])}
                style={my}
              />

              <SoftTypography variant="caption">Article Title</SoftTypography>

              <SoftInput
                placeholder="Article title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />

              <SoftTypography variant="caption">YouTube Link (optional)</SoftTypography>

              <SoftInput
                placeholder="YouTube Link"
                value={youTubeLink}
                style={my}
                onChange={(e) => setYouTubeLink(e.target.value)}
              />

              <SoftTypography variant="caption">Creator ID</SoftTypography>

              <SoftInput
                placeholder="Created By"
                value={createdBy}
                style={my}
                onChange={(e) => setCreatedBy(e.target.value)}
              />
              <SoftTypography variant="caption">Article Status</SoftTypography>

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
          <Button onClick={handleSave}>Update Artilce</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateArticle.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
  refetch: PropTypes.func,
};
