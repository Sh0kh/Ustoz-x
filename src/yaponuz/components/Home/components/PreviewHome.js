import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes, { object } from "prop-types";
import Grid from "@mui/material/Grid";
import { Home, GetAuth } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import ImageSlider from "./ImageSlider";

// icons
import ArticleP from "yaponuz/data/img/articlep.png";
import Ellipse from "yaponuz/data/img/ellipse.png";
import Train from "yaponuz/data/img/train.png";
import { ArticleCategories } from "yaponuz/data/api";

export default function PreviewHome({ id }) {
  const [home, setHome] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSlide, setImageSlide] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      // Get All Homes
      try {
        setLoading(true);
        const response = await Home.getOneHome(id);
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

        // set others
        setHome(response.object);
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        console.log("ERROR FROM HOME PREVIEW: ", err);
      }
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
        <DialogTitle>Preview Home</DialogTitle>
        <DialogContent style={{ maxWidth: "400px" }}>
          {!home ? (
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
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Box>{imageSlide ? <ImageSlider images={imageSlide} /> : <></>}</Box>
                </Box>
                <Box>
                  <Box display="flex" justifyContent="start" alignContent="center">
                    <SoftTypography variant="h5">
                      ¥{home.rentFee ? home.rentFee : "0"} /month
                    </SoftTypography>
                    <SoftTypography>&nbsp;&nbsp;</SoftTypography>
                  </Box>
                  <Box display="flex" justifyContent="start" alignContent="center">
                    <SoftTypography variant="body2" color="secondary">
                      ¥{home.depositFee ? home.depositFee : "0"} / deposit
                    </SoftTypography>
                    <SoftTypography>&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      ¥{home.homeAgentFee ? home.homeAgentFee : "0"} / makler puli
                    </SoftTypography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Box display="flex" justifyContent="start">
                    <Box flexGrow={1}>
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {home.numberRooms ? home.numberRooms : 0},
                        {home.roomPlan ? home.roomPlan : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        xona
                      </SoftTypography>
                    </Box>
                    <Box flexGrow={1} mx={1}>
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {home.totalSpace ? home.totalSpace : 0} mm <sup>2</sup>
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        maydon
                      </SoftTypography>
                    </Box>
                    <Box flexGrow={1}>
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {home.roomFloor ? home.roomFloor : 0}/
                        {home.houseFloor ? home.houseFloor : 0}
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        qavat
                      </SoftTypography>
                    </Box>
                  </Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Xaritada</SoftTypography>
                    <SoftTypography variant="body2">
                      {home.address ? home.address : emptynote}
                    </SoftTypography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box>
                      {home.metro &&
                        home.metro.map((metro, index) => (
                          <SoftTypography key={index} variant="body2">
                            <img src={Ellipse} alt="ellipse" />
                            &nbsp; {metro.metroStationName}
                          </SoftTypography>
                        ))}
                    </Box>
                    <Box>
                      {home.metro &&
                        home.metro.map((metro, index) => (
                          <SoftTypography key={index} variant="body2" color="secondary">
                            <img src={Train} alt="train" />
                            &nbsp; {metro.walkingTime} min
                          </SoftTypography>
                        ))}
                    </Box>
                  </Box>
                  <Box borderRadius={15} mt={2}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d60915.77417171827!2d72.34960056249565!3d40.766312517580474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1709792840253!5m2!1sen!2s"
                      width="365"
                      height="180"
                      style={{ border: 0, borderRadius: 15 }}
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Imkoniyatlar</SoftTypography>
                    <Box mt={1}>
                      {home.opportunities ? (
                        home.opportunities.map((item, index) => (
                          <SoftTypography variant="body2" key={index}>
                            ---- {item}
                          </SoftTypography>
                        ))
                      ) : (
                        <SoftTypography variant="subtitle2" color="secondary">
                          empty
                        </SoftTypography>
                      )}
                    </Box>
                  </Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Xonadon haqida</SoftTypography>
                  </Box>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Box>
                      <SoftTypography variant="body2" color="secondary">
                        Kochib otish sanasi
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        Ijara Tugash vaqti
                      </SoftTypography>
                      <SoftTypography variant="body2" color="secondary">
                        Talabalar uchunmi
                      </SoftTypography>
                    </Box>
                    <Box>
                      <SoftTypography variant="subtitle2" color="secondary" fontWeight="bold">
                        {home.dateMoving
                          ? new Date(home.dateMoving).toLocaleDateString()
                          : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2" color="secondary" fontWeight="bold">
                        {home.rentEndDate
                          ? new Date(home.rentEndDate).toLocaleDateString()
                          : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2" color="secondary" fontWeight="bold">
                        {home.forAStudentOk ? "Ha" : "Yoq"}
                      </SoftTypography>
                    </Box>
                  </Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Izoh</SoftTypography>
                    <SoftTypography variant="body2">{home.description}</SoftTypography>
                  </Box>
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
                      <SoftTypography variant="body2" color="secondary">
                        Maklermi
                      </SoftTypography>
                    </Box>
                    <Box textAlign="end">
                      <SoftTypography variant="subtitle2">
                        {home.userData ? home.userData.firstName : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2">
                        {home.userData ? "TASDIQLANGAN" : "TASDIQLANMAGAN"}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2">
                        {home.userData ? home.userData.phoneNumber : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2">
                        {home.isHomeAgent ? "Ha" : "Yoq"}
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

PreviewHome.propTypes = {
  id: PropTypes.number.isRequired,
};
