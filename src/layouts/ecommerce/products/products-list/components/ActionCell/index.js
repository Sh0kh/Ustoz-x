import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ActionCell({ myid }) {
  const handleClick = (id) => {
    console.log(id);
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftBox mx={2} onClick={() => handleClick(myid)}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <Tooltip title="Edit" placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </SoftTypography>
      </SoftBox>
      <SoftTypography
        variant="body1"
        onClick={() => handleClick(myid)}
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
      >
        <Tooltip title="Delete" placement="top">
          <Icon>delete</Icon>
        </Tooltip>
      </SoftTypography>
    </SoftBox>
  );
}

ActionCell.propTypes = {
  myid: PropTypes.number.isRequired, // Adjust the prop type as per your requirements
};

export default ActionCell;
