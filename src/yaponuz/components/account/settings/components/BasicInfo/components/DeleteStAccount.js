import PropTypes from "prop-types";
import { Icon, Tooltip } from "@mui/material";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import { device } from "yaponuz/data/controllers/device";
import SoftButton from "components/SoftButton";
import { Users } from "yaponuz/data/api";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteStAccount() {
    const navigate = useNavigate();
    const { ID } = useParams();


    const deleteItem = async () => {
        try {
            const newSwal = Swal.mixin({
                customClass: {
                    confirmButton: "button button-success",
                    cancelButton: "button button-error",
                },
                buttonsStyling: false,
            });
            newSwal
                .fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const loadingSwal = Swal.fire({
                            title: "Deleting...",
                            text: "Please Wait!",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });
                        let id = ID
                        const response = await Users.deleteUser(id);
                        loadingSwal.close();
                        if (response.success) {
                            newSwal.fire("Deleted!", response.message, "success").then(() => {
                                navigate(-1);
                            });
                        } else {
                            newSwal.fire("Not Deleted!", response.message, "error").then(() => {

                            });
                        }
                    }
                });
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <SoftTypography
            variant="body1"
            onClick={deleteItem}
            color="secondary"
            sx={{ cursor: "pointer", lineHeight: 0 }}
        >
            <SoftButton variant="gradient" color="error" sx={{ height: "100%" }}>
                delete account
            </SoftButton>
        </SoftTypography>
    );
}

// Since we're now getting ID from useParams, we don't need these props anymore
// If you still need to keep the component backwards compatible, you can keep these
// and modify the code to use props.id if ID from useParams is not available
DeleteStAccount.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    refetch: PropTypes.func,
};