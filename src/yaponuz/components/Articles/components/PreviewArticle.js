import React, { useEffect, useState } from "react";
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

// icons
import ArticleP from "yaponuz/data/img/articlep.png";
import { ArticleCategories } from "yaponuz/data/api";

export default function PreviewArticle({ id }) {
  const [article, setArticle] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      const response = await Article.getArticleByUserId(id);
      const url = await ArticleCategories.getOnePhoto(response.object.photoId);
      console.log(response.object);
      setArticle(response.object);
      setImageUrl(url);
    };

    getJob();
  }, [id]);

  const emptynote = (
    <SoftTypography variant="subtitle2" color="secondary">
      empty
    </SoftTypography>
  );

  return (
    <>
      <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
        <Icon>visibility</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} style={{ minWidth: "374px" }}>
        <DialogTitle>Preview Article</DialogTitle>
        <DialogContent style={{ maxWidth: "400px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} style={{ width: "380px" }}>
              <Box>
                <SoftTypography variant="h2">
                  {article && article.title ? article.title : emptynote}
                </SoftTypography>
              </Box>
              <Box>
                <img
                  src={imageUrl}
                  height="240"
                  style={{ maxWidth: "365px" }}
                  alt="Article Photo"
                />
              </Box>
              <Box m={1} dangerouslySetInnerHTML={{ __html: article.context }}></Box>
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

PreviewArticle.propTypes = {
  id: PropTypes.number.isRequired,
};
