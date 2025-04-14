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
import SoftSelect from "components/SoftSelect";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

import { GetAuth, FileController, Home } from "yaponuz/data/api";

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import Icon from "@mui/material/Icon";
import SoftTagInput from "components/SoftTagInput";

export default function AddHome({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const [address, setAddress] = useState("");
  const [depositFee, setDepositFee] = useState();
  const [description, setDescription] = useState("");
  const [googleMapsURL, setGoogleMapsURL] = useState("");
  const [opportunities, setOpportunities] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [forAStudentOk, setForAStudentOk] = useState(false);
  const [rentFee, setRentFee] = useState();
  const [roomFloor, setRoomFloor] = useState();
  const [rentEndDate, setRentEndDate] = useState("");
  const [iconId, setIconId] = useState([]);
  const [metro, setMetro] = useState([{ metroStationName: "", walkingTime: 0 }]);

  const [roomPlan, setRoomPlan] = useState("");
  const [totalSpace, setTotalSpace] = useState();
  const [numberRooms, setNumberRooms] = useState();
  const [houseFloor, setHouseFloor] = useState();
  const [dateMoving, setDateMoving] = useState();

  // homeagent
  const [isHomeAgent, setIsHomeAgent] = useState(false);
  const [homeAgentName, setHomeAgentName] = useState("");
  const [homeAgentFee, setHomeAgentFee] = useState(0);

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
    const userId = GetAuth.getUserId();
    console.log("iconId", iconId);
    const data = {
      address: address,
      creatorId: userId,
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

    // console.log(data);

    try {
      const response = await Home.createHome(data);
      showAlert(response);
      // console.log(data);
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
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add home
      </SoftButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Home</DialogTitle>
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
                dateMoving - Ko`chib o`tish sanasi
              </SoftTypography>
              <SoftInput
                placeholder="dateMoving"
                type={isHomeAgent ? "text" : "date"}
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
                rentEndDate - Ijara tugash sanasi
              </SoftTypography>
              <SoftInput
                placeholder="rentEndDate"
                type={isHomeAgent ? "text" : "date"}
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
            <Grid item xs={6} style={{ margin: "8px 0px" }}>
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
            <Grid item xs={6} style={{ margin: "8px 0px" }}>
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
          <Button onClick={handleSave}>Add Home</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddHome.propTypes = {
  refetch: PropTypes.func,
};
