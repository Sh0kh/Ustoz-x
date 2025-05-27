import { Button } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Reting } from "yaponuz/data/controllers/rating";

export default function RatingDelete({ id, refresh }) {


    const deleteItem = async (id) => {
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
                        const response = await Reting.deleteReferral(id);
                        loadingSwal.close();

                        if (response.success) {
                            newSwal.fire("Deleted!", response.message, "success").then(() => {
                                refresh();
                            });
                        } else {
                            newSwal.fire("Not Deleted!", response.message, "error").then(() => {
                                refresh();
                            });
                        }
                    }
                });
        } catch (error) {
            console.error(error.message);
        }
    };


    return (
        <>
            <Button
                variant="outlined"
                color="error"
                onClick={() => deleteItem(id)}
                startIcon={<DeleteIcon />}
            >
                Delete
            </Button>
        </>
    )
}

RatingDelete.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    refresh: PropTypes.func.isRequired,
};
