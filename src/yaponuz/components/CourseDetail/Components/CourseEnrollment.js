import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import SoftBadge from "components/SoftBadge";
import { Group } from "yaponuz/data/controllers/group";
import PropTypes from "prop-types";
import { Frown, Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";
import { testResult } from "yaponuz/data/controllers/testResult";
import Swal from "sweetalert2";
import { Course } from "yaponuz/data/controllers/course";
import { size } from "lodash";
import { enrollment } from "yaponuz/data/controllers/enrollment";
import { Switch } from "@mui/material";
import AddEnrollment from "yaponuz/components/Enrollment/components/AddEnrollment";

export default function CourseEnrollment() {
    const { ID } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noGroupSelected, setNoGroupSelected] = useState(true);
    const [errors, setErrors] = useState({ title: "", scores: {} });

    const getAllEnrollment = async () => {
        setLoading(true);
        setNoGroupSelected(false);
        try {
            const data = {
                id: ID,
                page: 0,
                size: 20,
            };
            const response = await enrollment.getEnrollment(data);
            setStudents(response.object?.content || []);
            setErrors({ title: "", scores: {} });
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ID) {
            getAllEnrollment();
        }
    }, [ID]);

    const handleSwitchChange = async (studentId, field, value) => {
        try {
            Swal.fire({
                title: "Updating...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const student = students.find((s) => s.id === studentId);
            if (!student) throw new Error("Student not found");

            const data = {
                id: student.id,
                studentId: student.student.id,
                courseId: ID,
                creatorId: localStorage.getItem("userId"),
                accessAllowed: field === "accessAllowed" ? value : student.accessAllowed,
                completed: field === "completed" ? value : student.completed,
            };

            await enrollment.updateEnrollment(data);

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
        <SoftBox my={3}>
            <Card style={{ margin: "10px 0px" }}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                    <SoftTypography variant="h5" fontWeight="medium">
                        Enrollment
                    </SoftTypography>
                    <AddEnrollment refetch={getAllEnrollment} courseId={ID}/>
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
                            <p className="text-sm text-gray-700">Try selecting a different group</p>
                        </div>
                    </div>
                )}
            </Card>
        </SoftBox>
    );
}
