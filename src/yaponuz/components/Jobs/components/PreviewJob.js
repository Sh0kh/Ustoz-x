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
import { Jobs } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import JobIcon from "yaponuz/data/img/jobIcon.png"; // Ikona rasm
import Ellipse from "yaponuz/data/img/ellipse.png";
import Train from "yaponuz/data/img/train.png";

export default function PreviewJob({ id }) {
  // Model ochilishi va yopilishi
  const [job, setJob] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      const response = await Jobs.getOneJob(id);
      console.log(response.object);
      setJob(response.object);
    };

    getJob();
  }, [id]);

  return (
    <>
      <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
        <Icon>visibility</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} style={{ minWidth: "374px" }}>
        <DialogTitle>Preview Job</DialogTitle>
        <DialogContent style={{ minWidth: "374px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} style={{ maxWidth: "374px" }}>
              <Box display="flex" alignItems="center">
                {/* Icon */}
                <Box mr={1}>
                  <img src={JobIcon} alt="Job Icon" />
                </Box>
                {/* Title va Description */}
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">{job.jobTitle}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    ${job.salaryFrom} - ${job.salaryUpTo} oyiga
                  </SoftTypography>
                </Box>
              </Box>
              <Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Ish haqida</SoftTypography>
                </Box>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Box>
                    <SoftTypography variant="body2" color="secondary">
                      Ish Vaqti
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Tajriba
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Murojaat uchun
                    </SoftTypography>
                  </Box>
                  <Box textAlign="end">
                    {job.workTimes ? (
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {job.workTimes[0]?.workingHoursFrom} - {job.workTimes[0]?.workingHoursUpTo}
                      </SoftTypography>
                    ) : (
                      <SoftTypography variant="subtitle2" color="secondary">
                        empty
                      </SoftTypography>
                    )}

                    {job.experienceYearFrom && job.experienceYearUpTo ? (
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {job.experienceYearFrom} yil - {job.experienceYearUpTo} yil
                      </SoftTypography>
                    ) : (
                      <SoftTypography variant="subtitle2" color="secondary">
                        empty
                      </SoftTypography>
                    )}
                    {job.phoneNumber ? (
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {job.phoneNumber}
                      </SoftTypography>
                    ) : (
                      <SoftTypography variant="subtitle2" color="secondary">
                        empty
                      </SoftTypography>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box mt={2}>
                <Box>
                  <SoftTypography variant="h5">Manzil</SoftTypography>
                  <SoftTypography variant="body2">{job.address}</SoftTypography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Box>
                    {job.metroInfo &&
                      job.metroInfo.map((metro, index) => (
                        <SoftTypography key={index} variant="body2">
                          <img src={Ellipse} alt="ellipse" />
                          &nbsp; {metro.metroStationName}
                        </SoftTypography>
                      ))}
                  </Box>
                  <Box>
                    {job.metroInfo &&
                      job.metroInfo.map((metro, index) => (
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
                    width="350"
                    height="180"
                    style={{ border: 0, borderRadius: 15 }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>
              </Box>
              <Box mt={1}>
                <Box>
                  <SoftTypography variant="h5">Izoh</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {job.description}
                  </SoftTypography>
                </Box>
              </Box>
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

PreviewJob.propTypes = {
  id: PropTypes.number.isRequired,
};
