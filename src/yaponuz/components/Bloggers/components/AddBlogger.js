import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState, useMemo } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";

import { GetAuth, FileController, Bloggers, ArticleCategories } from "yaponuz/data/api";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import PropTypes from "prop-types";

export default function AddBlogger({ refetch }) {
  // open bool
  const [open, setOpen] = useState(false);

  // variable states
  const [fullName, setFullName] = useState("");
  const [bloggingType, setBloggingType] = useState("");
  const [bloggerId, setBloggerId] = useState();
  const [myInfo, setMyInfo] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [backgroundPhotoId, setBackgroundPhotoId] = useState("");
  const [socialMedia, setSocialMedia] = useState([
    {
      socialMediaURL: "",
      type: "FACEBOOK",
    },
  ]);
  let socialType = ["FACEBOOK", "INSTAGRAM", "TELEGRAM", "TIK_TOK", "X_TWITTER", "YOU_TUBE"];

  const [backgroundUrl, setBackgroundUrl] = useState();
  const [profileUrl, setProfileUrl] = useState();

  // functions close open
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useMemo(async () => {
    if (photoId !== "" && backgroundPhotoId !== "") {
      const url = await ArticleCategories.getOnePhoto(photoId);
      setProfileUrl(url);
      const backgroundUrl = await ArticleCategories.getOnePhoto(backgroundPhotoId);
      setBackgroundUrl(backgroundUrl);
    } else {
      console.log("empty string photoId and Background");
    }
  }, [photoId, backgroundPhotoId]);

  // then handleAdd
  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  // styles
  const my = { margin: "0px 0px 5px 0px" };

  // when click the add - handleAdd
  const handleAdd = async () => {
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
      // codes right here
      const data = {
        backgroundPhotoId,
        bloggerAccountId: bloggerId,
        photoId: photoId,
        socialMedia,
        myInfo,
        fullName,
        bloggingType,
      };

      const response = await Bloggers.addBlogger(data);
      loadingSwal.close();

      showAlert(response);
      setOpen(false);
    } catch (err) {
      console.log("Error From Bloggers: ", err);
    }
  };

  // when upload the avatar image
  // AVATAR
  const handleUploadPhoto = async (file) => {
    const category = "blogger";
    const userHashId = GetAuth.getUserHashId();
    try {
      const response = await FileController.uploadFile(file, category, userHashId);
      setPhotoId(response.object);
      console.log(response);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const handleUploadBackground = async (file) => {
    const category = "blogger";
    const userHashId = GetAuth.getUserHashId();
    try {
      const response = await FileController.uploadFile(file, category, userHashId);
      setBackgroundPhotoId(response.object);
      console.log(response);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  let defaultUrl =
    "https://fastly.picsum.photos/id/222/536/354.jpg?hmac=0F40OROL8Yvsv14Vjrqvhs8J3BjAdEC8IetqdiSzdlU";

  // return the JSX code!
  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info">
        + add blogger
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Blogger</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftBox style={my}>
                {/* Upload File code */}
                <SoftTypography variant="caption">Profile Image</SoftTypography> <br />
                {profileUrl && <img src={profileUrl ?? defaultUrl} alt="profile img" height={75} />}
                <SoftInput
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => handleUploadPhoto(e.target.files[0])}
                  style={my}
                />
              </SoftBox>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftBox style={my}>
                {/* Upload File code */}
                <SoftTypography variant="caption">Background Image</SoftTypography> <br />
                {backgroundUrl && (
                  <img src={backgroundUrl ?? defaultUrl} alt="background img" height={150} />
                )}
                <SoftInput
                  id="dropzone-file1"
                  type="file"
                  onChange={(e) => handleUploadBackground(e.target.files[0])}
                  style={my}
                />
              </SoftBox>
            </Grid>
          </Grid>
          {/* Social Media */}
          {socialMedia.map((item, index) => (
            <SoftBox key={index}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SoftTypography variant="caption">Social Media URL</SoftTypography>
                  <SoftSelect
                    options={socialType.map((item) => {
                      return {
                        value: item,
                        label: item,
                      };
                    })}
                    placeholder="Select the Type"
                    onChange={(select) => {
                      const updatedSocialMedia = [...socialMedia];
                      updatedSocialMedia[index].type = select.value;
                      setSocialMedia(updatedSocialMedia);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SoftTypography variant="caption">Social Media URL</SoftTypography>
                  <SoftInput
                    placeholder="Social Media URL"
                    value={item.socialMediaURL}
                    style={my}
                    onChange={(e) => {
                      const updatedSocialMedia = [...socialMedia];
                      updatedSocialMedia[index].socialMediaURL = e.target.value;
                      setSocialMedia(updatedSocialMedia);
                    }}
                  />
                </Grid>

                <Grid item xs={2} style={{ margin: "-1px 0px" }}>
                  <SoftTypography variant="caption">Add</SoftTypography>
                  <SoftButton
                    variant="contained"
                    color="dark"
                    size="default"
                    onClick={() =>
                      setSocialMedia([...socialMedia, { socialMediaURL: "", type: "FACEBOOK" }])
                    }
                  >
                    +
                  </SoftButton>
                </Grid>
                <Grid item xs={2} style={{ margin: "-1px 0px" }}>
                  <SoftTypography variant="caption">Delete</SoftTypography>
                  <SoftButton
                    variant="contained"
                    color="error"
                    onClick={() => {
                      const updatedSocialMedia = [...socialMedia];
                      updatedSocialMedia.splice(index, 1);
                      setSocialMedia(updatedSocialMedia);
                    }}
                  >
                    <Icon>delete</Icon>
                  </SoftButton>
                </Grid>
              </Grid>
            </SoftBox>
          ))}
          {/* bloggers */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Blogging Type */}
              <SoftBox style={my}>
                <SoftTypography variant="caption">Blogging Type</SoftTypography>
                <SoftInput
                  placeholder="Blogging Type"
                  value={bloggingType}
                  style={my}
                  onChange={(e) => setBloggingType(e.target.value)}
                />

                {/* ... will be */}
                {/*
                <SoftSelect
                  placeholder="Select Shop FOOD type"
                  onChange={(selectedOption) => setShopFoodType(selectedOption.value)} // Adjusted onChange function
                  options={[
                    { value: "UNCHECKED", label: "UNCHECKED" },
                    { value: "HALAL", label: "HALAL" },
                    { value: "XAROM", label: "XAROM" },
                    { value: "DOUBTFUL", label: "DOUBTFUL" },
                  ]}
                />
                */}
              </SoftBox>
            </Grid>

            <Grid item xs={6}>
              {/* Blogger ID */}
              <SoftTypography variant="caption">Blogger ID</SoftTypography>
              <SoftInput
                placeholder="Blogging Type"
                type="number"
                value={bloggerId}
                style={my}
                onChange={(e) => setBloggerId(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* fullname and info */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* FullName */}
              <SoftTypography variant="caption">Full Name</SoftTypography>
              <SoftInput
                placeholder="FullName"
                value={fullName}
                style={my}
                onChange={(e) => setFullName(e.target.value)}
              />

              {/* Info */}
              <SoftTypography variant="caption">Info</SoftTypography>
              <SoftInput
                placeholder="Write info"
                value={myInfo}
                style={my}
                onChange={(e) => setMyInfo(e.target.value)}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add Blogger</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddBlogger.propTypes = {
  refetch: PropTypes.func.isRequired,
};
