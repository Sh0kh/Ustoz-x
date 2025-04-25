import PropTypes from "prop-types";
import { Icon, Tooltip } from "@mui/material";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import { report } from "yaponuz/data/api";
import { personality } from "yaponuz/data/controllers/personality";
import { lessonReport } from "yaponuz/data/controllers/lessonReport";

export default function DeleteLessonReport({ id, refetch }) {
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
                        const response = await lessonReport.deleteLessonReport(id);
                        loadingSwal.close();

                        if (response.success) {
                            newSwal.fire("Deleted!", response.message, "success").then(() => {
                                refetch();
                            });
                        } else {
                            newSwal.fire("Not Deleted!", response.message, "error").then(() => {
                                refetch();
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
            onClick={() => deleteItem(id)}
            color="secondary"
            sx={{ cursor: "pointer", lineHeight: 0 }}
        >
            <Tooltip title="Delete" placement="top">
                <Icon>delete</Icon>
            </Tooltip>
        </SoftTypography>
    );
}

DeleteLessonReport.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    refetch: PropTypes.func.isRequired,
};
