import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import UpdateUser from "../UpdateUser";
import Swal from "sweetalert2";
import { Users } from "yaponuz/data/api";
import SendSms from "../SendSms";
import PreviewUser from "../PreviewUser";
import OpenChat from "../OpenChat";
import { useEffect } from "react";

function ActionCell({ id, item, refetch }) {
  console.log(id, item, "Action Cell");

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
        title: "Ishonchingiz komilmi?",
        text: "Bu amalni qaytarib bo‘lmaydi!",
        showCancelButton: true,
        confirmButtonText: "Ha, o‘chirilsin!",
        cancelButtonText: "Yo‘q, bekor qilish!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value && response.success) {
          newSwal.fire("O‘chirildi!", response.message, "success").then(() => {
            window.location.reload();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        } else {
          newSwal.fire("O‘chirilmadi!", response.message, "error").then(() => {
            window.location.reload();
          });
          window.location.reload;
        }
      });
  };

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
          title: "Ishonchingiz komilmi?",
          text: "Bu amalni qaytarib bo‘lmaydi!",
          showCancelButton: true,
          confirmButtonText: "Ha, o‘chirilsin!",
          cancelButtonText: "Yo‘q, bekor qilish!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
              title: "O‘chirilmoqda...",
              text: "Iltimos, kuting!",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            const response = await Users.deleteUser(item.id);
            loadingSwal.close();

            if (response.success) {
              newSwal.fire("O‘chirildi!", response.message, "success").then(() => {
                refetch();
              });
            } else {
              newSwal.fire("O‘chirilmadi!", response.message, "error").then(() => {
                refetch();
              });
            }
          }
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  // const deleteSchool = async (homeId) => {
  //   // const userId = GetAuth.getUserId();

  //   try {
  //     const response = await Users.deleteUser(homeId);
  //     showAlert(response);
  //   } catch (error) {
  //     console.error("Error deleting home:", error.message);
  //   }
  // };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftBox>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          {/* <PreviewUser id={id} /> */}
        </SoftTypography>
      </SoftBox>
      <SoftBox ml={1}>
        <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <UpdateUser myid={id} item={item} refetch={refetch} />
        </SoftTypography>
      </SoftBox>

      <SoftTypography
        variant="body1"
        onClick={() => deleteItem(id)}
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
      >
        <Tooltip title="O‘chirish" placement="top">
          <Icon>delete</Icon>
        </Tooltip>
      </SoftTypography>
      {/* <SoftTypography
        mx={1}
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
      >
        <SendSms id={myid} item={itemme} />
      </SoftTypography>
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <OpenChat id={myid} userData={itemme} />
      </SoftTypography> */}
    </SoftBox>
  );
}

ActionCell.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
};
export default ActionCell;
