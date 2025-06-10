import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // PropTypes import qilinmoqda

// @mui core komponentlari
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React komponentlari
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftTagInput from "components/SoftTagInput";
import Swal from "sweetalert2";

// Sozlamalar sahifasi komponentlari
import FormField from "layouts/pages/account/components/FormField";

// Ma'lumotlar
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import SoftButton from "components/SoftButton";
import { Users } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";

function BasicInfoCard({ data }) {

    // Har bir kiritish maydoni uchun holatlar
    const [stID, setStID] = useState(data?.id)
    const [firstName, setFirstName] = useState(data.firstName || "");
    const [lastName, setLastName] = useState(data.lastName || "");
    const [genderType, setGender] = useState(data.genderType || "");
    const [dateOfBirth, setDateOfBirth] = useState(data.dateBirth || "");
    const [email, setEmail] = useState(data.email || "Empty@gmail.com");
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");

    // Yangi holatlar qo'shilmoqda
    const [userHashId, setUserHashId] = useState(data.userHashId || "");
    const [deviceId, setDeviceId] = useState(data.deviceId || "");
    const [myReferralNumber, setMyReferralNumber] = useState(data.myReferralNumber || "");

    // Parol uchun holat
    const [password, setPassword] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            firstName,
            lastName,
            phoneNumber,
            genderType: genderType.value,
            creatorId: localStorage.getItem("userId"),
            email,
            id: stID,
            password, // Ma'lumotlarga parol qo‘shilmoqda
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
            Swal.fire("Yangilandi!", response.message, "success");
        } else {
            Swal.fire("Yangilanmadi!", response.message || response.error, "error");
        }
    };

    return (
        <Card id="basic-info" sx={{ overflow: "visible", }}>
            <SoftBox p={3}>
                <SoftTypography variant="h5">Asosiy Ma`lumotlar</SoftTypography>
            </SoftBox>
            <SoftBox component="form" pb={3} px={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Ism"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} // holatni yangilaymiz
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Familiya"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} // holatni yangilaymiz
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Grid display="flex" justifyContent="space-between" alignItems="flex-start" container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <FormField
                                        label="Jinsi"
                                        value={genderType}
                                        onChange={(e) => setGender(e.target.value)} // holatni yangilaymiz
                                        fullWidth
                                    />
                                </SoftBox>
                            </Grid>
                            <Grid item xs={12}>
                                <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                    Tug‘ilgan sana
                                </SoftTypography>
                                <SoftDatePicker
                                    placeholder="Tug‘ilgan sana"
                                    value={dateOfBirth}
                                    fullWidth
                                    onChange={(newDate) => setDateOfBirth(newDate)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // holatni yangilaymiz
                            inputProps={{ type: "email" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Telefon raqam"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} // holatni yangilaymiz
                            inputProps={{ type: "tel" }} // input turi 'tel' ga o'zgartirildi
                        />
                    </Grid>
                </Grid>
                <SoftButton
                    onClick={handleSave}
                    type="submit"  // Formani yuborish uchun
                    style={{ width: '100%', marginTop: '30px' }}
                    className="bg-blue-500 border-[2px] text-white hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Tahrirlash
                </SoftButton>
            </SoftBox>
        </Card>
    );
}

BasicInfoCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string, // Qo‘shilgan qator
        firstName: PropTypes.string,
        genderType: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        confirmationEmail: PropTypes.string,
        location: PropTypes.string,
        phoneNumber: PropTypes.string,
        language: PropTypes.string,
        dateBirth: PropTypes.string,
        userHashId: PropTypes.string, // Yangi maydon
        deviceId: PropTypes.string, // Yangi maydon
        myReferralNumber: PropTypes.string, // Yangi maydon
    }),
};

export default BasicInfoCard;
