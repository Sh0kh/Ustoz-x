import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftSelect from "components/SoftSelect";
import DataTable from "examples/Tables/DataTable";
import { Switch } from "@mui/material";
import { Loader, Frown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Swal from "sweetalert2";
import { Course } from "yaponuz/data/controllers/course";
import { enrollment } from "yaponuz/data/controllers/enrollment";
import AddEnrollment from "./components/AddEnrollment";
import SoftButton from "components/SoftButton";
import { Users } from "yaponuz/data/api";

export default function Enrollment() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courseId, setCourseId] = useState('');
    const [groupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const getAllGroups = async () => {
        try {
            const response = await Course.getAllCourses(0, 100);
            const groups = response.object || [];
            const formattedOptions = [
                { label: "All courses", value: " " },  // Add this line for "All" option
                ...groups.map((group) => ({
                    label: group.name,
                    value: group.id,
                })),
            ];
            setGroupOptions(formattedOptions);
        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    // Поиск пользователей по имени
    const searchUsers = async (firstName = '') => {
        if (!firstName.trim() && firstName !== '') return;

        setIsSearching(true);
        try {
            const response = await Users.getUsers('', '', firstName, '', '', '');
            const users = response.object?.content || response.object || [];
            const formattedUsers = users.map((user) => ({
                label: `${user.firstName} ${user.lastName} (${user.phoneNumber || 'No phone'})`,
                value: user.id,
            }));
            setUserOptions(formattedUsers);
        } catch (error) {
            console.error("Error searching users:", error);
            setUserOptions([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Дебаунс для поиска
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                searchUsers(searchTerm);
            } else {
                setUserOptions([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Загружаем пользователей при монтировании компонента (дефолтный запрос)
    useEffect(() => {
        searchUsers('');
    }, []);

    // Получаем список студентов по курсу и пользователю с пагинацией
    const getAllEnrollment = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        setNoGroupSelected(false);

        try {
            const data = {
                id: courseId,
                page: page,
                size: size,
                userId: selectedUserId || ''
            };
            console.log(selectedUserId);
            const response = await enrollment.getEnrollment(data);

            // Обновляем данные пагинации
            const responseData = response.object || {};
            setStudents(responseData.content || []);
            setTotalPages(responseData.totalPages || 0);
            setTotalElements(responseData.totalElements || 0);
            setCurrentPage(page);

        } catch (err) {
            console.error("Error fetching students:", err);
            setStudents([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGroups();
        getAllEnrollment();
    }, []);

    useEffect(() => {
        if (courseId) {
            setCurrentPage(0);
            getAllEnrollment(0, pageSize);
        } else {
            setStudents([]);
            setNoGroupSelected(true);
            setTotalPages(0);
            setTotalElements(0);
        }
    }, [courseId, selectedUserId]);

    // Обработчики пагинации
    const handlePageChange = (newPage) => {
        getAllEnrollment(newPage, pageSize);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
        getAllEnrollment(0, newSize);
    };

    // Обработчик изменения switch
    const handleSwitchChange = async (studentId, field, value) => {
        try {
            Swal.fire({
                title: "Updating...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            // Находим существующую запись студента, чтобы взять остальные поля
            const student = students.find((s) => s.id === studentId);
            if (!student) throw new Error("Student not found");

            // Формируем данные для обновления
            const data = {
                id: student.id,
                studentId: student.student.id,
                courseId: courseId,
                creatorId: localStorage.getItem("userId"),
                accessAllowed: field === "accessAllowed" ? value : student.accessAllowed,
                completed: field === "completed" ? value : student.completed,
            };

            await enrollment.updateEnrollment(data);

            // Обновляем локально список студентов для мгновенного обновления UI
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === studentId ? { ...s, [field]: value } : s
                )
            );

            Swal.close();
            Swal.fire({ icon: "success", title: "Updated successfully" });
        } catch (err) {
            Swal.close();
            Swal.fire({ icon: "error", title: "Update failed", text: err.message });
            console.error("Error updating enrollment:", err);
        }
    };

    // Обработчик фильтрации
    const handleFilter = () => {
        setCurrentPage(0);
        getAllEnrollment(0, pageSize);
    };

    // Компоненты переключателей с PropTypes для отключения ESLint ошибок
    const CompletedSwitch = ({ row }) => (
        <Switch
            checked={row.original.completed}
            onChange={(e) =>
                handleSwitchChange(row.original.id, "completed", e.target.checked)
            }
        />
    );
    CompletedSwitch.propTypes = {
        row: PropTypes.shape({
            original: PropTypes.shape({
                completed: PropTypes.bool.isRequired,
                id: PropTypes.number.isRequired,
            }).isRequired,
        }).isRequired,
    };

    const AccessAllowedSwitch = ({ row }) => (
        <Switch
            checked={row.original.accessAllowed}
            onChange={(e) =>
                handleSwitchChange(row.original.id, "accessAllowed", e.target.checked)
            }
        />
    );
    AccessAllowedSwitch.propTypes = {
        row: PropTypes.shape({
            original: PropTypes.shape({
                accessAllowed: PropTypes.bool.isRequired,
                id: PropTypes.number.isRequired,
            }).isRequired,
        }).isRequired,
    };

    // Колонки таблицы
    const studentColumns = [
        { Header: "ID", accessor: "id" },
        {
            Header: "Full Name",
            accessor: "student.fullName",
            Cell: ({ row }) => {
                const { firstName, lastName } = row.original.student;
                return `${firstName} ${lastName}`;
            },
        },
        {
            Header: "Phone number",
            accessor: "student.phoneNumber",
            Cell: ({ row }) => row.original.student.phoneNumber,
        },
        {
            Header: "Course",
            Cell: ({ row }) => row.original.course?.name,
        },
        {
            Header: "Completed",
            accessor: "completed",
            Cell: CompletedSwitch,
        },
        {
            Header: "Access Allowed",
            accessor: "accessAllowed",
            Cell: AccessAllowedSwitch,
        },
    ];


    const studentTableData = {
        columns: studentColumns,
        rows: students,
    };

    // Компонент пагинации
    const PaginationComponent = () => {
        const startIndex = currentPage * pageSize + 1;
        const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

        return (
            <SoftBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                borderTop="1px solid #e0e0e0"
            >
                <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftTypography variant="body2" color="text">
                        Showing {totalElements > 0 ? startIndex : 0} to {endIndex} of {totalElements} entries
                    </SoftTypography>
                </SoftBox>

                <SoftBox display="flex" alignItems="center" gap="5px">
                    {/* First Page */}
                    <SoftButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        disabled={currentPage === 0}
                        onClick={() => handlePageChange(0)}
                        style={{ minWidth: "40px", padding: "8px" }}
                    >
                        <ChevronsLeft size={16} />
                    </SoftButton>

                    {/* Previous Page */}
                    <SoftButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        disabled={currentPage === 0}
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ minWidth: "40px", padding: "8px" }}
                    >
                        <ChevronLeft size={16} />
                    </SoftButton>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i;
                        } else if (currentPage < 3) {
                            pageNum = i;
                        } else if (currentPage > totalPages - 4) {
                            pageNum = totalPages - 5 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <SoftButton
                                key={pageNum}
                                variant={currentPage === pageNum ? "gradient" : "outlined"}
                                color="dark"
                                size="small"
                                onClick={() => handlePageChange(pageNum)}
                                style={{ minWidth: "40px", padding: "8px" }}
                            >
                                {pageNum + 1}
                            </SoftButton>
                        );
                    })}

                    {/* Next Page */}
                    <SoftButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ minWidth: "40px", padding: "8px" }}
                    >
                        <ChevronRight size={16} />
                    </SoftButton>

                    {/* Last Page */}
                    <SoftButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => handlePageChange(totalPages - 1)}
                        style={{ minWidth: "40px", padding: "8px" }}
                    >
                        <ChevronsRight size={16} />
                    </SoftButton>
                </SoftBox>

                <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftTypography variant="body2" color="text">
                        Rows per page:
                    </SoftTypography>
                    <SoftSelect
                        value={{ label: pageSize.toString(), value: pageSize }}
                        options={[
                            { label: "5", value: 5 },
                            { label: "10", value: 10 },
                            { label: "15", value: 15 },
                            { label: "20", value: 20 },
                            { label: "50", value: 50 }
                        ]}
                        onChange={(option) => handlePageSizeChange(option.value)}
                        style={{ minWidth: "80px" }}
                    />
                </SoftBox>
            </SoftBox>
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox className={'Enrollment'} my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox p={3}>
                        <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                        >
                            <SoftTypography variant="h5" fontWeight="medium">
                                Enrollment ({totalElements} total)
                            </SoftTypography>
                            <SoftBox display="flex" alignItems="flex-start" gap="30px">
                                {courseId && <AddEnrollment refetch={() => getAllEnrollment(currentPage, pageSize)} courseId={courseId} />}
                            </SoftBox>
                        </SoftBox>
                        <SoftBox
                            display="flex"
                            alignItems="flex-end"
                            gap="10px"
                        >
                            <SoftSelect
                                className="mt-[10px] w-[400px]"
                                placeholder="Select course"
                                style={{ flex: 1, minWidth: "350px" }}
                                options={groupOptions}
                                onChange={(e) => {
                                    if (e === null) {
                                        setCourseId('');
                                        setNoGroupSelected(true);
                                    } else {
                                        setCourseId(e.value);  // This will be empty string for "All" option
                                        setNoGroupSelected(false);
                                    }
                                }}
                            />

                            <SoftSelect
                                className="mt-[10px] w-[400px]"
                                placeholder="Search and select student"
                                style={{ flex: 1, minWidth: "350px" }}
                                options={userOptions}
                                isSearchable={true}
                                isLoading={isSearching}
                                onInputChange={(inputValue) => {
                                    setSearchTerm(inputValue);
                                }}
                                onChange={(e) => {
                                    // Устанавливаем пустую строку если ничего не выбрано
                                    setSelectedUserId(e ? e.value : '');
                                }}
                                isClearable={true}
                                noOptionsMessage={() =>
                                    searchTerm ? "No students found" : "Start typing to search students"
                                }
                            />
                            <SoftButton color={'dark'} onClick={handleFilter}>
                                Filter
                            </SoftButton>
                        </SoftBox>
                    </SoftBox>

                    {loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Loading, please wait</p>
                        </div>
                    ) : students.length !== 0 ? (
                        <>
                            <DataTable
                                table={studentTableData}
                                entriesPerPage={{
                                    defaultValue: 20,
                                    entries: [5, 10, 15, 20],
                                }} />
                            <PaginationComponent />
                        </>
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">No students found</p>
                                <p className="text-sm text-gray-700">
                                    Try selecting a different course or student
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}