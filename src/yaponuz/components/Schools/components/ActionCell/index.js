import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import UpdateSchool from "../UpdateSchool";
import Swal from "sweetalert2";
import { Schools, GetAuth } from "yaponuz/data/api";
import PreviewSchool from "../PreviewSchool";

function ActionCell({ myid, itemme, refetch }) {
  const deleteItem = async (id) => {
    try {
      const newSwal = Swal.mixin({
        customClass: {
          confirmButton: "button button-success",
          cancelButton: "button button-error",
        },
        buttonsStyling: false,
      });
      const userId = GetAuth.getUserId();

      newSwal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
              title: "Deleting...",
              text: "Please Wait!",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            const response = await Schools.deleteSchool(id, userId);
            loadingSwal.close();

            if (response.success) {
              newSwal.fire("Deleted!", response.message, "success").then(() => {
                refetch();
              });
            } else {
              newSwal.fire("Not Deleted!", response.message, "error").then(() => {
                refetch();
              });
            }
          }
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <PreviewSchool id={myid} />
      </SoftTypography>
      <SoftBox mx={1}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <UpdateSchool myid={myid} itemme={itemme} refetch={refetch} />
        </SoftTypography>
      </SoftBox>
      <SoftTypography
        variant="body1"
        onClick={() => deleteItem(myid)}
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
  myid: PropTypes.number.isRequired,
  itemme: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
};

export default ActionCell;
