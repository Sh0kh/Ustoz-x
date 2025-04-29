import SoftBox from "components/SoftBox";
import BasicInfoCard from "./components/BasicInfoCard";
import PropTypes from "prop-types";
import Sidenav from "../Sidenav";
import ChangePassword from "../ChangePassword";
import Sessions from "./components/Sessions";
import DeleteAccount from "./components/DeleteAccount";


export default function BasicInfo({ data }) {
  return (
    <>
      <SoftBox display="flex" alignItems="flex-start" gap={'10px'}>
        <Sidenav />
        <SoftBox sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <BasicInfoCard data={data} />
          <ChangePassword />
          <Sessions />
          <DeleteAccount />
        </SoftBox>
      </SoftBox>
    </>
  )
}

BasicInfo.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string, // Add this line
    firstName: PropTypes.string,
    genderType: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    confirmationEmail: PropTypes.string,
    location: PropTypes.string,
    phoneNumber: PropTypes.string,
    language: PropTypes.string,
    dateBirth: PropTypes.string,
    userHashId: PropTypes.string, // Новое поле
    deviceId: PropTypes.string, // Новое поле
    myReferralNumber: PropTypes.string, // Новое поле
  }),
};