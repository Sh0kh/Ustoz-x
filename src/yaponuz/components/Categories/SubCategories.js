import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import { useEffect, useState } from "react";
import { ArticleCategories } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddCategory from "./components/AddCategory";
import { useParams, useNavigate } from "react-router-dom";

function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const { id } = useParams();

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "categories", accessor: "categories" },
    { Header: "articles", accessor: "articles" },
    { Header: "action", accessor: "action" },
  ];

  const rows = subCategories.map((category) => ({
    id: category.id,
    name: category.name,
    categories: (
      <SoftButton
        variant="text"
        href={`/articles/categories/${category.id}`}
        color="info"
        size="small"
      >
        {category.childCount} categories
      </SoftButton>
    ),
    articles: (
      <SoftButton
        variant="text"
        href={`/articles/article/${category.id}`}
        color="info"
        size="small"
      >
        {category.articleCount} articles
      </SoftButton>
    ),
    action: <ActionCell myid={category.id} itemme={category} />,
  }));

  const mytabledata2 = {
    columns,
    rows,
  };

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const response = await ArticleCategories.getArticleParentId(id);
        console.log(response);
        setSubCategories(response.object);
      } catch (error) {
        console.error("Error fetching homes:", error);
      }
    };

    getSubCategories();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Article Sub Categories - {id}
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddCategory parentId={id} />
            </Stack>
          </SoftBox>
          <DataTable
            table={mytabledata2}
            entriesPerPage={{
              defaultValue: 5,
              entries: [5, 7, 10, 15, 20, 25],
            }}
            canSearch
          />
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SubCategories;
