import { Dialog } from "@mui/material";
import PropTypes from 'prop-types';
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { Attendance } from "yaponuz/data/controllers/attendance"; // Import Attendance controller
import React, { useEffect } from "react";
import Swal from "sweetalert2";


export default function AttendanceModal({ 
    isOpen, 
    onClose, 
    studentId, 
    selectedDate, 
    attendanceData, 
    lessonID, 
    onAttendanceUpdate // Новый проп для обновления UI
}) {
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
        // Сначала обновляем UI оптимистично
        const newAttendanceData = {
            id: attendanceData?.id || Date.now(), // Временный id если создаем новую запись
            status: attendanceStatus,
            timeOfLate: Number(timeOfLate) || 0,
            comment: comment,
            day: selectedDate,
            studentId: studentId,
            lessonId: lessonID
        };

        // Обновляем UI немедленно
        onAttendanceUpdate(studentId, selectedDate, newAttendanceData, 'save');
        
        // Закрываем модал и очищаем поля
        onClose();
        setComment('');
        setTimeOfLate('');
        setAttendanceStatus('');

        // Показываем анимацию успеха
        Swal.fire({
            title: "Saving...",
            text: "Attendance is being saved",
            icon: "info",
            timer: 1000,
            showConfirmButton: false
        });

        // Используем выбранную дату и добавляем к ней текущее время
        const dateWithTime = getDateWithUzbekistanTime(selectedDate);

        const data = [{
            status: attendanceStatus,
            timeOfLate: Number(timeOfLate) || 0,
            comment: comment,
            startTime: dateWithTime,
            day: selectedDate,
            studentId: studentId,
            lessonId: lessonID,
            creatorId: Number(localStorage.getItem("userId"))
        }];

        try {
            const response = await Attendance.createAttendance(data);
            
            // Показываем успех
            Swal.fire({
                title: "Success!",
                text: "Attendance saved successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            // Если ошибка, откатываем изменения
            onAttendanceUpdate(studentId, selectedDate, attendanceData, 'revert');
            
            Swal.fire("Error", error.message || "An error occurred", "error");
        }
    };

    const handleDelete = async () => {
        if (!attendanceData?.id) return;

        // Сначала обновляем UI оптимистично
        onAttendanceUpdate(studentId, selectedDate, null, 'delete');
        
        // Закрываем модал
        onClose();

        // Показываем анимацию удаления
        Swal.fire({
            title: "Deleting...",
            text: "Attendance is being deleted",
            icon: "info",
            timer: 1000,
            showConfirmButton: false
        });

        try {
            const response = await Attendance.deleteAttendance(attendanceData?.id);
            
            // Показываем успех
            Swal.fire({
                title: "Deleted!",
                text: "Attendance deleted successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            // Если ошибка, откатываем изменения
            onAttendanceUpdate(studentId, selectedDate, attendanceData, 'revert');
            
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
                        onChange={(selectedOption) => setAttendanceStatus(selectedOption.value)}
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
                    {attendanceStatus === 'LATE_CAME' && (
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
                    )}
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
    lessonID: PropTypes.number.isRequired,
    studentId: PropTypes.string.isRequired,
    selectedDate: PropTypes.string.isRequired,
    attendanceData: PropTypes.object,
    onAttendanceUpdate: PropTypes.func.isRequired, // Новый проп
};