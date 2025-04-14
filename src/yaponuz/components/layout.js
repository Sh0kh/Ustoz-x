import SoftBox from "components/SoftBox";

const { default: DashboardLayout } = require("examples/LayoutContainers/DashboardLayout");

const AuthLayout = ({ children }) => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}></SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default AuthLayout;
