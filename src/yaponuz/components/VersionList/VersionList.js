// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";

// Data
import { useEffect, useState } from "react";
import { Version } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import SoftBadge from "components/SoftBadge";

import AddVersion from "./components/AddVersions";
import { Frown, Loader } from "lucide-react";
const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

export default function VersionList() {
  // variables
  const [versions, setVersions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [loading, setLoading] = useState(true)

  // fetching data function
  const getAllVersions = async (page, size) => {
    setLoading(true)
    try {
      const response = await Version.getAllVersion(page, size);
      setVersions(response.object.content);
      setTotalPages(response.object.totalPages);
    } catch (err) {
      console.log("Error from versions list GET: ", err);
    }finally{
      setLoading(false)
    }
  };

  // mounting
  useEffect(() => {
    getAllVersions(page, size);
  }, [page, size]);

  // table elements
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "version", accessor: "version" },
    { Header: "life", accessor: "life" },
    { Header: "comment", accessor: "comment" },
    { Header: "action", accessor: "action" },
  ];

  const rows = versions.map((version) => ({
    id: version.id,
    createdAt:
      new Date(version.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    version: version.version,
    life: version.life ? theTrue : theFalse,
    comment: version.comment,
    action: (
      <ActionCell id={version.id} item={version} refetch={() => getAllVersions(page, size)} />
    ),
  }));

  const tabledata = {
    columns,
    rows,
  };

  const myx = { margin: "0px 30px" };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Versions
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddVersion refetch={() => getAllVersions(page, size)} />
            </Stack>
          </SoftBox>
          {loading ? (
            <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
              <Loader className="animate-spin ml-2 size-10" />
              <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
            </div>
          ) : tabledata?.rows.length !== 0 ? (
            <>
              <DataTable
                table={tabledata}
                entriesPerPage={{
                  defaultValue: 20,
                  entries: [5, 7, 10, 15, 20],
                }}
                canSearch
              />
            </>
          ) : (
            <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
              <Frown className="size-20" />
              <div className="text-center">
                <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
                <p className="text-sm text-gray-700">
                  balki, filtrlarni tozalab ko`rish kerakdir
                </p>
              </div>
            </div>
          )}

        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}
