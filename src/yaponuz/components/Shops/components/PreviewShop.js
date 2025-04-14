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
import { Shops, GetAuth } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import ArticleP from "yaponuz/data/img/articlep.png";
import { ArticleCategories } from "yaponuz/data/api";
import ImageSlider from "./ImageSlider";

// icons

export default function PreviewShop({ id }) {
  const [shop, setShop] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSlide, setImageSlide] = useState();
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      // loading true
      setLoading(true);
      const response = await Shops.getOneShop(id);
      const url = await ArticleCategories.getOnePhoto(
        response && response.object
          ? response.object.objectPhotos[0]
          : "24230512646486117225876969106639957765"
      );

      // Save the image urls
      if (response && response.object) {
        let urls = response.object.objectPhotos;
        let photos = [];
        for (const i of urls) {
          try {
            let myurl = await ArticleCategories.getOnePhoto(i);
            photos.push(myurl);
          } catch (err) {
            console.log(err);
          }
        }
        setImageSlide(photos);
      }

      setShop(response.object);
      setImageUrl(url);
      setLoading(false);
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
        <DialogTitle>Preview Shop</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              style={{
                opacity: 0.5,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>Loading... (please wait)</Box>
            </Box>
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12} style={{ maxWidth: "374px" }}>
                <Box display="flex" alignItems="center">
                  <Box>{imageSlide ? <ImageSlider images={imageSlide} /> : <></>}</Box>
                </Box>
                <Box>
                  <SoftTypography variant="h5">{shop && shop.title}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    ¥{shop && shop.price ? shop.price : 0}
                  </SoftTypography>
                </Box>
                <Box mt={1}>
                  <Box>
                    <SoftTypography variant="h5">Malumot</SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      {shop && shop.description ? shop.description : emptynote}
                    </SoftTypography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <SoftTypography variant="h5">Qoshimcha mahsulotlar</SoftTypography>
                </Box>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Box>
                    <SoftTypography variant="body2" color="secondary">
                      Manzil
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Masul Odam
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Tajriba
                    </SoftTypography>
                  </Box>
                  <Box textAlign="end">
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {shop && shop.address ? shop.address : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {/* {console.log(shop.user.firstName)} */}
                      {shop.user ? shop.user.firstName : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {emptynote}
                    </SoftTypography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <SoftTypography variant="h5">Manzil</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {shop && shop.address ? shop.address : emptynote}
                  </SoftTypography>
                </Box>
                <Box borderRadius={15} mt={2}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d60915.77417171827!2d72.34960056249565!3d40.766312517580474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1709792840253!5m2!1sen!2s"
                    width="360"
                    height="180"
                    style={{ border: 0, borderRadius: 15 }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>
                <Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Elon beruvchi</SoftTypography>
                  </Box>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Box>
                      <SoftTypography variant="body2" color="secondary">
                        Toliq ISM
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        Status
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        Phone Number
                      </SoftTypography>
                    </Box>
                    <Box textAlign="end">
                      <SoftTypography variant="subtitle2">
                        {shop && shop.user ? shop.user.firstName : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2">
                        {shop && shop.user ? "TASDIQLANGAN" : "TASDIQLANMAGAN"}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2">
                        {shop && shop.user ? shop.user.phoneNumber : emptynote}
                      </SoftTypography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PreviewShop.propTypes = {
  id: PropTypes.number.isRequired,
};
