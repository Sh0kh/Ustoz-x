import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import AttendanceModal from '../AttendanceModal';

export default function AttendanceTable({ data, month, year, refresh }) {
    const [AtModal, setAtModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState({ status: '' });

    useEffect(() => {
        if (!data || data.length === 0) {
            console.log('No attendance data available.');
        }
    }, [data]);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No attendance data available.</p>;
    }

    const daysInMonth = dayjs(`${year}-${month}-1`).daysInMonth();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDayClick = (day, studentId) => {
        const student = data.find((student) => student.user.id === studentId); // Get student data by ID
        const date = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
        setSelectedDate(date);
        setStudentId(studentId);

        // Find the attendance for the selected day
        const attendanceForDay = student.attendance.find(
            (attendance) => dayjs(attendance.day).date() === day
        );

        // Set modal to open
        setAtModal(true);

        // If attendance exists, pass the ID and status, otherwise pass a default object
        if (attendanceForDay) {
            setSelectedAttendance(attendanceForDay);
        } else {
            setSelectedAttendance({ status: '', id: null }); // Pass null ID if no attendance
        }
    };




    const getAttendanceStatus = (student, day) => {
        const attendanceForDay = student.attendance.find(
            (attendance) => dayjs(attendance.day).date() === day
        );
        return attendanceForDay ? attendanceForDay.status : ''; // Return status or empty string if no attendance
    };
    const getStatusIcon = (status) => {
        const statusIcons = {
            CAME: (
                <svg className="w-[20px] h-[20px] text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12V3m0 0L9 6m3-3l3 3M6 12h12M6 12l3 3m9-3l-3 3" />
                </svg>
            ),
            EXCUSED: (
                <svg className="w-8 h-8 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m4-4v8" />
                </svg>
            ),
            LATE_CAME: (
                <svg className="w-8 h-8 text-orange-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0" />
                </svg>
            ),
            NOT_CAME: (
                <svg className="w-8 h-8 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        };
        return statusIcons[status] || null;
    };

    // const getStatusLabel = (status) => {
    //     const statusLabels = {
    //         CAME: 'Came',
    //         EXCUSED: 'Excused',
    //         LATE_CAME: 'Late Came',
    //         NOT_CAME: 'Not Came',
    //     };
    //     return statusLabels[status] || ''; // Return label or empty string
    // };

    const getStatusBgColor = (status) => {
        const statusColors = {
            CAME: 'bg-green-500',
            EXCUSED: 'bg-yellow-500',
            LATE_CAME: 'bg-orange-500',
            NOT_CAME: 'bg-red-500',
        };
        return statusColors[status] || ''; // Default background color if status doesn't match
    };

    return (<>
        <div className="p-4 pl-[10px] bg-white shadow-lg rounded-lg mb-[20px] overflow-x-auto flex items-center justify-between gap-[10px]">
            <div className='w-full cursor-pointer bg-green-500 p-[5px] text-[white] text-[15px] rounded-[10px] flex items-center justify-center'>
                <span>
                    Came
                </span>
            </div>
            <div className='w-full cursor-pointer bg-yellow-500 p-[5px] text-[white] text-[15px] rounded-[10px] flex items-center justify-center'>
                <span>
                    Excused
                </span>
            </div>
            <div className='w-full cursor-pointer bg-orange-500 p-[5px] text-[white] text-[15px] rounded-[10px] flex items-center justify-center'>
                <span>
                    Late came
                </span>
            </div>
            <div className='w-full cursor-pointer bg-red-500 p-[5px] text-[white] text-[15px] rounded-[10px] flex items-center justify-center'>
                <span>
                    Not came
                </span>
            </div>
        </div>
        <div className="p-4 pl-[0px] bg-white shadow-lg rounded-lg mb-[50px] overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky left-0 bg-white border-b-[1px] pl-[19px] border-[#c3c3c3a0] text-left font-semibold text-black p-4">
                            <span className="text-[20px]">Name</span>
                        </th>
                        <th className="bg-white border-b-[1px] border-[#c3c3c3a0] text-black">
                            <span className="text-[15px] w-[80px] block">Came day</span>
                        </th>
                        <th className="bg-white border-b-[1px] border-[#c3c3c3a0] font-semibold text-black p-4">
                            <span className="text-[15px] w-[80px] block">Not came day</span>
                        </th>
                        <th className="bg-white border-b-[1px] border-[#c3c3c3a0] font-semibold text-black p-4">
                            <span className="text-[15px] w-[80px] block">Excused day</span>
                        </th>
                        <th className="bg-white border-b-[1px] border-[#c3c3c3a0] font-semibold text-black p-4">
                            <span className="text-[15px] w-[80px] block">Late came time</span>
                        </th>
                        {daysArray.map((day) => (
                            <th
                                key={day}
                                className="p-[5px] text-center border-b-[1px] border-[#c3c3c3a0] font-mono font-semibold text-black"
                            >
                                {day.toString().padStart(2, '0')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((student, index) => {
                        const cameDays = daysArray.filter(
                            (day) => getAttendanceStatus(student, day) === 'CAME'
                        ).length;
                        const lateDays = daysArray.filter(
                            (day) => getAttendanceStatus(student, day) === 'LATE_CAME'
                        ).length;
                        const absentDays = daysArray.filter(
                            (day) => getAttendanceStatus(student, day) === 'EXCUSED'
                        ).length;
                        const notCame = daysArray.filter(
                            (day) => getAttendanceStatus(student, day) === 'NOT_CAME'
                        ).length;
                        const totalLateTime = student.attendance
                            .filter((record) => record.status === 'LATE_CAME')
                            .reduce((sum, record) => sum + record.timeOfLate, 0);
                        return (
                            <tr key={index}>
                                <td className="sticky left-0 bg-white p-4 text-left text-black max-w-[200px] truncate">
                                    <span className="text-[20px] opacity-[0.7] mr-[4px]">
                                        {index + 1}.
                                    </span>
                                    <span className="text-[18px] opacity-[0.7]">
                                        {student.user.firstName}
                                    </span>
                                </td>
                                <td className="cursor-pointer px-[5px] py-2 text-center font-mono text-black max-w-[200px] truncate">
                                    {cameDays}
                                </td>
                                <td className="cursor-pointer px-[5px] py-2 text-center font-mono text-black max-w-[200px] truncate">
                                    {notCame}
                                </td>
                                <td className="cursor-pointer px-[5px] py-2 text-center font-mono text-black max-w-[200px] truncate">
                                    {absentDays}
                                </td>
                                <td className="cursor-pointer px-[5px] py-2 text-center font-mono text-black max-w-[200px] truncate">
                                    {totalLateTime}
                                </td>
                                {daysArray.map((day) => (
                                    <td
                                        key={day}
                                        className="cursor-pointer px-[5px] py-2 text-center font-mono text-black max-w-[200px] truncate"
                                    >
                                        <div
                                            onClick={() => handleDayClick(day, student.user.id)}
                                            className={`border-[1px] rounded-[5px] border-[black] w-[50px] h-[40px] hover:bg-[#4d4c4c] transition-colors duration-200 flex flex-col items-center justify-center p-[5px] ${getStatusBgColor(getAttendanceStatus(student, day))}`}
                                        >
                                            {getStatusIcon(getAttendanceStatus(student, day))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <AttendanceModal
                refresh={refresh}
                isOpen={AtModal}
                onClose={() => setAtModal(false)}
                selectedDate={selectedDate}
                studentId={studentId}
                attendanceData={selectedAttendance}
            />
        </div>

    </>
    );
}

AttendanceTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.shape({
                firstName: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired, // Ensure student has an ID
            }).isRequired,
            attendance: PropTypes.arrayOf(
                PropTypes.shape({
                    day: PropTypes.string.isRequired,
                    status: PropTypes.string, // Attendance status like 'EXCUSED', etc.
                })
            ), // Attendance records for each student
        })
    ).isRequired,
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    refresh: PropTypes.func, // Add this line for the 'refresh' prop

};
