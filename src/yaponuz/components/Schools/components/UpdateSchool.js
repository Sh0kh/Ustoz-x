import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import { Schools, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTagInput from "components/SoftTagInput";
import SoftTypography from "components/SoftTypography";

export default function UpdateSchool({ myid, itemme, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [agencyDescription, setAgencyDescription] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [documentPrepared, setDocumentPrepared] = useState();
  const [documentPreparedSuccessVisa, setDocumentPreparedSuccessVisa] = useState();
  const [mobileNumber, setMobileNumber] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [workStartDate, setWorkStartDate] = useState("");
  const [partnerSchoolJapan, setPartnerSchoolJapan] = useState([]);
  const [uzbekistanBranchs, setUzbekistanBranchs] = useState([]);
  const [active, setActive] = useState(false);
  const [userId, setUserId] = useState();

  const updateJapan = (newTags) => setPartnerSchoolJapan(newTags);
  const updateUZB = (newTags1) => setUzbekistanBranchs(newTags1);

  useEffect(() => {
    let mydate = itemme.workStartDate;
    setWorkStartDate(mydate.split("T")[0]);
    setAgencyDescription(itemme.agencyDescription);
    setUserId(itemme.createdBy);
    setAgencyName(itemme.agencyName);
    setDocumentPrepared(itemme.documentPrepared);
    setDocumentPreparedSuccessVisa(itemme.documentPreparedSuccessVisa);
    setMobileNumber(itemme.mobileNumber);
    setResponsiblePerson(itemme.responsiblePerson);
    setActive(itemme.active);
    setUzbekistanBranchs(itemme.uzbekistanBranchs);
    setPartnerSchoolJapan(itemme.partnerSchoolJapan);
  }, [itemme]);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const data = {
      active: active,
      agencyDescription: agencyDescription,
      agencyName: agencyName,
      id: parseInt(itemme.id),
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
      const response = await Schools.updateSchool(data);
      console.log(response);

      showAlert(response);
      setOpen(false);
    } catch (error) {
      showAlert(error);
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
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update School</DialogTitle>
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
            <Grid item xs={8}>
              <SoftTypography variant="caption">Agentlik Haqida</SoftTypography>
              <SoftInput
                placeholder="Agentlik Haqida..."
                multiline
                rows={3}
                onChange={(e) => setAgencyDescription(e.target.value)}
                value={agencyDescription}
              />
            </Grid>
            <Grid item xs={4}>
              <SoftTypography color="white">.</SoftTypography>
              <SoftBox display="flex" style={{ margin: "20px 15px" }} alignItems="center">
                <Switch checked={active} onChange={() => setActive(!active)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={() => setActive(!active)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;{active ? "Active" : "Not Active"}
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update School</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateSchool.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
