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

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import Icon from "@mui/material/Icon";
import SoftSelect from "components/SoftSelect";

import { GetAuth, FileController, Jobs } from "yaponuz/data/api";

export default function AddJob({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressGoogleMapsLink, setAddressGoogleMapsLink] = useState("");
  const [experienceYearFrom, setExperienceYearFrom] = useState();
  const [experienceYearUpTo, setExperienceYearUpTo] = useState();
  const [jobTitle, setJobTitle] = useState("");
  const [salaryFrom, setSalaryFrom] = useState();
  const [salaryUpTo, setSalaryUpTo] = useState();
  const [metro, setMetro] = useState([{ metroStationName: "", walkingTime: 0 }]);
  const [work, setWork] = useState([{ workingHoursFrom: "", workingHoursUpTo: "" }]);
  const [monthly, setMonthly] = useState(false);

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
      address: address,
      addressGoogleMapsLink: addressGoogleMapsLink,
      creatorId: userId,
      description: description,
      experienceYearFrom: experienceYearFrom,
      experienceYearUpTo: experienceYearUpTo,
      jobTitle: jobTitle,
      metroInfo: metro,
      phoneNumber: phoneNumber,
      salaryFrom: salaryFrom,
      salaryUpTo: salaryUpTo,
      workTimes: work,
      monthly,
    };

    try {
      const response = await Jobs.createJob(data);
      showAlert(response);
      setOpen(false);
    } catch (error) {
      console.error("Error creating job:", error.message);
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
        + add job
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SoftInput
                placeholder="Address"
                value={address}
                style={my}
                onChange={(e) => setAddress(e.target.value)}
              />
              <SoftInput
                placeholder="Phone Number"
                value={phoneNumber}
                style={my}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <SoftInput
                placeholder="experienceYearFrom"
                value={experienceYearFrom}
                type="number"
                style={my}
                onChange={(e) => setExperienceYearFrom(e.target.value)}
              />
              <SoftInput
                placeholder="experienceYearUpTo"
                value={experienceYearUpTo}
                type="number"
                style={my}
                onChange={(e) => setExperienceYearUpTo(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftInput
                placeholder="Job Title"
                style={my}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <SoftInput
                placeholder="Salary From"
                style={my}
                type="number"
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
              />
              <SoftInput
                placeholder="Salary Up To"
                style={my}
                type="number"
                value={salaryUpTo}
                onChange={(e) => setSalaryUpTo(e.target.value)}
              />

              <SoftBox display="flex" style={{ margin: "12px 0px" }} alignItems="center">
                <Switch checked={monthly} onChange={() => setMonthly(!monthly)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onChange={() => setMonthly(!monthly)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;{monthly ? "monthly" : "hourly"}
                </SoftTypography>
              </SoftBox>
            </Grid>
            <Grid item xs={12}>
              <SoftInput
                placeholder="GoogleMapsLink"
                value={addressGoogleMapsLink}
                style={my}
                onChange={(e) => setAddressGoogleMapsLink(e.target.value)}
              />
              <SoftInput
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                style={my}
                placeholder="Description Here"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <h4 style={{ textAlign: "center", marginTop: "10px" }}>METRO</h4>
          {metro.map((item, index) => (
            <Grid container key={index} spacing={2}>
              <Grid item xs={4}>
                <SoftInput
                  placeholder="Metro Station Name"
                  value={item.metroStationName}
                  style={my}
                  onChange={(e) => {
                    const updatedMetro = [...metro];
                    updatedMetro[index].metroStationName = e.target.value;
                    setMetro(updatedMetro);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SoftInput
                  placeholder="walkingTime"
                  value={item.walkingTime}
                  style={my}
                  onChange={(e) => {
                    const updatedMetro = [...metro];
                    updatedMetro[index].walkingTime = e.target.value;
                    setMetro(updatedMetro);
                  }}
                />
              </Grid>
              <Grid item xs={2} style={{ margin: "5px 0px" }}>
                <SoftButton
                  variant="contained"
                  color="dark"
                  onClick={() => setMetro([...metro, { metroStationName: "", walkingTime: 0 }])}
                >
                  <Icon>add</Icon>
                  add
                </SoftButton>
              </Grid>
              <Grid item xs={2} style={{ margin: "5px 0px" }}>
                <SoftButton
                  variant="contained"
                  color="error"
                  onClick={() => {
                    const updatedMetro = [...metro];
                    updatedMetro.splice(index, 1);
                    setMetro(updatedMetro);
                  }}
                >
                  <Icon>delete</Icon>
                </SoftButton>
              </Grid>
            </Grid>
          ))}

          {/* WORK */}

          <h4 style={{ textAlign: "center", marginTop: "10px" }}>WORK</h4>
          {work.map((item, index) => (
            <Grid container key={index} spacing={2}>
              <Grid item xs={4}>
                <SoftInput
                  placeholder="workingHoursFrom"
                  value={item.workingHoursFrom}
                  style={my}
                  onChange={(e) => {
                    const updatedMetro = [...work];
                    updatedMetro[index].workingHoursFrom = e.target.value;
                    setWork(updatedMetro);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SoftInput
                  placeholder="workingHoursUpTo"
                  value={item.workingHoursUpTo}
                  style={my}
                  onChange={(e) => {
                    const updatedMetro = [...work];
                    updatedMetro[index].workingHoursUpTo = e.target.value;
                    setWork(updatedMetro);
                  }}
                />
              </Grid>
              <Grid item xs={2} style={{ margin: "5px 0px" }}>
                <SoftButton
                  variant="contained"
                  color="dark"
                  onClick={() => setWork([...work, { workingHoursFrom: "", workingHoursUpTo: "" }])}
                >
                  <Icon>add</Icon>
                  add
                </SoftButton>
              </Grid>
              <Grid item xs={2} style={{ margin: "5px 0px" }}>
                <SoftButton
                  variant="contained"
                  color="error"
                  onClick={() => {
                    const updatedMetro = [...work];
                    updatedMetro.splice(index, 1);
                    setWork(updatedMetro);
                  }}
                >
                  <Icon>delete</Icon>
                </SoftButton>
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Job</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddJob.propTypes = {
  refetch: PropTypes.func,
};
