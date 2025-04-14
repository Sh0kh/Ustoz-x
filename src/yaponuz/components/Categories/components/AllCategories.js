import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SoftButton from "components/SoftButton";
import { useState, useMemo } from "react";
import DataTable from "examples/Tables/DataTable";
import ActionCell from "./ActionCell";
import { ArticleCategories } from "yaponuz/data/api";
import { getDateFilter } from "yaponuz/components/utils/main";
import PreviewCategory from "./Preview";
import PreviewUser from "./PreviewUser";

export default function AllCategories() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    try {
      const response = await ArticleCategories.getAllAdmin();
      if (response.success) {
        setData(response.object);
        console.log(response.object);
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log("Error from All Article Categories: ", err);
    }
  };

  useMemo(() => {
    getData();
  }, []);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "createdBy", accessor: "createdBy" },
    { Header: "parentId", accessor: "parentId" },
    { Header: "iconId", accessor: "iconId" },
    { Header: "action", accessor: "action" },
  ];
  const empty = "null";

  const rows = data.map((item) => ({
    id: item.id ?? empty,
    name: item.name ?? empty,
    createdAt: getDateFilter(item.createdAt) ?? empty,
    createdBy: item.createdBy ? <PreviewUser id={item.createdBy} /> : empty,
    parentId: item.parentId ? (
      <PreviewCategory id={item.parentId} />
    ) : (
      <SoftButton variant="text" color="error">
        null
      </SoftButton>
    ),
    iconId: item.iconId ?? empty,
    action: <ActionCell myid={item.id} itemme={item} refetch={getData} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  return (
    <>
      <SoftButton variant="gradient" color="dark" onClick={handleClickOpen}>
        All Categories
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>All Article Categories</DialogTitle>
        <DialogContent>
          <DataTable
            table={mytabledata}
            entriesPerPage={{
              defaultValue: 40,
              entries: [5, 7, 10, 15, 20, 50, 100, 200],
            }}
            canSearch
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
