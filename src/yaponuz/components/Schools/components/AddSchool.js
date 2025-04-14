import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

import { GetAuth, Schools } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import SoftTagInput from "components/SoftTagInput";

export default function AddSchool({ refetch }) {
  const [open, setOpen] = useState(false);
  const [agencyDescription, setAgencyDescription] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [documentPrepared, setDocumentPrepared] = useState();
  const [documentPreparedSuccessVisa, setDocumentPreparedSuccessVisa] = useState();
  const [mobileNumber, setMobileNumber] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [workStartDate, setWorkStartDate] = useState("");
  const [partnerSchoolJapan, setPartnerSchoolJapan] = useState([]);
  const [uzbekistanBranchs, setUzbekistanBranchs] = useState([]);

  const updateJapan = (newTags) => setPartnerSchoolJapan(newTags);
  const updateUZB = (newTags1) => setUzbekistanBranchs(newTags1);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const userId = GetAuth.getUserId();
    const data = {
      agencyDescription: agencyDescription,
      agencyName: agencyName,
      creatorId: userId,
      documentPrepared: documentPrepared,
      documentPreparedSuccessVisa: documentPreparedSuccessVisa,
      mobileNumber: mobileNumber,
      partnerSchoolJapan: partnerSchoolJapan,
      responsiblePerson: responsiblePerson,
      uzbekistanBranchs: uzbekistanBranchs,
      workStartDate: new Date(workStartDate).toISOString(),
    };

    try {
      const response = await Schools.createSchool(data);
      console.log(response);
      showAlert(response);
      setOpen(false);
    } catch (error) {
      console.error("Error creating article category:", error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add school
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add School</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Agentlik nomi</SoftTypography>
              <SoftInput
                placeholder="Agentlik Nomi"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <SoftTypography variant="caption">Telefon Raqam</SoftTypography>
              <SoftInput
                placeholder="Telefon Raqam"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <SoftTypography variant="caption">Barcha Visalar soni</SoftTypography>
              <SoftInput
                value={documentPrepared}
                placeholder="100"
                onChange={(e) => setDocumentPrepared(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Muvaffaqiyatli Visalar soni</SoftTypography>
              <SoftInput
                placeholder="90"
                value={documentPreparedSuccessVisa}
                onChange={(e) => setDocumentPreparedSuccessVisa(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Ma`sul Shaxs</SoftTypography>
              <SoftInput
                value={responsiblePerson}
                placeholder="JOHN DOE"
                onChange={(e) => setResponsiblePerson(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Ish Boshlash Sanasi</SoftTypography>
              <SoftInput type="date" onChange={(e) => setWorkStartDate(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Partner Schools Japan</SoftTypography>
              <SoftTagInput
                placeholder="Yozing va ENTER ni bosing."
                tags={partnerSchoolJapan}
                onChange={updateJapan}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Uzbekistan Branches</SoftTypography>
              <SoftTagInput
                placeholder="Yozing va ENTER ni bosing."
                tags={uzbekistanBranchs}
                onChange={updateUZB}
              />
            </Grid>
            <Grid item xs={12}>
              <SoftTypography variant="caption">Agentlik Haqida</SoftTypography>
              <SoftInput
                placeholder="Agentlik Haqida..."
                multiline
                rows={3}
                onChange={(e) => setAgencyDescription(e.target.value)}
                value={agencyDescription}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add School</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddSchool.propTypes = {
  refetch: PropTypes.func,
};
