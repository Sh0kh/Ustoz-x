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
import { Home, GetAuth } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import { getDateFilter } from "../utils/main";

const emptynote = "null";

export default function PreviewGuest({ item }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Preview Guest</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Table Name */}
            <Grid item xs={6}>
              <SoftTypography variant="button" textTransform="uppercase">
                id:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                createdAt:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                createdBy:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                updatedAt:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                modifiedBy:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                deletedBy:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                deleted:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                phoneNumber:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                deviceId:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                block:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                smsCode:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                smsCodeCount:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                authType:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                validityPeriod:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                guestingCount:
              </SoftTypography>
              <br />
            </Grid>

            {/* Table Content */}
            <Grid item xs={6}>
              <SoftTypography variant="caption">{item.id ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">
                {getDateFilter(item.createdAt) ?? emptynote}
              </SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.createdBy ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">
                {getDateFilter(item.updatedAt) ?? emptynote}
              </SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.modifiedBy ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.deletedBy ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.deleted ? "true" : "false"}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.phoneNumber ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.deviceId ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.block ? "true" : "false"}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.smsCode ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.smsCodeCount ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.authType ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.validityPeriod ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.guestingCount ?? emptynote}</SoftTypography>
              <br />
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

PreviewGuest.propTypes = {
  item: PropTypes.number.isRequired,
};
