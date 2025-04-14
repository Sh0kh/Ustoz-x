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
      <SoftTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
        fullWidth
        maxWidth="lg"
      >
        <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Preview File Path</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Table Name */}
            <Grid item xs={4}>
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
                name:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                type:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                size:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                extension:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                hashId:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                contentType:
              </SoftTypography>
              <br />

              <SoftTypography variant="button" textTransform="uppercase">
                fileType:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                fileCategory:
              </SoftTypography>
              <br />
              <SoftTypography variant="button" textTransform="uppercase">
                uploadPath:
              </SoftTypography>
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
              <SoftTypography variant="caption">{item.name ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.type ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.size ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.extension ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.hashId ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.contentType ?? emptynote}</SoftTypography>
              <br />

              <SoftTypography variant="caption">{item.fileType ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.fileCategory ?? emptynote}</SoftTypography>
              <br />
              <SoftTypography variant="caption">{item.uploadPath ?? emptynote}</SoftTypography>
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
