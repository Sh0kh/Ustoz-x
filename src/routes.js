// Soft UI Dashboard PRO React layouts
import Default from "layouts/dashboards/smart-home";
import UsersList from "yaponuz/components/Users/UsersList";
import ChatList from "yaponuz/components/Chats/Chat";
import VersionList from "yaponuz/components/VersionList/VersionList";

// Soft UI Dashboard PRO React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import SettingsIcon from "examples/Icons/Settings";
import Basket from "examples/Icons/Basket";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";

// import components
import SMSList from "yaponuz/components/SMS/SMSList";
import GroupList from "yaponuz/components/GroupList/GroupList";
import ModuleList from "yaponuz/components/ModuleList/ModuleList";
import CourseList from "yaponuz/components/CourseList/CourseList";
import Notification from "yaponuz/components/Notification/Notification";
import Referral from "yaponuz/components/Referral/Referral";
import LessonList from "yaponuz/components/LessonList/LessonList";
import FileList from "yaponuz/components/FileList/FileList";
import QuizeList from "yaponuz/components/QuizeList/QuizeList";
import QuizeAdd from "yaponuz/components/QuizeList/components/AddQuizs";
import QuizeUpdate from "yaponuz/components/QuizeList/components/UpdateQuiz";
import AttendanceList from "yaponuz/components/AttendanceList/AttendanceList";
import EduTheme from "yaponuz/components/EduTheme/EduTheme";
import TeacherPage from "yaponuz/components/UserTeacher/TeacherPage";
import UsersSupportCenter from "yaponuz/components/UserSupportCenter/UsersSupportCenter";
import Profile from 'yaponuz/components/account/settings/index'
import UsersAdmins from "yaponuz/components/UsersAdmins/UsersAdmins";
import QuizeInfo from "yaponuz/components/QuizeList/QuizeInfo";
import QuestionCreate from "yaponuz/components/QuizeList/components/QuestionCreate";
import Assembly from "yaponuz/components/assembly/Assembly";
import TeacherGroup from "yaponuz/components/TeacherGroup";
import StudentByGroup from "yaponuz/components/StundetByGroup";
import TestResult from "yaponuz/components/TestResult";
import StudentResult from "yaponuz/components/TestResult/StudentResult";
import Report from "yaponuz/components/Report";
import StudentReport from "yaponuz/components/Report/StundetReport";
import Personality from "yaponuz/components/Personality/Index";
import StudentPersonality from "yaponuz/components/Personality/StudentPersonality";
import LessonReport from "yaponuz/components/LessonReport";
import StudentLessonReport from "yaponuz/components/LessonReport/StudentLessonReport";
import ChatInfo from "yaponuz/components/Chats/ChatInfo";
import StundetNotification from "yaponuz/components/Notification/StundetNotification";
import CourseDetail from "yaponuz/components/CourseDetail/CourseDetail";
import Enrollment from "yaponuz/components/Enrollment/Enrollment";
import TestResultAdd from "yaponuz/components/TestResult/component/TestResultAdd";
import CreateLessonReport from "yaponuz/components/LessonReport/commponent/CreateLessonReport";
import ReportCreate from "yaponuz/components/Report/commponent/ReportCreate";
import PersonalityCreate from "yaponuz/components/Personality/commponent/PersonalityCreate";

