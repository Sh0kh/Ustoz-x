import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import SoftBadge from "components/SoftBadge";
import { useEffect, useState } from "react";
import { Group } from "yaponuz/data/controllers/group";
import { Users } from "yaponuz/data/api";
import { Lesson } from "yaponuz/data/controllers/lesson";
import { Module } from "yaponuz/data/api";
import { lessonReport } from "yaponuz/data/controllers/lessonReport";
import { Frown, Loader, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, IconButton, Tooltip, Box as MuiBox } from "@mui/material";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";

// История - матрица
function getHistoryMatrixTable(historyResults) {
  const dateSet = new Set();
  const studentMap = {};

  historyResults.forEach(item => {
    dateSet.add(item.reportDate);
    const sid = item.studentId;
    if (!studentMap[sid]) {
      studentMap[sid] = {
        fullName: (item.student?.firstName || "") + " " + (item.student?.lastName || ""),
        records: {},
      };
    }
    studentMap[sid].records[item.reportDate] = item.scores || item.score || [];
  });

  const dates = Array.from(dateSet).sort();
  const columns = [
    {
      Header: <span style={{ fontSize: 13 }}>O‘quvchi</span>,
      accessor: "fullName",
      sticky: true,
      width: 170,
    },
    ...dates.map(date => ({
      Header: <span style={{ fontSize: 13 }}>{date}</span>,
      accessor: date,
      align: "center",
      width: 170,
    })),
  ];

  const rows = Object.entries(studentMap).map(([sid, st]) => {
    const row = { fullName: st.fullName.trim() ? st.fullName : `ID:${sid}` };
    dates.forEach(date => {
      const scores = st.records[date] || [];
      row[date] = (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
          {scores.length > 0
            ? scores.map((s, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SoftBadge
                  color="info"
                  variant="gradient"
                  size="sm"
                  sx={{ minWidth: 70, mr: 1, fontSize: 11, px: 0.7, py: 0.2 }}
                >
                  {s.description}
                </SoftBadge>
                <Typography variant="body2" fontWeight="medium" sx={{ color: "#1976d2", fontSize: 13 }}>
                  {s.score}
                </Typography>
              </Box>
            ))
            : <Box sx={{ color: "#bdbdbd", fontSize: 13 }}>—</Box>
          }
        </Box>
      );
    });
    return row;
  });

  return { columns, rows };
}

