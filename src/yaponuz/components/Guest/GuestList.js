// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import Swal from "sweetalert2";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";

// Data
import { useEffect, useMemo, useState } from "react";
import { Guest } from "yaponuz/data/api";
import SoftBadge from "components/SoftBadge";
import PreviewGuest from "./Preview";
import { getDateFilter } from "../utils/main";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function GuestList() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // fetch data
  const getAllGuest = async (page, size) => {
    try {
      const response = await Guest.getAllGuest(page, size);
      setTotalPages(response.object.totalPages);
      setData(response.object.content);
      console.log(response);
    } catch (err) {
      console.log("Error from GUEST: ", err);
    }
  };

  // mounting
  useMemo(() => {
    getAllGuest(page, size);
  }, [page, size]);

  function refetch() {
    getAllGuest(page, size);
  }

  // delete method
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
            const response = await Guest.deleteGuest(id);
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

  // table elements
  const empty = "null";

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "block", accessor: "block" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "phoneNumber", accessor: "phoneNumber" },
    { Header: "deviceId", accessor: "deviceId" },
    { Header: "authType", accessor: "authType" },
    { Header: "action", accessor: "action" },
  ];

  const rows = data.map((user) => ({
    id: <SoftTypography variant="caption">{user.id}</SoftTypography> ?? empty,
    block: user.block ? theTrue : theFalse,
    createdAt:
      <SoftTypography variant="caption">{getDateFilter(user.createdAt)}</SoftTypography> ?? empty,
    phoneNumber:
      <SoftTypography variant="caption">{user.phoneNumber ?? empty}</SoftTypography> ?? empty,
    deviceId: <SoftTypography variant="caption">{user.deviceId ?? empty}</SoftTypography> ?? empty,
    authType: <SoftTypography variant="caption">{user.authType}</SoftTypography> ?? empty,
    action:
      (
        <SoftBox display="flex" alignItems="center">
          <SoftBox>
            <PreviewGuest item={user} />
          </SoftBox>
          <SoftBox mx={2}>
            <SoftTypography
              variant="body1"
              onClick={() => deleteItem(user.id)}
              color="secondary"
              sx={{ cursor: "pointer", lineHeight: 0 }}
            >
              <Tooltip title="Delete" placement="top">
                <Icon>delete</Icon>
              </Tooltip>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) ?? empty,
  }));

  const tabledata = {
    columns,
    rows,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Guest Users
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <DataTable
            table={tabledata}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20],
            }}
            canSearch
          />
        </Card>
        <SoftBox style={{ margin: "20px 0px" }}>
          <SoftPagination size="default">
            <SoftPagination item onClick={() => setPage(page - 1)} disabled={page === 0}>
              <Icon>keyboard_arrow_left</Icon>
            </SoftPagination>
            {[...Array(totalPages)].map((_, index) => (
              <SoftPagination
                key={index}
                item
                active={index === page}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </SoftPagination>
            ))}
            <SoftPagination
              item
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              <Icon>keyboard_arrow_right</Icon>
            </SoftPagination>
          </SoftPagination>
        </SoftBox>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}
