import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import { Jobs, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// import Switch from "@mui/material/Switch";
// import SoftTypography from "components/SoftTypography";
// import Icon from "@mui/material/Icon";

export default function UpdateJob({ myid, itemme, refetch }) {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = useState();

  // variables
  const [address, setAddress] = useState(itemme.address);
  const [description, setDescription] = useState(itemme.description);
  const [phoneNumber, setPhoneNumber] = useState(itemme.phoneNumber);
  const [addressGoogleMapsLink, setAddressGoogleMapsLink] = useState(itemme.addressGoogleMapsLink);
  const [experienceYearFrom, setExperienceYearFrom] = useState(itemme.experienceYearFrom);
  const [experienceYearUpTo, setExperienceYearUpTo] = useState(itemme.experienceYearUpTo);
  const [jobTitle, setJobTitle] = useState(itemme.jobTitle);
  const [salaryFrom, setSalaryFrom] = useState(itemme.salaryFrom);
  const [salaryUpTo, setSalaryUpTo] = useState(itemme.salaryUpTo);
  const [active, setActive] = useState(itemme.deleted);
  const [monthly, setMonthly] = useState(false);
  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const [metro, setMetro] = useState([{ metroStationName: "", walkingTime: 0 }]);
  const [work, setWork] = useState([{ workingHoursFrom: "", workingHoursUpTo: "" }]);

  const [createdBy, setCreatedBy] = useState(0);

  React.useEffect(() => {
    setCreatedBy(itemme.createdBy);
    setAddress(itemme.address);
    setPhoneNumber(itemme.phoneNumber);
    setDescription(itemme.description);
    setMetro(itemme.metroInfo);
    setWork(itemme.workTimes);
    setActive(itemme.deleted);
    setSalaryFrom(itemme.salaryFrom);
    setSalaryUpTo(itemme.salaryUpTo);
    setJobTitle(itemme.jobTitle);
    setMonthly(itemme.monthly);
    setAddressGoogleMapsLink(itemme.addressGoogleMapsLink);
    setExperienceYearFrom(itemme.experienceYearFrom);
    setExperienceYearUpTo(itemme.experienceYearUpTo);
  }, [itemme]);

  const handleSave = async () => {
    const data = {
      active,
      address: address,
      id: itemme.id,
      addressGoogleMapsLink,
      creatorId: createdBy,
      description: description,
      experienceYearFrom: experienceYearFrom,
      experienceYearUpTo: experienceYearUpTo,
      jobTitle: jobTitle,
      metroInfo: metro,
      phoneNumber: phoneNumber,
      salaryFrom: salaryFrom,
      salaryUpTo: salaryUpTo,
      monthly,
      workTimes: work,
    };
    console.log(JSON.stringify(data));

    try {
      const response = await Jobs.updateJob(data);
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
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Job</DialogTitle>
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
                type="number"
                value={experienceYearUpTo}
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
                type="number"
                style={my}
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
          <SoftBox display="flex" style={{ margin: "10px 0px" }} alignItems="center">
            <Switch checked={active} onChange={() => setActive(!active)} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              onChange={() => setActive(!active)}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;{active ? "active" : "not active"}
            </SoftTypography>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Job</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateJob.propTypes = {
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
