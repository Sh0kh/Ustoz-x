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
import SubCategories from "./SubCategories";
import { Routes, Route, useNavigate } from "react-router-dom";

import ArticleList from "../Articles/Articles";
import AllCategories from "./components/AllCategories";
import AllArticles from "./components/AllArticles";

function Categories() {
  const [categories, setCategories] = useState([]);
  // const [parentId, setParentId] = useState(null);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "name", accessor: "name" },
    { Header: "categories", accessor: "categories" },
    { Header: "articles", accessor: "articles" },
    { Header: "action", accessor: "action" },
  ];

  const getCategories = async () => {
    try {
      const response = await ArticleCategories.getArticleCategory();
      console.log(response);
      setCategories(response.object);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const rows = categories.map((category) => ({
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
    action: <ActionCell myid={category.id} itemme={category} refetch={getCategories} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Article Categories
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AllArticles />
              <AllCategories />

              <AddCategory refetch={getCategories} />
            </Stack>
          </SoftBox>
          <DataTable
            table={mytabledata}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20, 50],
            }}
            canSearch
          />
        </Card>
      </SoftBox>
      <Footer />
      <Routes>
        <Route path=":id" element={<SubCategories />} />
        <Route path=":article" element={<ArticleList />} />
      </Routes>
    </DashboardLayout>
  );
}

export default Categories;
