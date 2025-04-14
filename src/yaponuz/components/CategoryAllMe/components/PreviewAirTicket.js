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
import { Air, GetAuth } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import AirPng from "yaponuz/data/img/air.png";

// icons

export default function PreviewAirTicket({ id }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      const response = await Air.getOneAirticket(id);
      console.log(response.object);
      setData(response.object);
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
        <DialogTitle>Preview Air Ticket</DialogTitle>
        <DialogContent style={{ maxWidth: "374px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" style={{ width: "350px" }} alignItems="center">
                <Box mr={1}>
                  <img src={AirPng} alt="Air Icon" />
                </Box>
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">{data.title}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {data.phone ? data.phone : emptynote}
                  </SoftTypography>
                </Box>
              </Box>
              <Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Izoh</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {data.context}
                  </SoftTypography>
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
                  </Box>
                  <Box textAlign="end">
                    <SoftTypography variant="subtitle2">
                      {data.user ? data.user.firstName : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2">
                      {data.user
                        ? data.user.verification
                          ? "TASDIQLANGAN"
                          : "TASDIQLANMAGAN"
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2">
                      {data.user ? data.user.phoneNumber : emptynote}
                    </SoftTypography>
                  </Box>
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

PreviewAirTicket.propTypes = {
  id: PropTypes.number.isRequired,
};
