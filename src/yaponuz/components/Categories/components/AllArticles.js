import * as React from "react";
import { useState, useMemo, Suspense, lazy } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SoftButton from "components/SoftButton";
import { Article } from "yaponuz/data/api";
import { getDateFilter } from "yaponuz/components/utils/main";
import SizableContent from "yaponuz/components/utils/SizableContent";
import SoftPagination from "components/SoftPagination";
import SoftBox from "components/SoftBox";
import Icon from "@mui/material/Icon";
import SoftBadge from "components/SoftBadge";
import Stack from "@mui/material/Stack";
import SoftTypography from "components/SoftTypography";
import AddArticle from "./AddArticle";
import PreviewCategory from "./Preview";
import PreviewUser from "./PreviewUser";

// Lazy load components
const DataTable = lazy(() => import("examples/Tables/DataTable"));
const ActionCell = lazy(() => import("yaponuz/components/Articles/components/ActionCell"));

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function AllArticles() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async (page, size) => {
    setLoading(true);
    try {
      const response = await Article.getAllAdmin(page, size);
      if (response.success) {
        setData(response.object.content);
        setTotalPages(response.object.totalPages);
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log("Error from All Articles: ", err);
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    getData(page, size);
  }, [page, size]);

  const refetch = () => {
    getData(page, size);
  };

  // Memoize table columns
  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "title", accessor: "title" },
      { Header: "createdAt", accessor: "createdAt" },
      { Header: "createdBy", accessor: "createdBy" },
      { Header: "active", accessor: "active" },
      { Header: "categoryId", accessor: "categoryId" },
      { Header: "action", accessor: "action" },
    ],
    []
  );

  // Memoize table rows
  const rows = useMemo(
    () =>
      data.map((item) => ({
        id: item.id ?? "null",
        title: <SizableContent data={item.title} /> ?? "null",
        createdAt: getDateFilter(item.createdAt) ?? "null",
        createdBy: item.createdBy ? <PreviewUser id={item.createdBy} /> : "null",
        active: item.active ? theTrue : theFalse,
        categoryId: <PreviewCategory id={item.categoryId} /> ?? "null",
        action: <ActionCell myid={item.id} itemme={item} refetch={refetch} /> ?? "null",
      })),
    [data]
  );

  const mytabledata = useMemo(
    () => ({
      columns,
      rows,
    }),
    [columns, rows]
  );

  const renderPagination = useMemo(() => {
    const paginationItems = [];

    // Previous Page Button
    paginationItems.push(
      <SoftPagination item onClick={() => setPage(page - 1)} disabled={page === 0} key="prev">
        <Icon>keyboard_arrow_left</Icon>
      </SoftPagination>
    );

    // First Page
    paginationItems.push(
      <SoftPagination item onClick={() => setPage(0)} active={page === 0} key={0}>
        1
      </SoftPagination>
    );

    // Ellipsis before current page range
    if (page > 2) {
      paginationItems.push(<SoftPagination key="ellipsis1">...</SoftPagination>);
    }

    // Current Page Range
    for (let i = Math.max(1, page - 1); i <= Math.min(page + 1, totalPages - 2); i++) {
      paginationItems.push(
        <SoftPagination item onClick={() => setPage(i)} active={page === i} key={i}>
          {i + 1}
        </SoftPagination>
      );
    }

    // Ellipsis after current page range
    if (page < totalPages - 3) {
      paginationItems.push(<SoftPagination key="ellipsis2">...</SoftPagination>);
    }

    // Last Page
    paginationItems.push(
      <SoftPagination
        item
        onClick={() => setPage(totalPages - 1)}
        active={page === totalPages - 1}
        key={totalPages - 1}
      >
        {totalPages}
      </SoftPagination>
    );

    // Next Page Button
    paginationItems.push(
      <SoftPagination
        item
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages - 1}
        key="next"
      >
        <Icon>keyboard_arrow_right</Icon>
      </SoftPagination>
    );

    return paginationItems;
  }, [page, totalPages]);

  return (
    <>
      <SoftButton variant="gradient" color="primary" onClick={handleClickOpen}>
        All Articles
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>All Articles</DialogTitle>
        <DialogContent>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Articles
              </SoftTypography>
            </SoftBox>
            <Stack spacing={2} direction="row">
              <AddArticle refetch={refetch} />
            </Stack>
          </SoftBox>
          <Suspense fallback={<div>Loading data...</div>}>
            {loading ? (
              <div
                style={{ width: "100%", display: "flex", justifyContent: "center", height: "50vh" }}
              >
                <div>Loading data...</div>
              </div>
            ) : (
              <DataTable
                table={mytabledata}
                entriesPerPage={{
                  defaultValue: 40,
                  entries: [5, 7, 10, 15, 20, 50, 100, 200],
                }}
                canSearch
              />
            )}
          </Suspense>
          <SoftBox style={{ margin: "20px 0px" }}>
            <SoftPagination size="default">{renderPagination}</SoftPagination>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
