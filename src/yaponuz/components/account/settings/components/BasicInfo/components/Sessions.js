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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { device } from "yaponuz/data/controllers/device";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteSessions from "./DeleteSessions";

function Sessions() {
  const { ID } = useParams()
  const [deviceData, setDeviceData] = useState([])
  const actionButtonStyles = {
    "& .material-icons-round": {
      transform: `translateX(0)`,
      transition: "all 200ms cubic-bezier(0.34,1.61,0.7,1.3)",
    },

    "&:hover .material-icons-round, &:focus .material-icons-round": {
      transform: `translateX(4px)`,
    },
  };

  const getAllDevice = async () => {
    try {
      const response = await device.getDevice(ID)
      setDeviceData(response?.object)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllDevice()
  }, [])

  return (
    <Card id="sessions">
      <SoftBox p={3} lineHeight={1}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5">Sessions</SoftTypography>
        </SoftBox>
        <SoftTypography variant="button" color="text" fontWeight="regular">
          This is a list of devices that have logged into your account. Remove those that you do not
          recognize.
        </SoftTypography>
      </SoftBox>
      <SoftBox pb={3} px={3} sx={{ overflow: "auto" }}>
        {/* <Divider /> */}
        {deviceData?.map((i, index) => (
          <>
            <SoftBox
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width={{ xs: "max-content", sm: "100%" }}
            >
              <SoftBox display="flex" alignItems="center" mr={2}>
                <SoftBox textAlign="center" color="text" px={{ xs: 0, md: 1.5 }} opacity={0.6}>
                  <Icon fontSize="default">phone_iphone</Icon>
                </SoftBox>
                <SoftBox ml={2}>
                  <SoftTypography display="block" variant="body2" fontWeight="regular" color="text">
                    {i?.deviceType}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox display="flex" alignItems="center">
                <DeleteSessions id={i?.id} refetch={getAllDevice}/>
              </SoftBox>
            </SoftBox>
            <Divider />
          </>
        ))}
      </SoftBox>
    </Card>
  );
}

export default Sessions;
