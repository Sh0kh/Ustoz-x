import { Dialog } from "@mui/material";
import PropTypes from 'prop-types';
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { Attendance } from "yaponuz/data/controllers/attendance"; // Import Attendance controller
import React, { useEffect } from "react";
import Swal from "sweetalert2";


export default function AttendanceModal({ isOpen, onClose, studentId, selectedDate, refresh, attendanceData }) {
    const [attendanceStatus, setAttendanceStatus] = React.useState("");
    const [timeOfLate, setTimeOfLate] = React.useState("");
    const [comment, setComment] = React.useState("");


    useEffect(() => {
        if (attendanceData) {
            setAttendanceStatus(attendanceData?.status || '')
            setTimeOfLate(attendanceData?.timeOfLate || '')
            setComment(attendanceData?.comment || '')
        }
    }, [attendanceData])

    // Функция для получения даты в формате ISO с временем Узбекистана
    const getDateWithUzbekistanTime = (dateString) => {
        // Получаем текущее время
        const now = new Date();

        // Создаем дату из переданной строки даты
        const date = new Date(dateString);

        // Устанавливаем часы, минуты, секунды и миллисекунды из текущего времени
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        date.setMilliseconds(now.getMilliseconds());

        // Преобразуем в ISO строку
        return date.toISOString();
    };

    const handleSave = async () => {
        // Используем выбранную дату и добавляем к ней текущее время
        const dateWithTime = getDateWithUzbekistanTime(selectedDate);

        const data = [{
            status: attendanceStatus,
            timeOfLate: Number(timeOfLate) || 0,
            comment: comment,
            startTime: dateWithTime, // Используем дату с текущим временем
            day: selectedDate,
            studentId: studentId,
            creatorId: Number(localStorage.getItem("userId"))
        }];

        try {
            const response = await Attendance.createAttendance(data);
            onClose();
            refresh()
            setComment('')
            setTimeOfLate('')
            setAttendanceStatus('')
            Swal.fire("Attendance saved", response.message, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "An error occurred", "error");
        }
    };

    const handleDelete = async () => {
        if (!attendanceData?.id) return; // Ensure attendanceId is available

        try {
            const response = await Attendance.deleteAttendance(attendanceData?.id);
            onClose(); // Close the modal after deleting
            refresh();
            Swal.fire("Attendance deleted", response.message, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "An error occurred", "error");
        }
    };



    return (
        <Dialog open={isOpen} onClose={onClose}>
            <div className="p-[20px] w-[500px] bg-white rounded-lg shadow-lg">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-700">
                        Attendance
                    </h1>
                </div>
                <div className="mt-[20px]">

                    <SoftSelect
                        value={attendanceStatus.value}
                        onChange={(selectedOption) => setAttendanceStatus(selectedOption.value)}  // Fixing value assignment
                        placeholder="Select attendance"
                        options={[
                            { value: 'CAME', label: 'Came' },
                            { value: 'EXCUSED', label: 'Excused' },
                            { value: 'LATE_CAME', label: 'Late Came' },
                            { value: 'NOT_CAME', label: 'Not Came' },
                        ]}
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                position: "absolute",
                                zIndex: 9999,
                                backgroundColor: "#f9fafb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }),
                            container: (provided) => ({
                                ...provided,
                                position: "relative",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "#f9fafb",
                            }),
                            control: (provided) => ({
                                ...provided,
                                borderRadius: "8px",
                                padding: "8px 12px",
                                borderColor: "#d1d5db",
                                boxShadow: "none",
                                '&:hover': {
                                    borderColor: "#a0aec0",
                                }
                            })
                        }}
                    />
                    <SoftInput
                        value={timeOfLate}
                        onChange={(e) => setTimeOfLate(e.target.value)}
                        placeholder="Time of late"
                        type="number"
                        style={{
                            marginTop: "16px",
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            borderColor: "#d1d5db",
                            boxSizing: "border-box",
                        }}
                    />
                    <SoftInput
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comment"
                        style={{
                            marginTop: "16px",
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            borderColor: "#d1d5db",
                            boxSizing: "border-box",
                        }}
                    />

                    <DialogActions>
                        {attendanceData?.id !== null && (
                            <Button onClick={handleDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md">
                                Delete attendance
                            </Button>
                        )}
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                            Save
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
}

AttendanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    studentId: PropTypes.string.isRequired, // Prop validation for studentId
    selectedDate: PropTypes.string.isRequired, // Prop validation for selectedDate
    refresh: PropTypes.func, // Add this line for the 'refresh' prop
    attendanceData: PropTypes.array,
};