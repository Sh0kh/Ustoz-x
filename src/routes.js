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

const routes = [
  { type: "title", title: "General", key: "general-title" },
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <Shop size="12px" />,
    noCollapse: true,
    route: "/dashboards",
    component: <Default />,
  },

  { type: "title", title: "Users", key: "users-title" },

  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/users/students",
    component: <UsersList />,
  },
  
  {
    show:false,
    type: "collapse",
    name: "Teacher",
    key: "teacher",
    noCollapse: true,
    route: "/users/teacher",
    component: <TeacherPage/>,
  },
  
  {
    show:false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/supportCenter",
    component: <UsersSupportCenter/>
  },
  
  {
    show:false,
    type: "collapse",
    name: "Quiz",
    key: "Quiz",
    noCollapse: true,
    route: "/quizes/:ID",
    component: <QuizeInfo/>
  },
  
  {
    show:false,
    type: "collapse",
    name: "QustionCreate",
    key: "QustionCreate",
    noCollapse: true,
    route: "/quizes/question/create/:ID",
    component: <QuestionCreate/>
  },
  
  {
    show:false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/profile/:ID",
    component: <Profile/>
  },
  
  
  {
    show:false,
    type: "collapse",
    name: "Support Center",
    key: "SupportCenter",
    noCollapse: true,
    route: "/users/admins",
    component: <UsersAdmins/>
  },
  

  

  {
    type: "collapse",
    name: "Files",
    key: "files",
    icon: <CreditCard size="12px" />,
    noCollapse: true,
    route: "/files",
    component: <FileList />,
  },
  {
    type: "collapse",
    name: "Chats",
    key: "chats",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/chats",
    component: <ChatList />,
  },

  { type: "title", title: "Courses", key: "courses-title" },
  {
    type: "collapse",
    name: "Course",
    key: "course",
    icon: <Shop size="12px" />,
    noCollapse: true,
    route: "/course",
    component: <CourseList />,
  },
  {
    type: "collapse",
    name: "Module",
    key: "module",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/module",
    component: <ModuleList />,
  },
  {
    type: "collapse",
    name: "Lessons",
    key: "lessons",
    icon: <Document size="12px" />,
    noCollapse: true,
    route: "/lessons",
    component: <LessonList />,
  },

  {
    type: "collapse",
    name: "Quizes",
    key: "quizes",
    icon: <Basket size="12px" />,
    noCollapse: true,
    route: "/quizes",
    component: <QuizeList />,
  },

  { type: "title", title: "Advanced", key: "advanced-title" },

  {
    type: "collapse",
    name: "Edu Theme",
    key: "edu-theme",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/edu-theme",
    component: <EduTheme />,
  },
  {
    type: "collapse",
    name: "Versions",
    key: "versions",
    icon: <Basket size="12px" />,
    noCollapse: true,
    route: "/versions",
    component: <VersionList />,
  },
  {
    type: "collapse",
    name: "Group",
    key: "group",
    icon: <CustomerSupport size="12px" />,
    noCollapse: true,
    route: "/group",
    component: <GroupList />,
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
    name: "Notification",
    key: "notificatin",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/notificatin",
    component: <Notification />,
  },
  {
    type: "collapse",
    name: "Referral",
    key: "referral",
    icon: <SpaceShip size="12px" />,
    noCollapse: true,
    route: "/referral",
    component: <Referral />,
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <SettingsIcon size="12px" />,
    noCollapse: true,
    route: "/attendance",
    component: <AttendanceList />,
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
