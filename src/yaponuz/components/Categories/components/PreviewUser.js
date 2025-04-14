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
import { Users } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import JobIcon from "yaponuz/data/img/user.png";
import SoftButton from "components/SoftButton";

export default function PreviewUser({ id }) {
  const [other, setOther] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async (id) => {
      const response = await Users.getOneUser(id);
      console.log(response.object);
      setOther(response.object);
    };

    getJob(id);
  }, [id]);

  const emptynote = (
    <SoftTypography variant="subtitle2" color="secondary">
      empty
    </SoftTypography>
  );

  return (
    <>
      <style>
        {`
          .hover-underline-button:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <SoftButton
        color="primary"
        variant="text"
        onClick={handleClickOpen}
        className="hover-underline-button"
      >
        {id}
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Preview User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                {/* Icon */}
                <Box mr={1}>
                  <img src={JobIcon} alt="Job Icon" />
                </Box>
                {/* Title va Description */}
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">{other.firstName}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {other.phoneNumber}
                  </SoftTypography>
                </Box>
              </Box>
              <Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Foydalanuvchi Haqida</SoftTypography>
                </Box>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Box>
                    <SoftTypography variant="body2" color="secondary">
                      ID
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      createdAt
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      updatedAt
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      FullName
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      UserName
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Gender
                    </SoftTypography>

                    <SoftTypography variant="body2" color="secondary">
                      Birthday
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Country
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Email
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      accountType
                    </SoftTypography>

                    <SoftTypography variant="body2" color="secondary">
                      Active
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      myReferralNumber
                    </SoftTypography>

                    <SoftTypography variant="body2" color="secondary">
                      userHashId
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      DeviceID
                    </SoftTypography>
                  </Box>
                  <Box textAlign="end">
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.id ? other.id : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.createdAt
                        ? new Date(other.createdAt)
                            .toISOString()
                            .replace(/T/, " ")
                            .replace(/\..+/, "")
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.updatedAt
                        ? new Date(other.updatedAt)
                            .toISOString()
                            .replace(/T/, " ")
                            .replace(/\..+/, "")
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.firstName && other.lastName
                        ? `${other.firstName} ${other.lastName}`
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.username ? other.username : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.genderType ? other.genderType : emptynote}
                    </SoftTypography>

                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.dateBirth
                        ? new Date(other.dateBirth).toLocaleDateString()
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.currentCountry ? other.currentCountry : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.email ? other.email : emptynote}
                    </SoftTypography>
                    {/* 
                      accountType
                      createdAt
                      deleted
                      myReferralNumber
                      updatedAt
                      userHashId
                    */}
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.accountType ? other.accountType : emptynote}
                    </SoftTypography>

                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.deleted ? other.deleted : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.myReferralNumber ? other.myReferralNumber : emptynote}
                    </SoftTypography>

                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.userHashId ? other.userHashId : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {other && other.deviceId ? other.deviceId : emptynote}
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

PreviewUser.propTypes = {
  id: PropTypes.number.isRequired,
};
