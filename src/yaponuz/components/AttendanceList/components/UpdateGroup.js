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
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import SoftDatePicker from "yaponuz/components/SoftDatePicker";

// import { Group } from "yaponuz/data/api";
import { Group } from "yaponuz/data/controllers/group";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function UpdateGroup({ id, item, refetch }) {
  const [open, setOpen] = useState(false);
  // variables
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  React.useEffect(() => {
    setGroupName(item.name);
    if (item.startDate) {
      setStartDate(new Date(item.startDate));
    }
    if (item.endDate) {
      setEndDate(new Date(item.endDate));
    }
  }, [id, item]);

  // modal functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // css variables
  const my = { margin: "5px 0px" };

  // then add new version function
  const showAlert = (response) => {
    function reload() {
      refetch();
    }
    if (response.success) {
      Swal.fire("Added", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  // add new version function
  const handleSave = async () => {
    try {
      const loadingSwal = Swal.fire({
        title: "Updating...",
        text: "Please Wait!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const data = { id: item.id, groupName, startDate, endDate };
      const response = await Group.updateGroup(data);
      loadingSwal.close();

      showAlert(response);

      // close the modal
      setOpen(false);
    } catch (err) {
      console.log("Error from handleSave from add Group: ", err);
    }
  };

  // return the JSX code
  return (
    <>
      <SoftTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
        onClick={handleClickOpen}
      >
        <Tooltip title="Edit" placement="top">
          <Icon>edit</Icon>
        </Tooltip>
      </SoftTypography>
      <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
        <DialogTitle>Update Group</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* group */}
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Group Name
              </SoftTypography>
              <SoftInput
                placeholder="Enter the Group Name"
                value={groupName}
                style={my}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <SoftBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    height="100%"
                  >
                    <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        Start Date
                      </SoftTypography>
                    </SoftBox>
                    <SoftDatePicker value={startDate} onChange={handleSetStartDate} />
                  </SoftBox>
                </Grid>
                <Grid item xs={6}>
                  <SoftBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    height="100%"
                  >
                    <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        End Date
                      </SoftTypography>
                    </SoftBox>
                    <SoftDatePicker value={endDate} onChange={handleSetEndDate} />
                  </SoftBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Update Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateGroup.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func,
};
