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
import { Frown, Loader } from "lucide-react";
import { NavLink } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import SoftDatePicker from "components/SoftDatePicker";
import { testResult } from "yaponuz/data/controllers/testResult";
import Swal from "sweetalert2"; // Предполагается, что вы используете sweetalert2 для уведомлений

export default function Personality() {
    const [students, setStudents] = useState([]); // Состояние для хранения студентов
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [groupID, setGroupID] = useState(null); // ID выбранной группы
    const [GroupOptions, setGroupOptions] = useState([]); // Опции для выпадающего списка групп
    const [noGroupSelected, setNoGroupSelected] = useState(true); // Флаг для отслеживания выбора группы

    const getAllGroups = async () => {
        try {
            const response = await Group.getMyGroups(0, 100); // Получаем все группы
            const groups = response.object || [];

            const formattedOptions = groups.map((group) => ({
                label: group.name,
                value: group.id,
            }));

            setGroupOptions(formattedOptions);
        } catch (err) {
            console.error("Error from groups list GET: ", err);
        }
    };

    const getStudents = async () => {
        if (!groupID) return;

        setLoading(true);
        setNoGroupSelected(false);

        try {
            const response = await Users.getUsersAttendance(0, 100, "", "", "", groupID);
            setStudents(response.object?.content || []);

            const initialScores = response.object?.content.reduce((acc, student) => {
                acc[student.id] = student.Score || ""; // Устанавливаем начальное значение Score
                return acc;
            }, {});

            // Сбрасываем ошибки при загрузке новых данных
            setErrors({ title: '', scores: {} });
        } catch (err) {
            console.log("Error fetching students: ", err);
        } finally {
            setLoading(false);
        }
    };

    // Вызываем `getStudents` при изменении groupID
    useEffect(() => {
        if (groupID) {
            getStudents();
        } else {
            setStudents([]); // Очищаем список студентов, если группа не выбрана
        }
    }, [groupID]);

    useEffect(() => {
        getAllGroups(); // Загружаем список групп при монтировании компонента
    }, []);




    // Таблица для студентов
    const studentColumns = [
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name" },
        { Header: "Last Name", accessor: "lastName" },
        { Header: "Phone number", accessor: "phoneNumber" },

    ];

    const studentRows = students.map((student) => ({
        id: student.id,
        name: (
            <NavLink className={'text-blue-400'} to={`/student-personality/${student?.id}`}>
                {student.firstName}
            </NavLink>
        ),
        lastName: student.lastName,
        phoneNumber: student.phoneNumber,

    }));

    const studentTableData = {
        columns: studentColumns,
        rows: studentRows,
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                        <SoftTypography variant="h5" fontWeight="medium">
                            Student Personality
                        </SoftTypography>
                        <SoftSelect
                            placeholder='Select group'
                            style={{ flex: 1, minWidth: "150px" }}
                            options={GroupOptions}
                            onChange={(e) => {
                                setGroupID(e.value);
                                setNoGroupSelected(false); // Скрываем сообщение "Выберите группу"
                            }}
                        />
                    </SoftBox>

                    {/* Отображение состояния */}
                    {noGroupSelected ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <p className="uppercase font-semibold">Please select a group</p>
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
            <Footer />
        </DashboardLayout>
    );
}