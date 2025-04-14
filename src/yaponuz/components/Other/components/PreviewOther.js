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
import { Other } from "yaponuz/data/api";
import SoftTypography from "components/SoftTypography";
import Box from "@mui/material/Box";
import JobIcon from "yaponuz/data/img/other.png"; // Ikona rasm
import Ellipse from "yaponuz/data/img/ellipse.png";
import Train from "yaponuz/data/img/train.png";

export default function PreviewOther({ id }) {
  const [other, setOther] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async (id) => {
      const response = await Other.getOne(id);
      console.log(response.object);
      setOther(response.object);
    };

    getJob(id);
  }, [id]);

  return (
    <>
      <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
        <Icon>visibility</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} style={{ minWidth: "374px" }}>
        <DialogTitle>Preview Other</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} style={{ maxWidth: "374px" }}>
              <Box display="flex" alignItems="center">
                {/* Icon */}
                <Box mr={1}>
                  <img src={JobIcon} alt="Job Icon" />
                </Box>
                {/* Title va Description */}
                <Box flexGrow={1} mx={1}>
                  <SoftTypography variant="h5">{other.title}</SoftTypography>
                  <SoftTypography variant="body2" color="secondary">
                    {other.phone}
                  </SoftTypography>
                </Box>
              </Box>
              <Box m={1} dangerouslySetInnerHTML={{ __html: other.description }}></Box>
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

PreviewOther.propTypes = {
  id: PropTypes.number.isRequired,
};
