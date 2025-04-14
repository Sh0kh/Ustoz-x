import React, { useEffect, useState, useCallback } from "react";
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
import formatReadableDate from "./formatReadableDate";

export default function PreviewUser({ id }) {
  const [other, setOther] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getUser = useCallback(async () => {
    try {
      const response = await Users.getOneUser(id);
      if (response && response.object) {
        setOther(response.object);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user data. Please try again later.");
    }
  }, [id]);

  useEffect(() => {
    if (open) {
      getUser();
    }
  }, [open, getUser]);

  const renderValue = (field, value) => {
    if (value === null || value === undefined) {
      return (
        <SoftTypography variant="subtitle2" color="secondary">
          Empty field
        </SoftTypography>
      );
    }
    if (typeof value === "boolean") {
      return value.toString();
    }
    if (field === "createdAt" || field === "updatedAt") {
      return formatReadableDate(value.toLocaleString());
    }
    return value;
  };

  const renderUserInfo = () => {
    if (error) {
      return <SoftTypography color="error">{error}</SoftTypography>;
    }
    if (!other) {
      return <SoftTypography>Loading...</SoftTypography>;
    }

    const fields = [
      "id",
      "createdAt",
      "updatedAt",
      "firstName",
      "lastName",
      "username",
      "genderType",
      "dateBirth",
      "currentCountry",
      "email",
      "accountType",
      "deleted",
      "myReferralNumber",
      "userHashId",
      "deviceId",
    ];

    return (
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        {/* Left side: Fields */}
        <Box display="flex" flexDirection="column" gap={1}>
          {fields.map((field) => (
            <SoftTypography key={field} variant="body2" color="textSecondary">
              {field}
            </SoftTypography>
          ))}
        </Box>

        {/* Right side: Values */}
        <Box display="flex" flexDirection="column" gap={1} textAlign="right">
          {fields.map((field) => (
            <SoftTypography key={field} variant="subtitle2" fontWeight="bold">
              {renderValue(field, other[field])}
            </SoftTypography>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
        <Icon>visibility</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Preview Other</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box mr={1}>
                  <img src={JobIcon} alt="Job Icon" />
                </Box>
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">{other?.firstName ?? "N/A"}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {other?.phoneNumber ?? "N/A"}
                  </SoftTypography>
                </Box>
              </Box>
              <Box>
                <Box mt={1}>
                  <SoftTypography variant="h5">Foydalanuvchi Haqida</SoftTypography>
                </Box>
                {renderUserInfo()}
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
