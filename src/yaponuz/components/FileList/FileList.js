import React, { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";
import { FileController } from "yaponuz/data/api"; // Corrected to use FileController

import SoftBadge from "components/SoftBadge";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SoftSelect from "components/SoftSelect";

// Lazy load components
const DataTable = lazy(() => import("examples/Tables/DataTable"));

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function FileList() {
  const [files, setFiles] = useState([]); // Состояние для списка файлов
  const [totalPages, setTotalPages] = useState(0); // Состояние для общего количества страниц
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [open, setOpen] = useState(false); // Состояние для открытия/закрытия модального окна
  const [page, setPage] = useState(0); // Состояние для текущей страницы пагинации
  const [size, setSize] = useState(20); // Состояние для количества элементов на странице
  const [file, setFile] = useState(null); // Состояние для файла
  const [category, setCategory] = useState(''); // Состояние для категории файла

  const getAllFiles = async () => {
    setLoading(true);
    try {
      const response = await FileController.getAllFiles(page, size);
      setFiles(response.object.content);
      setTotalPages(response.object.totalPages); // Set total pages for pagination
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllFiles();
  }, [page, size]);

  const deleteFile = async (fileHashId) => {
    try {
      const newSwal = Swal.mixin({
        customClass: {
          confirmButton: "button button-success",
          cancelButton: "button button-error",
        },
        buttonsStyling: false,
      });

      const result = await newSwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

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

        const response = await FileController.deleteFile(fileHashId, localStorage.getItem('userId'));
        loadingSwal.close();

        if (response.success) {
          await newSwal.fire("Deleted!", response.message, "success");
          getAllFiles(); // Refresh file list after deletion
        } else {
          await newSwal.fire("Not Deleted!", response.message, "error");
          getAllFiles();
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error.message);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "name", accessor: "name" },
      { Header: "fileType", accessor: "fileType" },
      { Header: "extension", accessor: "extension" },
      { Header: "deleted", accessor: "deleted" },
      { Header: "action", accessor: "action" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      files.map((file) => ({
        id: file.id ?? "null",
        name: file.name ?? "null",
        fileType: file.fileType ?? "null",
        extension: file.extension ?? 'null',
        deleted: file.deleted ? theTrue : theFalse,
        action: (
          <SoftBox display="flex" alignItems="center" gap="10px">
            <SoftTypography
              variant="body1"
              color="secondary"
              sx={{ cursor: "pointer", lineHeight: 0 }}
              onClick={() => deleteFile(file.hashId)}
            >
              <Tooltip title="Delete" placement="top">
                <Icon>delete</Icon>
              </Tooltip>
            </SoftTypography>
          </SoftBox>
        ),
      })),
    [files]
  );

  const mytabledata = useMemo(
    () => ({
      columns,
      rows,
    }),
    [columns, rows]
  );

  const handleSave = async () => {
    try {
      const loadingSwal = Swal.fire({
        title: "Adding...",
        text: "Please Wait!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const userId = localStorage.getItem("userId")
      const response = await FileController.uploadFile(file, category, userId);
      loadingSwal.close();
      Swal.fire(response.success ? "Added" : "Error", response.message || response.error, response.success ? "success" : "error");
      setOpen(false);
      getAllFiles();

      return response;
    } catch (err) {
      console.log("File Upload Error: ", err);
      return false;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">All Files</SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <SoftButton variant="gradient" onClick={handleClickOpen} color="dark">+ Upload file</SoftButton>
              <Dialog open={open} onClose={handleClose} size="lg" fullWidth>
                <DialogTitle>Upload New File</DialogTitle>
                <DialogContent style={{ overflow: 'visible' }}>
                  <SoftTypography variant="caption">Category</SoftTypography>
                  <SoftSelect
                    options={[
                      { label: "Admin category", value: "admin_category" },
                      { label: "User Avatar", value: "user_avatar" },
                      { label: "User document", value: "user_document" },
                    ]}
                    onChange={(selectedOption) => setCategory(selectedOption.value)} // Only set category to the value
                    fullWidth
                    value={category || ''}
                  />

                  <SoftTypography variant="caption">Upload File</SoftTypography>
                  <SoftInput
                    type="file"
                    fullWidth
                    onChange={(e) => setFile(e.target.files[0])} // Используем setFile для файла
                  />
                </DialogContent>
                <DialogActions>
                  <SoftButton color="secondary" onClick={handleClose}>Cancel</SoftButton>
                  <SoftButton onClick={handleSave} variant="gradient" color="success">Save</SoftButton>
                </DialogActions>
              </Dialog>
            </Stack>
          </SoftBox>
          <Suspense fallback={<div>Loading...</div>}>
            <DataTable table={mytabledata} isLoading={loading} />
          </Suspense>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
}

export default FileList;
