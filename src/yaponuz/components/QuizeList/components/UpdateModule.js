import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import { Quiz } from "yaponuz/data/api";
import PropTypes from "prop-types";
import { useEffect } from "react";

export default function UpdateModule({ data, isOpen, onClose, refresh, }) {

    const [name, setName] = useState()
    

    useEffect(() => {
        if (data) {
            setName(data?.name || '')
        }
    }, [data])


    // css variables
    const my = {
        margin: "5px 0px",
        width: '100%'
    };

    const EditModule = async () => {
        try {
            const editData = {
                name: name,
                creatorId: localStorage.getItem('userId'),
                lessonId: data?.lessonId,
                id:data?.id
            }
            const response = await Quiz.updateQuizModule(editData)
            Swal.fire("Module Edit", response.message, "success");
            onClose()
            refresh()
        } catch (error) {
            Swal.fire("error", response.message || response.error, "error");
        }
    }


 


    return (
        <>
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Edit Module</DialogTitle>
                <DialogContent>
                    <SoftInput
                        placeholder="Name"
                        value={name}
                        style={my}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={EditModule}>Edit Module</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

UpdateModule.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    lessonID: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};