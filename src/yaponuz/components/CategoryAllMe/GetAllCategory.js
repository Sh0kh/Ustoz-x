import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";

// Soft UI Dashboard components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";
import SoftInput from "components/SoftInput";
import SoftPagination from "components/SoftPagination";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ActionCell from "./components/ActionCell";

// Hooks
import useFetch from "yaponuz/hooks/useFetch";

// Status badges
// const StatusBadge = ({ active }) => (
//   <SoftBadge 
//     variant="contained" 
//     color={active ? "success" : "error"} 
//     size="xs" 
//     badgeContent={active ? "true" : "false"} 
//     container 
//   />
// );

// StatusBadge

function CategoriesAll() {
  // Fetch categories data
  const { data, loading, error } = useFetch("category/get/all", "GET");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Price", accessor: "price" },
    { Header: "Context", accessor: "context" },
    { Header: "Active", accessor: "active" },
    { Header: "Actions", accessor: "action" },
  ];

  const rows = categories.map((category) => ({
    id: category.id,
    title: category.title,
    price: `$${category.price}`,
    context: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography variant="button" fontWeight="medium">
          {category.context}
        </SoftTypography>
      </SoftBox>
    ),
    active: "null",
    action: <ActionCell myid={category.id} itemme={category} refetch={() => {
      // Refetch data by calling useFetch again
      const { data: newData } = useFetch("/category/get/all", "GET");
      if (newData) setCategories(newData);
    }} />,
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <SoftTypography variant="h6">Loading categories...</SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <SoftTypography variant="h6" color="error">
            Error loading categories: {error}
          </SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Categories
              </SoftTypography>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {categories.length} total categories
              </SoftTypography>
            </SoftBox>
            
            <SoftButton variant="gradient" color="info">
              <Icon>add</Icon>&nbsp;
              Add New Category
            </SoftButton>
          </SoftBox>

          <DataTable
            table={{
              columns,
              rows,
            }}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20],
            }}
            canSearch
          />
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CategoriesAll;