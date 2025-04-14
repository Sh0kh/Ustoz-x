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
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftSelect from "components/SoftSelect";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import { useEffect, useState } from "react";
import { Comment } from "yaponuz/data/api";

export default function CommentList() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [category, setCategory] = useState("AIR_TICKET");
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "star", accessor: "star" },
    { Header: "comment", accessor: "comment" },
    { Header: "creatorName", accessor: "creatorName" },
    { Header: "action", accessor: "action" },
  ];

  const getComment = async () => {
    try {
      const response = await Comment.getAllComment(page, size, category);
      if (response.success) {
        setTotalPages(response.object.totalPages);
        setComments(response.object.content);
      } else {
        console.log(`Response isSuccess: ${response.success}`);
      }
    } catch (err) {
      console.log(`Error from comments: ${err}`);
    }
  };

  const rows = comments.map((comment) => ({
    id: comment.id,
    createdAt: comment.createdAt,
    star: comment.star,
    comment: (
      <SoftBox style={{ maxWidth: "200px", maxHeight: "200px", overflow: "auto" }}>
        <SoftTypography style={{ maxWidth: "200px" }} variant="button" fontWeight="medium">
          {comment.comment}
        </SoftTypography>
      </SoftBox>
    ),
    creatorName: comment.creatorName,
  }));

  const mytabledata = {
    columns,
    rows,
  };

  useEffect(() => {
    getComment();
  }, [page, size, category, totalPages]);

  // style
  const myx = { margin: "0px 30px" };

  // options variable

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <SoftBox display="flex" justifyContent="center" alignItems="flex-start" p={3}>
          <SoftBox lineHeight={1} style={{ myx, width: "300px" }}>
            <SoftSelect
              style={{ width: "300px" }}
              placeholder="Select Category Type"
              onChange={(selectedOption) => setCategory(selectedOption.value)} // Adjusted onChange function
              size="large"
              options={[
                { value: "AIR_TICKET", label: "AIR_TICKET" },
                { value: "ARTICLE", label: "ARTICLE" },
                { value: "HOME_AGENT", label: "HOME_AGENT" },
                { value: "JOB", label: "JOB" },
                { value: "OTHER", label: "OTHER" },
                { value: "SCHOOL_AGENT", label: "SCHOOL_AGENT" },
                { value: "SHOP_FOOD", label: "SHOP_FOOD" },
                { value: "SHOP_NO_FOOD", label: "SHOP_NO_FOOD" },
              ]}
            />
          </SoftBox>
        </SoftBox>

        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Comments - {category}
              </SoftTypography>
            </SoftBox>
            {/* <Stack spacing={1} direction="row">
              <AddJob />
            </Stack> */}
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
            <SoftPagination item onClick={() => setPage(page - 1)}>
              <Icon>keyboard_arrow_left</Icon>
            </SoftPagination>
            {[...Array(Math.ceil(totalPages))].map((_, index) => (
              <SoftPagination
                key={index}
                item
                active={index === page}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </SoftPagination>
            ))}
            <SoftPagination item onClick={() => setPage(page + 1)}>
              <Icon>keyboard_arrow_right</Icon>
            </SoftPagination>
          </SoftPagination>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}
