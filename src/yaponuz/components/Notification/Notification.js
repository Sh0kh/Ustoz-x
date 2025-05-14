import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Frown, Loader } from "lucide-react";
import { NavLink } from "react-router-dom";
import SoftSelect from "components/SoftSelect";
import { Users } from "yaponuz/data/api";
import AddNotification from "./components/AddNotifications";
import IdCell from "layouts/ecommerce/orders/order-list/components/IdCell";
import Checkbox from "@mui/material/Checkbox";

export default function LessonReport() {
  const [students, setStudents] = useState([]); // Состояние для хранения студентов
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [groupID, setGroupID] = useState(null); // ID выбранной группы
  const [GroupOptions, setGroupOptions] = useState([]); // Опции для выпадающего списка групп
  const [noGroupSelected, setNoGroupSelected] = useState(true); // Флаг для отслеживания выбора группы
  const [selectedStudents, setSelectedStudents] = useState([]); // Состояние для хранения выбранных студентов
  const [showAddNotification, setShowAddNotification] = useState(false); // Показывать ли AddNotification

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

      // Сбрасываем выбранных студентов при загрузке новой группы
      setSelectedStudents([]);
      setShowAddNotification(false);

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
      setSelectedStudents([]); // Сбрасываем выбранных студентов
      setShowAddNotification(false); // Скрываем компонент AddNotification
    }
  }, [groupID]);

  useEffect(() => {
    getAllGroups(); // Загружаем список групп при монтировании компонента
  }, []);

  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        // Если студент уже выбран, удаляем его из массива
        const newSelected = prevSelected.filter((id) => id !== studentId);
        if (newSelected.length === 0) {
          setShowAddNotification(false); // Скрываем компонент если ни один студент не выбран
        }
        return newSelected;
      } else {
        // Если студент не выбран, добавляем его в массив
        const newSelected = [...prevSelected, studentId];
        setShowAddNotification(true); // Показываем компонент AddNotification
        return newSelected;
      }
    });
  };

  // Обработчик для выбора всех студентов
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allStudentIds = students.map(student => student.id);
      setSelectedStudents(allStudentIds);
      setShowAddNotification(students.length > 0);
    } else {
      setSelectedStudents([]);
      setShowAddNotification(false);
    }
  };

  // Таблица для студентов
  const studentColumns = [
    {
      Header: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={students.length > 0 && selectedStudents.length === students.length}
          indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
        />
      ),
      accessor: 'select',
      width: '56px'
    },
    { Header: "ID", accessor: 'id' },
    { Header: "Name", accessor: "name" },
    { Header: "Last Name", accessor: "lastName" },
    { Header: "Phone number", accessor: "phoneNumber" },
  ];

  const studentRows = students.map((student) => ({
    select: (
      <Checkbox
        checked={selectedStudents.includes(student.id)}
        onChange={() => handleCheckboxChange(student.id)}
      />
    ),
    id: student.id,
    name: (
      <NavLink className={'text-blue-400'} to={`/notificatin/stundet/${student?.id}`}>
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

  // Передаем только массив ID выбранных студентов в AddNotification
  const selectedStudentIds = selectedStudents; // Уже содержит только ID: [10, 20, ...]

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftTypography variant="h5" fontWeight="medium">
              Notification
            </SoftTypography>
            <SoftBox display="flex" gap='10px' alignItems="flex-start">
              <SoftSelect
                placeholder='Select group'
                style={{ flex: 1, minWidth: "150px" }}
                options={GroupOptions}
                onChange={(e) => {
                  setGroupID(e.value);
                  setNoGroupSelected(false); // Скрываем сообщение "Выберите группу"
                }}
              />
              {showAddNotification && (
                <AddNotification selectedStudents={selectedStudentIds} />
              )}
            </SoftBox>
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