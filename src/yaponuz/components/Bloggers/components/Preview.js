import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { ArticleCategories } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { getDateFilter } from "yaponuz/components/utils/main";
import SoftBox from "components/SoftBox";

export default function PreviewBlogger({ user }) {
  const [open, setOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useMemo(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const profile = await ArticleCategories.getOnePhoto(user.photoId);
        const background = await ArticleCategories.getOnePhoto(user.backgroundPhotoId);

        // setting urls
        setProfileUrl(profile);
        setBackgroundUrl(background);
        setIsLoading(false);
      } catch (err) {
        console.log("Error from Bloggers Preview: ", err);
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [user]);

  let empty = "empty";

  return (
    <>
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Preview Blogger</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "300px",
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={profileUrl}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            </Box>
          )}
          {/* 
          "id": 3,
            "createdAt": "2024-05-24T20:31:41.934591",
            "createdBy": null,
            "updatedAt": "2024-06-22T13:56:02.978832",
            "modifiedBy": null,
            "deletedBy": null,
            "deleted": false,
            "photoId": "136183308054292468519880877378112540744",
            "backgroundPhotoId": "85007488957074053788245972728832975424",
            "bloggerAccountId": 54,
            "fullName": "Burkhonjon Turdialiev",
            "bloggingType": "Auto Bloger",
            "myInfo": "wefewf wef \newfwe\nf\nwef\nwe\nfwe\nfwe\nfwrgawrgagarg\nasrg\nwrg\na\ngasr\ngasr\ngr\ng\narsg\nsra\ngwrgwragwagwargwargarwgawrgarw\ngrw\ngawr\ng\nawrg\nwarg\nwarg\nwar\ngarw\ng",
            "socialMedia": [
                {
                    "socialMediaURL": "@testuser",
                    "type": "TELEGRAM"
                },
                {
                    "socialMediaURL": "https://www.facebook.com",
                    "type": "FACEBOOK"
                },
                {
                    "socialMediaURL": "https://www.facebook.com",
                    "type": "X_TWITTER"
                },
                {
                    "socialMediaURL": "https://www.facebook.com",
                    "type": "YOU_TUBE"
                },
                {
                    "socialMediaURL": "https://www.facebook.com",
                    "type": "TIK_TOK"
                },
                {
                    "socialMediaURL": "https://www.facebook.com",
                    "type": "INSTAGRAM"
                }
            ] */}
          <SoftTypography variant="h3" textAlign="center">
            {user.fullName ?? empty}
          </SoftTypography>
          <SoftBox my={3}></SoftBox>
          <SoftTypography variant="caption">
            createdAt: {getDateFilter(user.createdAt)}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">createdBy: {user.createdBy ?? empty}</SoftTypography>
          <br />
          <SoftTypography variant="caption">
            updatedAt: {getDateFilter(user.updatedAt) ?? empty}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">modifiedBy: {user.modifiedBy ?? empty}</SoftTypography>
          <br />
          <SoftTypography variant="caption">deletedBy: {user.deletedBy ?? empty}</SoftTypography>
          <br />
          <SoftTypography variant="caption">
            deleted: {user.deleted ? "true" : "false"}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">photoId: {user.photoId ?? empty}</SoftTypography>
          <br />
          <SoftTypography variant="caption">
            backgroundPhotoId: {user.backgroundPhotoId ?? empty}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">
            bloggerAccountId: {user.bloggerAccountId ?? empty}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">
            bloggingType: {user.bloggingType ?? empty}
          </SoftTypography>
          <br />
          <SoftTypography variant="caption">myInfo: {user.myInfo ?? empty}</SoftTypography>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PreviewBlogger.propTypes = {
  user: PropTypes.object.isRequired,
};
