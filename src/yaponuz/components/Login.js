import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { AuthLogin } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import chat from "assets/images/illustrations/rocket-dark.png";

function Login() {
  const [login, setLogin] = useState({
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const loginResponse = await AuthLogin.login(login);
    // console.log(loginResponse);
    if (loginResponse.status) {
      // Redirect to dashboard on successful login
      navigate("/dashboards");
    } else {
      // Handle login error (you might want to show an error message to the user)
      console.error("Login failed");
    }
  };

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your Phone number and password"
      illustration={{
        image: chat,
        title: "Welcome to our Family",
        description: "Discover new opportunities with YAPON EDU.",
      }}
      color="dark"
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftInput
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            size="large"
            onChange={handleChange}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftInput
            type="password"
            placeholder="Password"
            name="password"
            size="large"
            onChange={handleChange}
          />
        </SoftBox>

        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="dark" size="large" onClick={handleLogin} fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </IllustrationLayout>
  );
}

export default Login;
