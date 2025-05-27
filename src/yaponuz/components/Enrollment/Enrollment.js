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
import { Loader, Frown } from "lucide-react";
import Swal from "sweetalert2";
import { Course } from "yaponuz/data/controllers/course";
import { enrollment } from "yaponuz/data/controllers/enrollment";
import AddEnrollment from "./components/AddEnrollment";

export default function Enrollment() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [groupOptions, setGroupOptions] = useState([]);
    const [noGroupSelected, setNoGroupSelected] = useState(true);

    // Получаем курсы для селекта
    const getAllGroups = async () => {
        try {
            const response = await Course.getAllCourses(0, 100);
            const groups = response.object || [];
            const formattedOptions = groups.map((group) => ({
                label: group.name,
                value: group.id,
            }));
            setGroupOptions(formattedOptions);
        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    // Получаем список студентов по курсу
    const getAllEnrollment = async () => {
        if (!courseId) return;

        setLoading(true);
        setNoGroupSelected(false);

        try {
            const data = { id: courseId, page: 0, size: 20 };
            const response = await enrollment.getEnrollment(data);
            setStudents(response.object?.content || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGroups();
    }, []);

    useEffect(() => {
        if (courseId) {
            getAllEnrollment();
        } else {
            setStudents([]);
            setNoGroupSelected(true);
        }
    }, [courseId]);

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
            Header: "Name",
            accessor: "student.firstName",
            Cell: ({ row }) => row.original.student.firstName,
        },
        {
            Header: "Last Name",
            accessor: "student.lastName",
            Cell: ({ row }) => row.original.student.lastName,
        },
        {
            Header: "Phone number",
            accessor: "student.phoneNumber",
            Cell: ({ row }) => row.original.student.phoneNumber,
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

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        p={3}
                    >
                        <SoftTypography variant="h5" fontWeight="medium">
                            Enrollment
                        </SoftTypography>
                        <SoftBox display="flex" alignItems="flex-start" gap="30px">
                            <SoftSelect
                                placeholder="Select course"
                                style={{ flex: 1, minWidth: "150px" }}
                                options={groupOptions}
                                onChange={(e) => {
                                    setCourseId(e.value);
                                    setNoGroupSelected(false);
                                }}
                            />
                            {courseId && <AddEnrollment refetch={getAllEnrollment} courseId={courseId} />}
                        </SoftBox>
                    </SoftBox>

                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Please select a course</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Loading, please wait</p>
                        </div>
                    ) : students.length !== 0 ? (
                        <DataTable
                            table={studentTableData}
                            entriesPerPage={{
                                defaultValue: 10,
                                entries: [5, 10, 15, 20],
                            }}
                            canSearch
                        />
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">No students found</p>
                                <p className="text-sm text-gray-700">
                                    Try selecting a different course
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
