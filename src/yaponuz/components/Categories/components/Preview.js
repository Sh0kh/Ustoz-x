import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import { Article, GetAuth, FileController } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import SoftButton from "components/SoftButton";
import { ArticleCategories } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";

export default function PreviewCategory({ id }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useMemo(async () => {
    try {
      const response = await ArticleCategories.getOneId(id);
      const url = await ArticleCategories.getOnePhoto(response.object.iconId);
      setImageUrl(url);
      setData(response.object);
    } catch (err) {
      console.log("Error from get one article categories: ", err);
    }
  }, [id]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let empty = "null";

  return (
    <>
      {/* style ignore it */}
      <style>
        {`
          .hover-underline-button:hover {
            text-decoration: underline;
          }
        `}
      </style>

      {/* style end */}
      <SoftButton
        variant="text"
        color="info"
        className="hover-underline-button"
        onClick={handleClickOpen}
      >
        {id}
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Preview Article Category</DialogTitle>
        <DialogContent>
          <SoftBox display="flex" justifyContent="center">
            <img src={imageUrl} height="300" alt="Article Photo" />
          </SoftBox>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <SoftTypography variant="caption">id: </SoftTypography> <br />
              <SoftTypography variant="caption">createdAt: </SoftTypography>
              <br />
              <SoftTypography variant="caption">createdBy: </SoftTypography> <br />
              <SoftTypography variant="caption">updatedAt: </SoftTypography>
              <br />
              <SoftTypography variant="caption">modifiedBy: </SoftTypography>
              <br />
              <SoftTypography variant="caption">deletedBy: </SoftTypography>
              <br />
              <SoftTypography variant="caption">deleted: </SoftTypography>
              <br />
              <SoftTypography variant="caption">parentId: </SoftTypography>
              <br />
              <SoftTypography variant="caption">name: </SoftTypography>
              <br />
              <SoftTypography variant="caption">iconId: </SoftTypography>
              <br />
            </Grid>
            <Grid item xs={8}>
              <SoftTypography variant="caption">{data.id ?? empty}</SoftTypography> <br />
              <SoftTypography variant="caption">{data.createdAt ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.createdBy ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.updatedAt ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.modifiedBy ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.deletedBy ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.deleted ? "true" : "false"}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.parentId ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.name ?? empty}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{data.iconId ?? empty}</SoftTypography>
              <br />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PreviewCategory.propTypes = {
  id: PropTypes.number.isRequired,
};
