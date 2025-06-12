import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import AttendanceModal from '../AttendanceModal';

export default function AttendanceTable({ data, month, year, lessonID }) {
    const [AtModal, setAtModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState({ status: '' });
    const [localData, setLocalData] = useState(data); // Локальное состояние для UI
    const [updatingCells, setUpdatingCells] = useState(new Set()); // Отслеживание обновляющихся ячеек

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    useEffect(() => {
        if (!localData || localData.length === 0) {
            console.log('No attendance data available.');
        }
    }, [localData]);

    if (!localData || localData.length === 0) {
        return <p className="text-center text-gray-500">No attendance data available.</p>;
    }

    const daysInMonth = dayjs(`${year}-${month}-1`).daysInMonth();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Функция для обновления UI без запроса на сервер
    const handleAttendanceUpdate = (studentId, date, newAttendanceData, action) => {
        const cellKey = `${studentId}-${date}`;

        // Добавляем анимацию обновления
        setUpdatingCells(prev => new Set([...prev, cellKey]));

        // Убираем анимацию через 2 секунды
        setTimeout(() => {
            setUpdatingCells(prev => {
                const newSet = new Set(prev);
                newSet.delete(cellKey);
                return newSet;
            });
        }, 2000);

        setLocalData(prevData => {
            return prevData.map(student => {
                if (student.user.id === studentId) {
                    const updatedAttendance = [...student.attendance];
                    const existingIndex = updatedAttendance.findIndex(
                        att => dayjs(att.day).format('YYYY-MM-DD') === date
                    );

                    if (action === 'delete') {
                        // Удаляем запись посещаемости
                        if (existingIndex !== -1) {
                            updatedAttendance.splice(existingIndex, 1);
                        }
                    } else if (action === 'save') {
                        // Добавляем или обновляем запись посещаемости
                        if (existingIndex !== -1) {
                            updatedAttendance[existingIndex] = {
                                ...updatedAttendance[existingIndex],
                                ...newAttendanceData
                            };
                        } else {
                            updatedAttendance.push(newAttendanceData);
                        }
                    } else if (action === 'revert') {
                        // Откатываем изменения (возвращаем исходные данные)
                        return data.find(s => s.user.id === studentId) || student;
                    }

                    return {
                        ...student,
                        attendance: updatedAttendance
                    };
                }
                return student;
            });
        });
    };

    const handleDayClick = (day, studentId) => {
        const student = localData.find((student) => student.user.id === studentId);
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
            setSelectedAttendance({ status: '', id: null });
        }
    };

    const getAttendanceStatus = (student, day) => {
        const attendanceForDay = student.attendance.find(
            (attendance) => dayjs(attendance.day).date() === day
        );
        return attendanceForDay ? attendanceForDay.status : '';
    };

    const getStatusIcon = (status) => {
        const statusIcons = {
            CAME: (
                <svg className="w-5 h-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            EXCUSED: (
                <svg className="w-5 h-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m4-4v8" />
                </svg>
            ),
            LATE_CAME: (
                <svg className="w-5 h-5 text-orange-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0" />
                </svg>
            ),
            NOT_CAME: (
                <svg className="w-5 h-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        };
        return statusIcons[status] || null;
    };

    const getStatusBgColor = (status) => {
        const statusColors = {
            CAME: 'bg-green-100 border-green-300',
            EXCUSED: 'bg-yellow-100 border-yellow-300',
            LATE_CAME: 'bg-orange-100 border-orange-300',
            NOT_CAME: 'bg-red-100 border-red-300',
        };
        return statusColors[status] || '';
    };

    const getLegendColor = (status) => {
        const statusColors = {
            CAME: 'from-green-400 to-green-500',
            EXCUSED: 'from-yellow-400 to-yellow-500',
            LATE_CAME: 'from-orange-400 to-orange-500',
            NOT_CAME: 'from-red-400 to-red-500',
        };
        return statusColors[status] || '';
    };

    const getStatusTextColor = (status) => {
        const statusColors = {
            CAME: 'text-green-800',
            EXCUSED: 'text-yellow-800',
            LATE_CAME: 'text-orange-800',
            NOT_CAME: 'text-red-800',
        };
        return statusColors[status] || '';
    };

    return (
        <>
            {/* Status Legend with SoftBox Design */}
            <div className="p-5 bg-white shadow-lg rounded-lg mb-6 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Davomat statusi belgisi</h3>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {[
                        { status: 'CAME', label: 'Keldi' },
                        { status: 'NOT_CAME', label: 'Kelmagan' },
                        { status: 'EXCUSED', label: 'Sababli' },
                        { status: 'LATE_CAME', label: 'Kechikib keldi' },
                    ].map((item) => (
                        <div key={item.status} className="flex-1 min-w-[120px]">
                            <div className={`cursor-pointer rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
                                <div className={`bg-gradient-to-r ${getLegendColor(item.status)} p-1`}></div>
                                <div className="p-3 bg-white flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusBgColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                        </div>
                                        <span className={`ml-2 font-medium ${getStatusTextColor(item.status)}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Attendance Table */}
            <div className="p-4 pl-0 bg-white shadow-lg rounded-lg mb-12 overflow-x-auto overflow-y-auto h-[600px] relative">
                <table className="w-full h-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 top-[-16px] z-50 bg-white border-b border-gray-200 text-left font-semibold text-gray-700 p-4">
                                <span className="text-lg">Ism</span>
                            </th>
                            <th className="bg-white  sticky top-[-16px] border-b border-gray-200 text-gray-700 p-3">
                                <span className="text-sm   flex py-[10px] w-[40px] rounded-[50%] items-center justify-center bg-[#DCFCE7] from-green-400 to-green-500 text-green-800">
                                    <svg className="w-5 h-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                            </th>
                            <th className="bg-white sticky top-[-16px] border-b border-gray-200 text-gray-700 p-3">
                                <span className="text-sm flex py-[10px] w-[40px] rounded-[50%] items-center justify-center bg-[#FEE2E2] ">
                                    <svg className="w-5 h-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                            </th>
                            <th className="bg-white sticky top-[-16px] border-b border-gray-200 text-gray-700 p-3">
                                <span className="text-sm flex py-[10px] w-[40px] rounded-[50%] items-center justify-center bg-[#FEF9C3] ">
                                    <svg className="w-5 h-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m4-4v8" />
                                    </svg>
                                </span>
                            </th>
                            <th className="bg-white sticky top-[-16px] border-b border-gray-200 text-gray-700 p-3">
                                <span className="text-sm flex py-[10px] w-[40px] rounded-[50%] items-center justify-center bg-[#FFEDD5] ">
                                    <svg className="w-5 h-5 text-orange-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0" />
                                    </svg>
                                </span>
                            </th>
                            {daysArray.map((day) => (
                                <th
                                    key={day}
                                    className="p-2 text-center sticky top-[-16px] z-40 bg-white border-b border-gray-200 font-mono font-medium text-gray-600"
                                >
                                    {day.toString().padStart(2, '0')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {localData.map((student, index) => {
                            const cameDays = daysArray.filter(
                                (day) => getAttendanceStatus(student, day) === 'CAME' ||
                                    getAttendanceStatus(student, day) === 'LATE_CAME'
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
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="sticky z-30 left-0 bg-white p-4 text-left text-gray-800 max-w-[250px] truncate">
                                        <span className="text-lg text-gray-500 mr-2">
                                            {index + 1}.
                                        </span>
                                        <span className="text-base font-medium">
                                            {student.user.lastName} {' '} {student.user.firstName}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center font-mono text-gray-700">
                                        <div className="flex justify-center">
                                            <div className="bg-green-100 text-green-800 w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all duration-300">
                                                {cameDays}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center font-mono text-gray-700">
                                        <div className="flex justify-center">
                                            <div className="bg-red-100 text-red-800 w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all duration-300">
                                                {notCame}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center font-mono text-gray-700">
                                        <div className="flex justify-center">
                                            <div className="bg-yellow-100 text-yellow-800 w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all duration-300">
                                                {absentDays}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center font-mono text-gray-700">
                                        <div className="flex justify-center">
                                            <div className="bg-orange-100 text-orange-800 w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all duration-300">
                                                {totalLateTime}
                                            </div>
                                        </div>
                                    </td>
                                    {daysArray.map((day) => {
                                        const status = getAttendanceStatus(student, day);
                                        const cellKey = `${student.user.id}-${dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')}`;
                                        const isUpdating = updatingCells.has(cellKey);

                                        return (
                                            <td
                                                key={day}
                                                className="p-2 text-center"
                                            >
                                                <div
                                                    onClick={() => handleDayClick(day, student.user.id)}
                                                    className={`
                                                        cursor-pointer 
                                                        rounded-lg 
                                                        w-12 h-12 
                                                        flex items-center justify-center 
                                                        transition-all duration-500
                                                        hover:shadow-md 
                                                        transform hover:scale-105
                                                        ${status ? `${getStatusBgColor(status)} shadow-sm` : 'border border-gray-300'}
                                                        ${isUpdating ? 'animate-pulse bg-blue-100 border-blue-300 scale-110' : ''}
                                                    `}
                                                >
                                                    {isUpdating ? (
                                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        getStatusIcon(status)
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <AttendanceModal
                    isOpen={AtModal}
                    onClose={() => setAtModal(false)}
                    selectedDate={selectedDate}
                    studentId={studentId}
                    attendanceData={selectedAttendance}
                    lessonID={lessonID}
                    onAttendanceUpdate={handleAttendanceUpdate}
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
                id: PropTypes.string.isRequired,
            }).isRequired,
            attendance: PropTypes.arrayOf(
                PropTypes.shape({
                    day: PropTypes.string.isRequired,
                    status: PropTypes.string,
                    timeOfLate: PropTypes.number,
                })
            ),
        })
    ).isRequired,
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    lessonID: PropTypes.number.isRequired,
};