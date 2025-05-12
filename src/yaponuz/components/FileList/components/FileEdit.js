import { Switch } from "@mui/material";
import SoftBox from "components/SoftBox";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FileController } from "../../../data/controllers/file";


export default function FileEdit({ id, refetch, type }) {

    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setEdit(type === 'ACTIVE' ? true : false)
    })

    const showAlert = (response) => {
        function reload() {
            refetch();
        }
        if (response.success) {
            Swal.fire("Added", response.message, "success").then(() => reload());
        } else {
            Swal.fire("Error", response.message || response.error, "error").then(() => reload());
        }
    };

    const handleSwitchChange = async (event) => {
        // Get boolean value from the event
        const newValue = event.target.checked;
        setEdit(newValue);

        const fileStatus = newValue ? "ACTIVE" : "DRAFT";  // Active when true, DRAFT when false

        try {
            const data = {
                id: id,
                fileType: fileStatus  // Send "ACTIVE" or "DRAFT"
            };
            const response = await FileController.EditFileType(data);
            showAlert(response); // Call showAlert with the response
        } catch (error) {
            console.log(error);
            Swal.fire("Error", "Failed to update file type", "error");
        }
    };

    return (
        <SoftBox>
            <Switch
                checked={edit}
                onChange={handleSwitchChange}
                name="fileTypeSwitch"
                inputProps={{ 'aria-label': 'file type switch' }}
            />
        </SoftBox>
    );
}

FileEdit.propTypes = {
    refetch: PropTypes.func,
    id: PropTypes.string,
    type:PropTypes.string
};
