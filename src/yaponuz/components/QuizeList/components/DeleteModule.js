import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";


// Soft UI Dashboard PRO React components
import SoftTypography from "components/SoftTypography";
import { Quiz } from "yaponuz/data/api";

// Стили для модала
const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogPaper-root': {
        borderRadius: '12px',
        padding: '50px ', // Increased padding
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[10],
        animation: 'fadeIn 0.3s ease-out', // анимация появления
    },
}));

const CustomButton = styled(Button)(({ theme, buttonType }) => ({
    borderRadius: '8px',
    padding: '12px 24px', // Increased padding for buttons
    transition: 'all 0.3s',
    backgroundColor: buttonType === 'cancel' ? theme.palette.success.main : theme.palette.error.main, // "Cancel" is green and "Delete" is red
    color: '#fff', // White text for both buttons
    '&:hover': {
        backgroundColor: buttonType === 'cancel' ? theme.palette.success.dark : theme.palette.error.dark, // Darken on hover
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[400],
    },
}));

function DeleteModule({ isOpen, onClose, data, refetch }) {
    const [isLoading, setIsLoading] = useState(false);

    const deleteItem = async () => {
        setIsLoading(true);
        try {
            const response = await Quiz.deleteQuizModule(data.id);
            setIsLoading(false);

            if (response.success) {
                refetch();
                onClose(); // Закрываем модал после успешного удаления
                Swal.fire("Module delete", response.message, "success");
            } else {

            }
        } catch (error) {
            setIsLoading(false);
            Swal.fire("error", response.message || response.error, "error");
        }
    };

    return (
        <CustomDialog open={isOpen} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                <SoftTypography variant="h5" color="error">
                    Confirm Deletion
                </SoftTypography>
            </DialogTitle>
            <DialogContent>
                <SoftTypography variant="body2" align="center" color="textSecondary">
                    Are you sure you want to delete this item?
                </SoftTypography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <CustomButton buttonType="delete" onClick={deleteItem} color="error" disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete"}
                </CustomButton>
                <CustomButton buttonType="cancel" onClick={onClose} color="primary" variant="outlined" disabled={isLoading}>
                    Cancel
                </CustomButton>
            </DialogActions>
        </CustomDialog>
    );
}

DeleteModule.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
};

export default DeleteModule;