export default function LessonReport() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupID, setGroupID] = useState(null);
  const [GroupOptions, setGroupOptions] = useState([]);
  const [noGroupSelected, setNoGroupSelected] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonID, setLessonID] = useState(null);

  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportDate, setReportDate] = useState(null);

  // DEFAULT PARAMETERS
  const defaultParams = [
    { key: "attendance", label: "Darsda qatnashish uchun" },
    { key: "homework", label: "Uyga vazifa bajargani uchun" },
    { key: "activity", label: "Faollik uchun" }
  ];
  const [gradingParams, setGradingParams] = useState([...defaultParams]);
  const [addParamModal, setAddParamModal] = useState(false);
  const [newParamTitle, setNewParamTitle] = useState("");

  const [scores, setScores] = useState({});
  const [historyResults, setHistoryResults] = useState([]);

  // Группы
  const getAllGroups = async (page, size) => {
    try {
      const response = await Group.getMyGroups(page, size);
      const groups = response.object || [];
      const formattedOptions = groups?.map((group) => ({
        label: group.name,
        value: group.id,
        courseId: group.courseId,
      }));
      setGroupOptions(formattedOptions);
    } catch (err) {
      console.error("Error from groups list GET: ", err);
    }
  };

  // Студенты
  const getStudents = async () => {
    if (!groupID) return;
    setLoading(true);
    setNoGroupSelected(false);
    try {
      const response = await Users.getUsersAttendance(0, 100, "", "", "", groupID);
      setStudents(response.object?.content || []);
    } catch (err) {
      console.log("Error fetching students: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Модули
  const getModules = async () => {
    try {
      const response = await Module.getModuleById(selectedCourse);
      const formattedModules = response.object?.map((module) => ({
        value: module.id,
        label: module.name || module.title,
      })) || [];
      setModules(formattedModules);
    } catch (err) {
      console.error("Error from module list GET: ", err);
    }
  };

  // Уроки модуля
  const getModuleLessons = async (moduleId) => {
    try {
      const response = await Lesson.getAllLessons(page, size, moduleId.value);
      const formattedLessons = (response.object?.content || []).map((lesson) => ({
        value: lesson.id,
        label: lesson.name || lesson.title,
      }));
      setLessons(formattedLessons);
      setLessonID(moduleId);
    } catch (err) {
      console.error("Error from lesson list GET:", err);
    }
  };

  useEffect(() => {
    getAllGroups(page, size);
  }, [page, size, groupID]);

  useEffect(() => {
    if (groupID) {
      getStudents();
    } else {
      setStudents([]);
    }
  }, [groupID]);

  useEffect(() => {
    if (selectedCourse) {
      getModules(selectedCourse);
      setSelectedModule(null);
      setSelectedLesson(null);
      setModules([]);
      setLessons([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedModule) {
      getModuleLessons(selectedModule);
      setSelectedLesson(null);
      setLessons([]);
    }
  }, [selectedModule]);

  // Ввод баллов
  const studentColumns = [
    { Header: <span style={{ fontSize: 13 }}>Ism</span>, accessor: "Ism" },
    ...gradingParams.map(param => ({
      Header: (
        <MuiBox display="flex" alignItems="center" gap={1}>
          <span style={{ fontSize: 13 }}>{param.label}</span>
        </MuiBox>
      ),
      accessor: param.key,
    })),
    {
      Header: (
        <Tooltip title="Qo'shimcha parametr qo'shish">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setAddParamModal(true)}
            style={{ marginLeft: 4 }}
          >
            <Plus size={18} />
          </IconButton>
        </Tooltip>
      ),
      accessor: "__add",
      disableSortBy: true,
      Cell: () => null
    }
  ];

  const handleScoreChange = (studentId, field, value) => {
    if (value > 10) value = 10;
    if (value < 0) value = 0;
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const studentRows = students.map((student) => {
    const row = {
      Ism: (
        <NavLink className={'text-blue-400'} to={`/student-lesson-report/${groupID}/${student?.id}`}>
          <span style={{ fontSize: 13 }}>{student.firstName} {student.lastName}</span>
        </NavLink>
      ),
    };
    gradingParams.forEach(param => {
      row[param.key] = (
        <SoftInput
          type="number"
          min={0}
          max={10}
          value={scores[student.id]?.[param.key] ?? ""}
          onChange={e => handleScoreChange(student.id, param.key, Number(e.target.value))}
          style={{
            width: 120,
            textAlign: "center",
            fontSize: 15,
            paddingLeft: 16,
            paddingRight: 16,
          }}
          inputProps={{ max: 10, min: 0, style: { fontSize: 15 } }}
          placeholder={param.label}
        />
      );
    });
    // Для последней пустой колонки с кнопкой не нужно ничего
    return row;
  });

  const studentTableData = {
    columns: studentColumns,
    rows: studentRows,
  };

  const historyMatrixTable = getHistoryMatrixTable(historyResults);

  // Поиск истории по дате
  const handleSearchHistory = async () => {
    try {
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const data = {
        groupId: groupID,
        startDate: startDate ? formatDate(startDate) : "",
        endDate: endDate ? formatDate(endDate) : "",
      };
      const response = await lessonReport.getLessonReportByDate(data);
      setHistoryResults(response.object?.content || []);
    } catch (error) {
      console.error("Tarixni qidirishda xatolik:", error);
      Swal.fire({
        icon: 'error',
        title: 'Xatolik',
        text: 'Tarixni olishda xatolik yuz berdi.',
      });
    }
  };

  // Добавление отчёта
  const CreateLessonReport = async () => {
    try {
      const reportArray = students.map(student => {
        // Собираем все параметры для этого студента
        const studentScores = gradingParams
          .map(param => {
            const v = scores[student.id]?.[param.key];
            return (v !== undefined && v !== null && v !== "") ? {
              description: param.label,
              score: Number(v)
            } : null;
          })
          .filter(Boolean);

        if (studentScores.length === 0) return null;

        return {
          groupId: groupID,
          id: 0,
          lessonId: selectedLesson?.value || 0,
          reportDate:
            reportDate && reportDate[0]
              ? (() => {
                const d = new Date(reportDate[0]);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              })()
              : "",
          scores: studentScores,
          studentId: student.id,
        };
      }).filter(Boolean);

      if (reportArray.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Diqqat!',
          text: 'Hech bir o‘quvchiga baho kiritilmadi.',
        });
        return;
      }

      const response = await lessonReport.createLessonReport(reportArray);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Baholar saqlandi!',
          text: 'Barcha baholar muvaffaqiyatli saqlandi.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Xatolik',
          text: response.message || 'Baholarni saqlashda xatolik yuz berdi.',
        });
      }
    } catch (error) {
      console.error("Error creating lesson report: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Xatolik',
        text: 'Hisobot yaratishda xatolik yuz berdi. Iltimos, qayта urinib ko‘ring.',
      });
    }
  };

  const handleAddParam = () => {
    const trimmed = newParamTitle.trim();
    if (!trimmed) {
      Swal.fire({ icon: "warning", title: "Nomini kiriting", text: "Parametr nomi bo'sh bo'lishi mumkin emas." });
      return;
    }
    // Ключ для нового параметра (латиницей, без пробелов)
    const key = trimmed.toLowerCase().replace(/[^a-z0-9]/gi, "_") + "_" + (gradingParams.length + 1);
    setGradingParams([...gradingParams, { key, label: trimmed }]);
    setNewParamTitle("");
    setAddParamModal(false);
  };

  // Обработка sticky для первой колонки (имена учеников)
  const dataTableSx = {
    "& th, & td": {
      fontSize: "13px",
      padding: "6px 18px",
      minWidth: 120,
      whiteSpace: "nowrap",
    },
    "& th[data-sticky='true'], & td[data-sticky='true']": {
      position: "sticky",
      left: 0,
      background: "#f5f7fa",
      zIndex: 2,
      minWidth: 170,
      maxWidth: 240,
      whiteSpace: "nowrap",
    },
    "& td[data-sticky='true']": {
      background: "#fff",
      zIndex: 1,
    },
  };

  const customCellProps = col =>
    col.sticky
      ? { "data-sticky": "true", style: { left: 0, zIndex: 2, background: "#fff", minWidth: 170, maxWidth: 240 } }
      : { style: { minWidth: 120, maxWidth: 350 } };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px", overflow: "visible" }}>
          <SoftBox p={3} style={{ overflow: "visible", width: "100%" }}>
            <SoftBox
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              mb={2}
            >
              <SoftBox flex="1" minWidth="200px">
                <SoftSelect
                  fullWidth
                  options={[
                    { label: "Tarixni ko‘rish", value: "view-history" },
                    { label: "Baholash", value: "grading" },
                  ]}
                  value={[
                    { label: "Tarixni ko‘rish", value: "view-history" },
                    { label: "Baholash", value: "grading" },
                  ].find(opt => opt.value === selectedAction) || null}
                  onChange={e => {
                    setSelectedAction(e.value);
                    setGroupID(null);
                    setSelectedCourse(null);
                    setSelectedModule(null);
                    setSelectedLesson(null);
                  }}
                  placeholder="Amalni tanlang"
                />
              </SoftBox>
              {selectedAction && (
                <SoftBox flex="1" minWidth="200px">
                  <SoftSelect
                    fullWidth
                    options={GroupOptions}
                    value={GroupOptions.find(opt => opt.value === groupID) || null}
                    onChange={e => {
                      setGroupID(e.value);
                      setSelectedCourse(e.courseId);
                    }}
                    placeholder="Guruhni tanlang"
                    isDisabled={!selectedAction}
                  />
                </SoftBox>
              )}
            </SoftBox>

            {selectedAction === "view-history" && (
              <SoftBox display="flex" gap={2} mt={2} mb={2}>
                <SoftBox flex="1" minWidth="200px">
                  <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                    Boshlanish sanasi
                  </SoftTypography>
                  <SoftDatePicker
                    placeholder="Boshlanish sanasi"
                    value={startDate}
                    fullWidth
                    onChange={setStartDate}
                  />
                </SoftBox>
                <SoftBox flex="1" minWidth="200px">
                  <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                    Tugash sanasi
                  </SoftTypography>
                  <SoftDatePicker
                    placeholder="Tugash sanasi"
                    value={endDate}
                    fullWidth
                    onChange={setEndDate}
                  />
                </SoftBox>
              </SoftBox>
            )}

            <SoftBox
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              mb={2}
            >
              {selectedAction === "grading" && groupID && (
                <>
                  <SoftBox flex="1" minWidth="200px" mb={2}>
                    <SoftSelect
                      fullWidth
                      placeholder="Modulni tanlang"
                      options={modules}
                      value={selectedModule}
                      onChange={value => setSelectedModule(value)}
                      isDisabled={!groupID}
                    />
                  </SoftBox>
                </>
              )}
              {selectedModule && (
                <SoftBox flex="1" minWidth="200px">
                  <SoftSelect
                    fullWidth
                    placeholder="Darsni tanlang"
                    options={lessons}
                    value={selectedLesson}
                    onChange={(value) => setSelectedLesson(value)}
                    isDisabled={!selectedModule}
                  />
                </SoftBox>
              )}
            </SoftBox>
            {selectedAction === "grading" && groupID && (
              <>
                <SoftBox flex="1" minWidth="200px" mb={2}>
                  <SoftDatePicker
                    placeholder="Hisobot sanasi"
                    value={reportDate}
                    fullWidth
                    onChange={setReportDate}
                  />
                </SoftBox>
              </>
            )}

            <SoftBox display="flex" justifyContent="flex-start" minWidth="200px">
              {selectedAction === "grading" ? (
                <SoftButton fullWidth onClick={CreateLessonReport} sx={{ height: "40px" }}>
                  Baholash
                </SoftButton>
              ) : selectedAction === "view-history" ? (
                <SoftButton fullWidth onClick={handleSearchHistory} sx={{ height: "40px" }}>
                  Qidirish
                </SoftButton>
              ) : null}
            </SoftBox>
          </SoftBox>
        </Card>
        <Card style={{ margin: "10px 0px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftTypography variant="h5" fontWeight="medium">
              Dars hisobotlari
            </SoftTypography>
          </SoftBox>
          {noGroupSelected ? (
            <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
              <p className="uppercase font-semibold">Iltimos, amaldi tanlang</p>
            </div>
          ) : loading ? (
            <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
              <Loader className="animate-spin ml-2 size-10" />
              <p className="text-sm uppercase font-medium">Yuklanmoqda, iltimos kuting</p>
            </div>
          ) : selectedAction === "view-history" && historyResults.length > 0 ? (
            <Box
              sx={{
                overflowX: "auto",   // SCROLL BAR ПО Х!!
                width: "100%",
                maxHeight: 550,
                borderRadius: 2,
              }}
            >
              <DataTable
                table={historyMatrixTable}
                entriesPerPage={{
                  defaultValue: 20,
                  entries: [5, 10, 15, 20],
                }}
                canSearch
                sx={dataTableSx}
                customCellProps={customCellProps}
              />
            </Box>
          ) : students.length !== 0 && selectedAction === "grading" ? (
            <>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <DataTable
                  table={studentTableData}
                  entriesPerPage={{
                    defaultValue: 20,
                    entries: [5, 10, 15, 20],
                  }}
                  canSearch
                  sx={dataTableSx}
                  customCellProps={customCellProps}
                />
              </Box>
              {/* Модальное окно для добавления параметра */}
              {addParamModal && (
                <div style={{
                  position: "fixed",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.2)",
                  zIndex: 2000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "32px 24px",
                    minWidth: 320,
                    minHeight: 120,
                    boxShadow: "0 2px 20px #aaa",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18
                  }}>
                    <SoftTypography variant="h6" fontWeight="bold">
                      Yangi baholash parametri qo‘shish
                    </SoftTypography>
                    <SoftInput
                      placeholder="Parametr nomi (masalan: 'Test natijasi')"
                      value={newParamTitle}
                      onChange={e => setNewParamTitle(e.target.value)}
                      style={{ fontSize: 16, minWidth: 250, width: 300, maxWidth: 400 }}
                    />
                    <Box display="flex" gap={2} mt={2}>
                      <SoftButton color="info" onClick={handleAddParam}>Qo‘shish</SoftButton>
                      <SoftButton color="dark" onClick={() => setAddParamModal(false)}>Bekor qilish</SoftButton>
                    </Box>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
              <Frown className="size-20" />
              <div className="text-center">
                <p className="uppercase font-semibold">O‘quvchilar topilmadi</p>
                <p className="text-sm text-gray-700">Boshqa guruhni tanlab ko‘ring</p>
              </div>
            </div>
          )}
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}