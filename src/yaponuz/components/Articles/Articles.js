/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
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
import { Article } from "yaponuz/data/api";
import ActionCell from "./components/ActionCell";
import AddArticle from "./components/AddArticle";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";
import SoftPagination from "components/SoftPagination";
import Switch from "@mui/material/Switch";
import SoftInput from "components/SoftInput";
import SoftBadge from "components/SoftBadge";
import SoftSelect from "components/SoftSelect";

const theFalse = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
);
const theTrue = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
);

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const { article } = useParams();
  const id = parseInt(article);

  // variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [title, setTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState("");
  const myx = { margin: "0px 30px" };

  const getArticles = async () => {
    try {
      const response = await Article.getArticleByCategoryId(id, page, size, title, active);
      console.log(response);
      setTotalPages(response.object.totalPages);
      setArticles(response.object.content);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "title", accessor: "title" },
    { Header: "context", accessor: "context" },
    { Header: "youTubeLink", accessor: "youTubeLink" },
    {
      Header: "Active",
      accessor: "active",
    },
    { Header: "action", accessor: "action" },
  ];

  const rows = articles.map((article) => ({
    id: article.id,
    title: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {article.title}
        </SoftTypography>
      </SoftBox>
    ),
    context: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography
          style={{ maxWidth: "200px" }}
          dangerouslySetInnerHTML={{ __html: article.context }}
          variant="button"
          fontWeight="medium"
        >
          {/* {article.context} */}
        </SoftTypography>
      </SoftBox>
    ),
    youTubeLink: (
      <SoftButton
        variant="text"
        target="_blank"
        href={article.youTubeLink}
        color="info"
        size="small"
      >
        Link to YouTube
      </SoftButton>
    ),
    active: article.active ? theTrue : theFalse,

    action: <ActionCell myid={article.id} itemme={article} refetch={getArticles} />,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getArticles();
  }, [id, page, size, title, active]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        {/* <Card>
          <SoftTypography
            variant="h4"
            style={{ textAlign: "center", marginTop: "10px" }}
            fontWeight="small"
          >
            Search
          </SoftTypography> */}
        <SoftBox display="flex" justifyContent="center" alignItems="flex-start" p={3}>
          <SoftBox lineHeight={1} style={myx}>
            <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
              Title
            </SoftTypography>
            <SoftInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </SoftBox>
          <SoftBox lineHeight={1} style={myx}>
            <SoftTypography variant="h6" style={{ textAlign: "center" }} fontWeight="small">
              Active - {active.trim() === "" ? "null" : active}
            </SoftTypography>
            <SoftSelect
              style={{ width: "300px" }}
              placeholder="Select is Active"
              onChange={(selectedOption) => setActive(selectedOption.value)}
              options={[
                { value: "", label: "null" },
                { value: "false", label: "false" },
                { value: "true", label: "true" },
              ]}
            />
          </SoftBox>
        </SoftBox>
        {/* </Card> */}
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Articles - {id}
              </SoftTypography>
            </SoftBox>
            <Stack spacing={2} direction="row">
              <AddArticle parentId={id} refetch={getArticles} />
            </Stack>
          </SoftBox>
          <DataTable
            table={mytabledata}
            entriesPerPage={{
              defaultValue: 20,
              entries: [5, 7, 10, 15, 20],
            }}
            canSearch
          />
        </Card>
        <SoftBox style={{ margin: "20px auto" }}>
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

export default ArticleList;
