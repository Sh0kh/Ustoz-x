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
import { Schools, GetAuth } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";

// icons
import School from "yaponuz/data/img/school.png";

export default function PreviewSchool({ id }) {
  const [school, setSchool] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      const response = await Schools.getSchool(id);
      console.log(response.object);
      setSchool(response.object);
      console.log(school);
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
        <DialogTitle>Preview School</DialogTitle>
        <DialogContent style={{ maxWidth: "374px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box display="flex" style={{ width: "350px" }} alignItems="center">
                <Box mr={1}>
                  <img src={School} alt="School Icon" />
                </Box>
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">
                    {school && school.agencyName ? school.agencyName : emptynote}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {school && school.mobileNumber ? school.mobileNumber : emptynote}
                  </SoftTypography>
                </Box>
              </Box>
              <Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Agentlik Haqida</SoftTypography>
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
                      {school && school.address ? school.address : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {school && school.responsiblePerson ? school.responsiblePerson : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {school && school.experience ? school.experience : emptynote}
                    </SoftTypography>
                  </Box>
                </Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Tarixi</SoftTypography>
                </Box>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Box>
                    <SoftTypography variant="body2" color="secondary">
                      Umumiy Visalar soni
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Muvaffaqiyatli Visalar soni
                    </SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      Visa chiqish ehtimoli
                    </SoftTypography>
                  </Box>
                  <Box textAlign="end">
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {school && school.documentPrepared ? school.documentPrepared : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {school && school.documentPreparedSuccessVisa
                        ? school.documentPreparedSuccessVisa
                        : emptynote}
                    </SoftTypography>
                    <SoftTypography variant="subtitle2" fontWeight="bold">
                      {school && school.documentPreparedSuccessVisa && school.documentPrepared
                        ? (
                            (school.documentPrepared / school.documentPreparedSuccessVisa) *
                            100
                          ).toFixed(0)
                        : emptynote}
                      %
                    </SoftTypography>
                  </Box>
                </Box>
                <Box>
                  <Box mt={1}>
                    <SoftTypography variant="h5">Izoh</SoftTypography>
                    <SoftTypography variant="body2" color="secondary">
                      {school && school.agencyDescription ? school.agencyDescription : emptynote}
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
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {school && school.userData ? school.userData.firstName : emptynote}
                      </SoftTypography>
                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {school && school.userData
                          ? school.userData.verification
                            ? "TASDIQLANGAN"
                            : "TASDIQLANMAGAN"
                          : emptynote}
                      </SoftTypography>

                      <SoftTypography variant="subtitle2" fontWeight="bold">
                        {school && school.userData ? school.userData.phoneNumber : emptynote}
                      </SoftTypography>
                    </Box>
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

PreviewSchool.propTypes = {
  id: PropTypes.number.isRequired,
};
