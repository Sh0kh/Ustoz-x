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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types"; // Импорт PropTypes


// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Images
import burceMars from "assets/images/bruce-mars.jpg";

function Header({data}) {
  const [visible, setVisible] = useState(true);


  const handleSetVisible = () => setVisible(!visible);

  return (
    <Card id="profile">
      <SoftBox p={2}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRwpU-FXOHq9_mSCRq7L-pwnb4Eh8N83zS5nu63_a0KPJbeUcnNDJsaTpaEQQPnXWFiUI&usqp=CAU'}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {data?.firstName} {data?.lastName}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {data?.accountType}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

Header.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    accountType: PropTypes.string,
  }), // Описание структуры объекта `data`
};


export default Header;
