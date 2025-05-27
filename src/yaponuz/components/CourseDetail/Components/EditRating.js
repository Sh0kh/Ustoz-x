import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Rating,
} from "@mui/material";
import { EditIcon } from "lucide-react";
import PropTypes from "prop-types";
import { Reting } from "yaponuz/data/controllers/rating";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function EditRating({ item, refresh }) {
    const { ID } = useParams()
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState(item.comment || "");
    const [rating, setRating] = useState(item.rating || 0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        try {
            const data = {
                id: item.id,
                courseId: ID,
                comment: comment || "", 
                rating,
            };

            const response = await Reting.updateRating(data);

            if (response.success) {
                await Swal.fire("Success", response.message || "Rating updated", "success");
                handleClose();
                refresh();
            } else {
                Swal.fire("Error", response.message || response.error || "Something went wrong", "error");
            }
        } catch (err) {
            console.error("Error updating rating:", err);
            Swal.fire("Error", "Unexpected error occurred", "error");
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleClickOpen}
            >
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Rating</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

EditRating.propTypes = {
    item: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
};
