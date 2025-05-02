import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import UpdateAir from "../UpdateChat";
import Swal from "sweetalert2";
import { Air, GetAuth } from "yaponuz/data/api";
import ViewChat from "../ViewChat";

function ActionCell({ myid, chatid, itemme, refetch }) {
  const showAlert = (response) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: "button button-success",
        cancelButton: "button button-error",
      },
      buttonsStyling: false,
    });

    
    newSwal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value && response.success) {
          newSwal.fire("Deleted!", response.message, "success").then(() => {
            refetch();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        } else {
          newSwal.fire("Not Deleted!", response.message, "error").then(() => {
            refetch();
          });
        }
      });
  };

  const deleteHome = async (homeId) => {
    const userId = GetAuth.getUserId();

    try {
      const response = await Air.deleteAirticket(homeId, userId);
      showAlert(response);
    } catch (error) {
      console.error("Error deleting home:", error.message);
    }
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <ViewChat id={myid} chatid={chatid} />
      </SoftTypography>
      {/* <SoftBox mx={2}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <UpdateAir myid={myid} itemme={itemme} />
        </SoftTypography>
      </SoftBox>
      <SoftTypography
        variant="body1"
        onClick={() => deleteHome(myid)}
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
      >
        <Tooltip title="Delete" placement="top">
          <Icon>delete</Icon>
        </Tooltip>
      </SoftTypography> */}
    </SoftBox>
  );
}

ActionCell.propTypes = {
  myid: PropTypes.number.isRequired,
  chatid: PropTypes.number,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
};

export default ActionCell;
