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
import Swal from 'sweetalert2';


function Login() {
  const [login, setLogin] = useState({
    phoneNumber: "+998",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (/^\+998\d*$/.test(value)) {
        if (value.length <= 13) {
          setLogin({ ...login, [name]: value });
        }
      } else if (value === "") {
        setLogin({ ...login, [name]: "+998" });
      }
    } else {
      setLogin({ ...login, [name]: value });
    }
  };

  const handleLogin = async () => {
    const loginResponse = await AuthLogin.login(login);
    if (loginResponse.status) {
      if (loginResponse?.object?.accountType === "TEACHER") {
        navigate("/teacher/group");
      } else {
        navigate("/dashboards");
      }

    } else {
      Swal.fire({
        title: 'Xatolik!',
        text: 'Login yoki parol xato!',
        icon: 'error',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        toast: true,
        showConfirmButton: false,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <IllustrationLayout
      title="Kirish"
      description="Telefon raqamingiz va parolingizni kiriting"
      illustration={{
        image: chat,
        title: "Ustoz-xga xush kelibsiz",
        description: "Ustoz-x bilan yangi imkoniyatlarni kashf eting.",
      }}
      color="dark"
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftInput
            type="text"
            placeholder="Telefon Raqam"
            name="phoneNumber"
            size="large"
            value={login.phoneNumber}
            onChange={handleChange}
          />
        </SoftBox>
        <SoftBox mb={2} position="relative">
          <SoftInput
            type={showPassword ? "text" : "password"}
            placeholder="Parol"
            name="password"
            size="large"
            value={login.password}
            onChange={handleChange}
          />
          <SoftBox
            position="absolute"
            top="25%"
            right="10px"
            transform="translateY(-30%)"
            cursor="pointer"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <SoftTypography variant="button" color="secondary">
                <svg className="text-[25px] cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"></path></svg>
              </SoftTypography>
            ) : (
              <SoftTypography variant="button" color="secondary">
                <svg className="text-[25px] cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
              </SoftTypography>
            )}
          </SoftBox>
        </SoftBox>

        <SoftBox mt={4} mb={1}>
          <SoftButton
            variant="gradient"
            color="dark"
            size="large"
            onClick={handleLogin}
            fullWidth
          >
            Kirish
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </IllustrationLayout>
  );
}

export default Login;