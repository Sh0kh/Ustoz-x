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

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import SoftButton from "components/SoftButton";
import SoftTagInput from "components/SoftTagInput";
import SoftSelect from "components/SoftSelect";

import { GetAuth, Home, FileController } from "yaponuz/data/api";
import SoftDropzone from "components/SoftDropzone";

export default function UpdateHome({ myid, item, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [address, setAddress] = useState(item.address);
  const [depositFee, setDepositFee] = useState(item.depositFee);
  const [description, setDescription] = useState(item.description);
  const [googleMapsURL, setGoogleMapsURL] = useState(item.googleMapsURL);
  const [opportunities, setOpportunities] = useState(item.opportunities);
  const [phoneNumber, setPhoneNumber] = useState(item.phoneNumber);
  const [forAStudentOk, setForAStudentOk] = useState(item.forAStudentOk);
  const [rentFee, setRentFee] = useState(item.rentFee);
  const [roomFloor, setRoomFloor] = useState(item.roomFloor);
  const [rentEndDate, setRentEndDate] = useState(item.rentEndDate);
  const [iconId, setIconId] = useState(item.objectPhotos);
  const [metro, setMetro] = useState(item.metro);
  const [isHomeAgent, setIsHomeAgent] = useState(true);

  const [homeAgentName, setHomeAgentName] = useState(item.homeAgentName);
  const [homeAgentFee, setHomeAgentFee] = useState(item.homeAgentFee);

  const [active, setActive] = useState(item.deleted);
  const [createdBy, setCreatedBy] = useState(0);
  const [tags, setTags] = useState([]);
  const updateTags = (newTags) => setTags(newTags);

  const [roomPlan, setRoomPlan] = useState("");
  const [totalSpace, setTotalSpace] = useState();
  const [numberRooms, setNumberRooms] = useState();
  const [houseFloor, setHouseFloor] = useState();
  const [dateMoving, setDateMoving] = useState();

  useEffect(() => {
    setRoomPlan(item.roomPlan);
    setTotalSpace(item.totalSpace);
    setNumberRooms(item.numberRooms);
    setHouseFloor(item.houseFloor);
    setDateMoving(item.dateMoving);
    setAddress(item.address);
    setDepositFee(item.depositFee);
    setDescription(item.description);
    setGoogleMapsURL(item.googleMapsURL);
    setOpportunities(item.opportunities);
    setPhoneNumber(item.phoneNumber);
    setForAStudentOk(item.forAStudentOk);
    setRentFee(item.rentFee);
    setRoomFloor(item.roomFloor);
    setRentEndDate(item.rentEndDate);
    setIconId(item.objectPhotos);
    setMetro(item.metro);
    setIsHomeAgent(item.homeIsAgent);
    setHomeAgentName(item.homeAgentName);
    setHomeAgentFee(item.homeAgentFee);
    setActive(item.deleted);
    setCreatedBy(item.createdBy);
    setTags(item.opportunities);
  }, [item]); // useEffectni item o'zgaruvchisi o'zgarishlari bo'lganda ishga tushirish

  const handleUpload = async (files) => {
    const category = "icon";
    const userHashId = GetAuth.getUserHashId();
    try {
      const promises = Array.from(files).map(async (file) => {
        const response = await FileController.uploadFile(file, category, userHashId);
        return response.object;
      });
      const uploadedFiles = await Promise.all(promises);
      setIconId((prevIds) => [...prevIds, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    console.log("iconId", iconId);
    const data = {
      active: active,
      address: address,
      creatorId: createdBy,
      depositFee: depositFee,
      description: description,
      forAStudentOk: forAStudentOk,
      googleMapsURL: googleMapsURL,
      isHomeAgent: isHomeAgent,
      metro: metro,
      objectPhotos: iconId,
      opportunities: opportunities,
      phoneNumber: phoneNumber,
      rentEndDate: rentEndDate,
      rentFee: rentFee,
      roomFloor: roomFloor,
      id: myid,
      roomPlan,
      totalSpace,
      numberRooms,
      houseFloor,
      dateMoving: dateMoving,
    };

    if (isHomeAgent) {
      data.homeAgentName = homeAgentName;
      data.homeAgentFee = homeAgentFee;
    }

    // console.log(JSON.stringify(data));

    try {
      const response = await Home.updateHome(data);
      console.log(response);
      showAlert(response);
      // console.log(data);
      setOpen(false);
      // console.log(data);
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

  // other
  let allOppotunities = [
    { value: "Wi-Fi", label: "Wi-Fi" },
    { value: "Gaz Plita", label: "Gaz Plita" },
    { value: "Muzlatgich", label: "Muzlatgich" },
    { value: "Parkovka", label: "Parkovka" },
    { value: "Kondisioner", label: "Kondisioner" },
    { value: "Kamunal to'lab beriladi", label: "Kamunal to'lab beriladi" },
  ];

  let allRoomPlan = ["1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3DK", "3LDK", "4K/4DK Up"];

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Update Home</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftBox style={{ textAlign: "center" }}>
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => handleUpload(e.target.files)}
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  multiple
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12}>
              <h4 style={{ textAlign: "center" }}>Opportinuties & ROOM PLAN</h4>
              <SoftSelect
                options={allOppotunities}
                placeholder="SELECT Opportunities"
                defaultValue={
                  opportunities &&
                  opportunities.map((item) => {
                    return {
                      value: item,
                      label: item,
                    };
                  })
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions.map((option) => option.value);
                  setOpportunities(selectedValues);
                }}
                isMulti
              />
              <SoftBox style={my}>
                <SoftSelect
                  defaultValue={
                    roomPlan && {
                      value: roomPlan,
                      label: roomPlan,
                    }
                  }
                  placeholder="SELECT Room Plan"
                  options={
                    allRoomPlan &&
                    allRoomPlan.map((item) => {
                      return {
                        value: item,
                        label: item,
                      };
                    })
                  }
                  onChange={(select) => setRoomPlan(select.value)}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={6}>
              <SoftInput
                placeholder="Address"
                value={address}
                style={my}
                onChange={(e) => setAddress(e.target.value)}
              />
              <SoftInput
                placeholder="description"
                value={description}
                style={my}
                onChange={(e) => setDescription(e.target.value)}
              />
              <SoftInput
                placeholder="googleMapsURL"
                value={googleMapsURL}
                style={my}
                onChange={(e) => setGoogleMapsURL(e.target.value)}
              />
              <SoftInput
                placeholder="phoneNumber"
                value={phoneNumber}
                style={my}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <SoftInput
                placeholder="houseFloor - uy qavati"
                value={houseFloor}
                type="number"
                style={my}
                onChange={(e) => setHouseFloor(e.target.value)}
              />
              <SoftTypography variant="caption" color="dark">
                dateMoving - Ko`chib O`tish Sanasi
              </SoftTypography>
              <SoftInput
                placeholder="dateMoving"
                value={dateMoving}
                style={my}
                onChange={(e) => setDateMoving(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftInput
                placeholder="depositFee - depazit haqi"
                style={my}
                type={isHomeAgent ? "text" : "number"}
                value={depositFee}
                onChange={(e) => setDepositFee(e.target.value)}
              />
              <SoftInput
                placeholder="rentFee - ijara haqi"
                style={my}
                type="number"
                value={rentFee}
                onChange={(e) => setRentFee(e.target.value)}
              />
              <SoftInput
                placeholder="roomFloor - xona qavati"
                style={my}
                value={roomFloor}
                type="number"
                onChange={(e) => setRoomFloor(e.target.value)}
              />
              <SoftInput
                placeholder="numberRooms - xonalar soni"
                style={my}
                value={numberRooms}
                type="number"
                onChange={(e) => setNumberRooms(e.target.value)}
              />
              <SoftInput
                placeholder="umumiy maydon KvM da"
                value={totalSpace}
                type="number"
                style={my}
                onChange={(e) => setTotalSpace(e.target.value)}
              />
              <SoftTypography variant="caption" color="dark">
                rentEndDate - Ijara tugash sanansi
              </SoftTypography>
              <SoftInput
                placeholder="rentEndDate"
                value={rentEndDate}
                style={my}
                onChange={(e) => setRentEndDate(e.target.value)}
              />
            </Grid>
          </Grid>
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
                  type="number"
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
          <Grid container spacing={2}>
            <Grid item xs={4} style={{ margin: "8px 0px" }}>
              <SoftBox display="flex" alignItems="center">
                <Switch checked={forAStudentOk} onChange={() => setForAStudentOk(!forAStudentOk)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={() => setForAStudentOk(!forAStudentOk)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;forStudentOk
                </SoftTypography>
              </SoftBox>
            </Grid>
            <Grid item xs={4} style={{ margin: "8px 0px" }}>
              <SoftBox display="flex" alignItems="center">
                <Switch checked={isHomeAgent} onChange={() => setIsHomeAgent(!isHomeAgent)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;isHomeAgent
                </SoftTypography>
              </SoftBox>
            </Grid>
            <Grid item xs={4} style={{ margin: "8px 0px" }}>
              <SoftBox display="flex" alignItems="center">
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
            </Grid>
          </Grid>
          {isHomeAgent && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SoftInput
                  placeholder="homeAgentName"
                  value={homeAgentName}
                  style={my}
                  onChange={(e) => setHomeAgentName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <SoftInput
                  placeholder="homeAgentFee"
                  type="number"
                  value={homeAgentFee}
                  style={my}
                  onChange={(e) => setHomeAgentFee(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
          <Grid style={{ marginTop: "4px" }} container spacing={2} justifyContent="flex-end"></Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Home</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateHome.propTypes = {
  myid: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
