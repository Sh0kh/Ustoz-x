import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import UpdateVersion from "../UpdateCourse";

import { Course } from "yaponuz/data/controllers/course";
import UpdateCourse from "../UpdateCourse";
import CourseDetail from "../CourseDetail";
import { NavLink } from "react-router-dom";

export default function ActionCell({ id, item, refetch }) {
  const deleteItem = async (id) => {
    try {
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
        .then(async (result) => {
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
            const response = await Course.deleteCourse(id);
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
      <SoftBox >
        <NavLink to={`/cours/detail/${id}`}>
          <SoftTypography
            variant="body1"
            color="secondary"
            sx={{ cursor: "pointer", lineHeight: 0 }}
          >
            <Tooltip title="Preview" placement="top">
              <Icon sx={{ cursor: "pointer" }}>
                visibility
              </Icon>
            </Tooltip>
          </SoftTypography>
        </NavLink>
      </SoftBox>

      <SoftBox mx={2}>
        <UpdateCourse id={id} item={item} refetch={refetch} />
      </SoftBox>
      <SoftTypography
        variant="body1"
        onClick={() => deleteItem(id)}
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
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
};
