import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Импорт PropTypes

// @mui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftTagInput from "components/SoftTagInput";
import Swal from "sweetalert2";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// Data
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import SoftButton from "components/SoftButton";
import { Users } from "yaponuz/data/api";

function BasicInfoCard({ data }) {

    // Состояния для каждого поля ввода
    const [stID, setStID] = useState(data?.id)
    const [firstName, setFirstName] = useState(data.firstName || "");
    const [lastName, setLastName] = useState(data.lastName || "");
    const [genderType, setGender] = useState(data.genderType || "");
    const [dateOfBirth, setDateOfBirth] = useState(data.dateBirth || "");
    const [email, setEmail] = useState(data.email || "Empty@gmail.com");
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");

    // Добавление новых состояний
    const [userHashId, setUserHashId] = useState(data.userHashId || "");
    const [deviceId, setDeviceId] = useState(data.deviceId || "");
    const [myReferralNumber, setMyReferralNumber] = useState(data.myReferralNumber || "");

    // Состояние для пароля
    const [password, setPassword] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            firstName,
            lastName,
            genderType: genderType.value,
            creatorId: localStorage.getItem("userId"),
            email,
            id: stID,
            password, // Добавляем пароль в данные
        };
        try {
            const response = await Users.updateUser(data);
            showAlert(response);
        } catch (error) {
            showAlert(error);
        }
    };

    const showAlert = (response) => {
        if (response.success) {
            Swal.fire("Updated!", response.message, "success");
        } else {
            Swal.fire("Not Updated!", response.message || response.error, "error");
        }
    };

    return (
        <Card id="basic-info" sx={{ overflow: "visible", }}>
            <SoftBox p={3}>
                <SoftTypography variant="h5">Basic Info</SoftTypography>
            </SoftBox>
            <SoftBox component="form" pb={3} px={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} // обновляем состояние
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} // обновляем состояние
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <FormField
                                        label="Gender"
                                        value={genderType}
                                        onChange={(e) => setGender(e.target.value)} // обновляем состояние
                                        fullWidth
                                    />
                                </SoftBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <FormField
                                        label="Date of Birth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)} // обновляем состояние
                                        fullWidth
                                    />
                                </SoftBox>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // обновляем состояние
                            inputProps={{ type: "email" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} // обновляем состояние
                            inputProps={{ type: "tel" }} // изменяем тип поля на 'tel'
                        />
                    </Grid>

                    {/* Добавление новых полей для отображения */}
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Referral Number"
                            value={myReferralNumber}
                            disabled // Отключаем поле, если оно только для отображения
                        />
                    </Grid>

                </Grid>
                <SoftButton
                    onClick={handleSave}
                    type="submit"  // Ensures the form is submitted
                    style={{ width: '100%', marginTop: '30px' }}
                    className="bg-blue-500 border-[2px] text-white hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Edit
                </SoftButton>
            </SoftBox>
        </Card>
    );
}

BasicInfoCard.propTypes = {
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

export default BasicInfoCard;