const routes = [
  { type: "title", title: "Umumiy", key: "general-title" },
  {
    type: "collapse",
    name: "Bosh sahifa",
    key: "dashboards",
    icon: <Shop size="12px" />,
    noCollapse: true,
    route: "/dashboards",
    component: <Default />,
  },

  { type: "title", title: "Foydalanuvchilar", key: "users-title" },

  {
    type: "collapse",
    name: "Foydalanuvchilar",
    key: "users",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/users/students",
    component: <UsersList />,
  },
  {
    type: "collapse",
    name: "Bildirishnomalar",
    key: "notificatin",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/notificatin",
    component: <Notification />,
  },



  {
    show: false,
    type: "collapse",
    name: "Teacher",
    key: "teacher",
    noCollapse: true,
    route: "/users/teacher",
    component: <TeacherPage />,
  },

  {
    show: false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/supportCenter",
    component: <UsersSupportCenter />
  },

  {
    show: false,
    type: "collapse",
    name: "Quiz",
    key: "Quiz",
    noCollapse: true,
    route: "/quizes/:ID",
    component: <QuizeInfo />
  },

  {
    show: false,
    type: "collapse",
    name: "QustionCreate",
    key: "QustionCreate",
    noCollapse: true,
    route: "/quizes/question/create/:ID",
    component: <QuestionCreate />
  },

  {
    show: false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/profile/:ID",
    component: <Profile />
  },


  {
    show: false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/admins",
    component: <UsersAdmins />
  },
  {
    show: false,
    type: "collapse",
    name: "Group Student",
    key: "GroupStudent",
    noCollapse: true,
    route: "/mygroup/:ID",
    component: <StudentByGroup />
  },
  {
    show: false,
    type: "collapse",
    name: "Stundent Report",
    key: "StudentReport",
    noCollapse: true,
    route: "/student-report/:ID",
    component: <StudentReport />
  },
  {
    show: false,
    type: "collapse",
    name: "Stundent Personality",
    key: "StudentPersonality",
    noCollapse: true,
    route: "/student-Personality/:ID",
    component: <StudentPersonality />
  },
  {
    show: false,
    type: "collapse",
    name: "Student Lesson Report",
    key: "StudentLessonReport",
    noCollapse: true,
    route: "/student-lesson-report/:groupID/:studentID",
    component: <StudentLessonReport />
  },
  {
    show: false,
    type: "collapse",
    name: "Chat",
    key: "Chat",
    noCollapse: true,
    route: "/chat/:StundetID/:CreatorID",
    component: <ChatInfo />
  },

  {
    type: "collapse",
    name: "Chatlar",
    key: "chats",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/chats",
    component: <ChatList />,
  },
  {
    type: "collapse",
    name: "Davomat",
    key: "attendance",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/attendance",
    component: <AttendanceList />,
  },

  { type: "title", title: "Kurslar", key: "courses-title" },
  {
    type: "collapse",
    name: "Ro‘yxatdan o‘tish",
    key: "enrollment",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/enrollment",
    component: <Enrollment />,
  },
  {
    type: "collapse",
    name: "Guruh",
    key: "group",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/group",
    component: <GroupList />,
  },
  {
    type: "collapse",
    name: "Kurs",
    key: "course",
    icon: <Shop size="12px" />,
    noCollapse: true,
    route: "/course",
    component: <CourseList />,
  },
  {
    show: false,
    type: "collapse",
    name: "CourseDetails",
    key: "course",
    noCollapse: true,
    route: "/cours/detail/:ID",
    component: <CourseDetail />,
  },
  {
    type: "collapse",
    name: "Modul",
    key: "module",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/module",
    component: <ModuleList />,
  },
  {
    type: "collapse",
    name: "Darslar",
    key: "lessons",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/lessons",
    component: <LessonList />,
  },

  {
    type: "collapse",
    name: "Testlar",
    key: "quizes",
    icon: <Basket size="12px" />,
    noCollapse: true,
    route: "/quizes",
    component: <QuizeList />,
  },
  { type: "title", title: "Uchrashuvlar", key: "meetings-title" },
  {
    type: "collapse",
    name: "Yig‘ilish",
    key: "assembly",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/assembly",
    component: <Assembly />,
  },

  { type: "title", title: "Qo‘shimcha", key: "advanced-title" },

  {
    type: "collapse",
    name: "Edu Mavzu",
    key: "edu-theme",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/edu-theme",
    component: <EduTheme />,
  },
  {
    type: "collapse",
    name: "Versiyalar",
    key: "versions",
    icon: <Basket size="12px" />,
    noCollapse: true,
    route: "/versions",
    component: <VersionList />,
  },

  {
    type: "collapse",
    name: "Mening guruhlarim",
    key: "My groups",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/teacher/group",
    component: <TeacherGroup />,
  },

  {
    type: "collapse",
    name: "SMS",
    key: "sms",
    icon: <Shop size="12px" />,
    noCollapse: true,
    route: "/sms",
    component: <SMSList />,
  },
  {
    type: "collapse",
    name: "Test natijalari",
    key: "TestResult",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/test-result",
    component: <TestResult />
  },
  {
    show: false,
    type: "collapse",
    name: "Create TestResult",
    key: "TestResultCreate",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/test-result/create",
    component: <TestResultAdd />
  },
  {
    type: "collapse",
    name: "Dars hisobotlari",
    key: "LessonReport",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/lesson-report",
    component: <LessonReport />
  },
  {
    show: false,
    type: "collapse",
    name: "Dars hisobotlari yaratish",
    key: "LessonReportCreate",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/lesson-report/create",
    component: <CreateLessonReport />
  },
  {
    type: "collapse",
    name: "Hisobot",
    key: "Report",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/report",
    component: <Report />
  },
  {
    type: "collapse",
    name: "Hisobot yaratish",
    key: "Report",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/report/create",
    component: <ReportCreate />
  },
  {
    show: false,
    type: "collapse",
    name: "Stundet test result",
    key: "Stundet test result",
    noCollapse: true,
    route: "/student/test-result/:ID",
    component: <StudentResult />
  },


  {
    show: false,
    type: "collapse",
    name: "Notification",
    key: "notificatin",
    noCollapse: true,
    route: "/notificatin/stundet/:ID",
    component: <StundetNotification />,
  },
  {
    type: "collapse",
    name: "Referal",
    key: "referral",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/referral",
    component: <Referral />,
  },
  {
    type: "collapse",
    name: "Shaxsiyati",
    key: "Personality",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/personality",
    component: <Personality />,
  },
  {
    show: false,
    type: "collapse",
    name: "Shaxsiyati yaratish",
    key: "Personality Create",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/personality/create",
    component: <PersonalityCreate />,
  },


  {
    type: "collapse",
    name: "Fayllar",
    key: "files",
    icon: <CreditCard size="12px" />,
    noCollapse: true,
    route: "/files",
    component: <FileList />,
  },

  {
    type: "hidden",
    name: "Add quize",
    key: "quizes/add",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "quizes/add",
    component: <QuizeAdd />,
  },
  {
    type: "hidden",
    name: "Quizes Update",
    key: "quizes/update",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/quizes/update",
    component: <QuizeUpdate />,
  },
];

export default routes;
