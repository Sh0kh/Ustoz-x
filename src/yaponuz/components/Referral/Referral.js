import * as React from "react";
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import DataTable from "examples/Tables/DataTable";
import { Referral as ReferralApi } from "yaponuz/data/api"; // Referral API
import AddReferral from "./components/AddReferrals"; // AddReferral component

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function Referral() {
  // state variables
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    count: '',
    refCode: '',
    refUser: ''
  });
  const [refCode, setRefCode] = useState('');
  const [refUser, setRefUser] = useState(localStorage.getItem('userId'));
  const [size, setSize] = useState(30);
  const [referalData, setReferalData] = useState([]);

  // fetching referral data
  const getAllReferral = async () => {
    setLoading(true);
    try {
      const response = await ReferralApi.getAllReferral(page, size, formData.count, formData.refCode, formData.refUser);
      if(response.object){
        setReferalData(response.object);
      }
    } catch (err) {
      console.log("Error from versions list GET: ", err);
    } finally {
      setLoading(false);
    }
  };

  // handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // table data
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "count", accessor: "count" },
    { Header: "refCode", accessor: "refCode" },
    { Header: "refUser", accessor: "refUser" },
  ];

  const rows = referalData.map((referal) => ({
    id: referal.id,
    createdAt:
      new Date(referal.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    count: referal.count,
    refCode: referal.refCode,
    refUser: referal.refUser,
    action: <Icon>edit</Icon>, // Action column (edit button)
  }));

  const tabledata = { columns, rows };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Referrals
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <AddReferral />
            </Stack>
          </SoftBox>
          <SoftBox p={3} display="flex" gap="10px">
            {/* Start form */}
            <SoftBox width="100%">
              <SoftTypography variant="subtitle2">Referral Code</SoftTypography>
              <SoftInput
                type="text"
                name="refCode"
                value={formData.refCode}
                onChange={handleChange}
                fullWidth
              />
            </SoftBox>
            <SoftBox width="100%">
              <SoftTypography variant="subtitle2">Referral User</SoftTypography>
              <SoftInput
                type="text"
                name="refUser"
                value={formData.refUser}
                onChange={handleChange}
                fullWidth
              />
            </SoftBox>
            <SoftBox width="100%">
              <SoftTypography variant="subtitle2">Referral Count</SoftTypography>
              <SoftInput
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                fullWidth
              />
            </SoftBox>
            {/* End form */}
            <SoftButton onClick={getAllReferral} variant="contained" color="info">
              Search
            </SoftButton>
          </SoftBox>
          {loading ? (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", height: "50vh" }}>
              <div>Loading data...</div>
            </div>
          ) : (
            <DataTable table={tabledata} entriesPerPage={false} />
          )}
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}
