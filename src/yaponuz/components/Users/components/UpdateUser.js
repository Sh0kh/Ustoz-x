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
import { Users } from "yaponuz/data/api";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import { Group } from "yaponuz/data/controllers/group";

export default function UpdateUser({ item, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [genderType, setGenderType] = useState();
  const [id, setId] = useState(item.id);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verification, setVerification] = useState();
  const [email, setEmail] = useState();
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [GroupOptions, setGroupOptions] = useState([]);
  const [selectedGroupValue, setSelectedGroupValue] = useState(null); // Изменено на null

  useEffect(() => {
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setGenderType({ value: item.genderType, label: item.genderType });
    setId(item.id);
    setPhoneNumber(item.phoneNumber);
    setVerification(item.verification);
    setEmail(item.email);
    console.log(item)
    if (item.groupId && item.groupName) {
      setSelectedGroupValue({ value: item.groupId, label: item.groupName }); // Устанавливаем начальное значение
    }
    setDateOfBirth(
      new Date(item.dateBirth).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null"
    );
  }, [item]);

  useEffect(() => {
    // Проверяем, если есть item и GroupOptions загружены
    if (item && GroupOptions.length > 0) {
      // Ищем группу по groupId в загруженных опциях
      const selectedGroup = GroupOptions.find(group => group.value === item.groupId);

      // Если группа найдена, устанавливаем ее как выбранную
      if (selectedGroup) {
        setSelectedGroupValue(selectedGroup);
      } else {
        // Если группа не найдена, очищаем значение
        setSelectedGroupValue(null);
      }
    }
  }, [item, GroupOptions]); // Срабатывает, когда item или GroupOptions изменяются

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Updated!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Updated!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const data = {
      firstName,
      lastName,
      genderType: genderType?.value,
      creatorId: localStorage.getItem("userId"),
      verification,
      email,
      id,
      groupId: selectedGroupValue?.value, // Добавлено безопасное обращение к value
    };
    try {
      const response = await Users.updateUser(data);
      showAlert(response);
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

  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getAllGroup(page, size);
      const groups = response.object || []; // Assuming response.object.data holds the array of groups

      // Map the fetched data to match the expected format of SoftSelect options
      const formattedOptions = groups?.map((group) => ({
        label: group.name, // Replace 'name' with the actual property for group label
        value: group.id,   // Replace 'id' with the actual property for group value
      }));

      setGroupOptions(formattedOptions);
    } catch (err) {
      console.error("Error from groups list GET: ", err);
    }
  };

  // mounting
  React.useEffect(() => {
    if(open){
      getAllGroups(page, size);
    }
  }, [page, size, open]);

  const my = { margin: "5px 0px" };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: { minHeight: "600px" }, // Увеличиваем высоту модального окна
        }}
      >
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          {/* Each input is placed in its own row with labels */}
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Select Group
            </SoftTypography>
            <SoftSelect
              placeholder="Select Group"
              value={selectedGroupValue} // Используем selectedGroupValue
              onChange={(value) => setSelectedGroupValue(value)}
              options={GroupOptions}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  position: "absolute",
                  zIndex: 9999,
                }),
                container: (provided) => ({
                  ...provided,
                  position: "relative",
                }),
              }}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              First Name
            </SoftTypography>
            <SoftInput
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Last Name
            </SoftTypography>
            <SoftInput
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Phone Number
            </SoftTypography>
            <SoftInput
              placeholder="Phone Number"
              value={phoneNumber}
              disabled
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Gender
            </SoftTypography>
            <SoftSelect
              placeholder="Select a Gender"
              onChange={(selectedOption) => setGenderType(selectedOption)}
              value={genderType}
              options={[
                { value: "ERKAK", label: "ERKAK" },
                { value: "AYOL", label: "AYOL" },
              ]}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Birthday
            </SoftTypography>
            <SoftInput
              placeholder="Birthday"
              value={dateOfBirth}
              disabled
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </SoftBox>
          <SoftBox style={my}>
            <SoftTypography variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
            <SoftInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </SoftBox>
          <SoftBox display="flex" alignItems="center" style={{ marginTop: "10px" }}>
            <Switch checked={verification} onChange={() => setVerification(!verification)} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;{verification ? "VERIFICATION TRUE" : "VERIFICATION FALSE"}
            </SoftTypography>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateUser.propTypes = {
  item: PropTypes.object,
  refetch: PropTypes.func,
};