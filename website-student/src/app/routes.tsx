import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Timetable } from "./pages/Timetable";
import { Assignments } from "./pages/Assignments";
import { Notes } from "./pages/Notes";
import { Clubs } from "./pages/Clubs";
import { ExamReports } from "./pages/ExamReports";
import { BusSchedules } from "./pages/BusSchedules";
import { Survey } from "./pages/Survey";
import { Help } from "./pages/Help";
import { Notifications } from "./pages/Notifications";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "timetable", Component: Timetable },
      { path: "assignments", Component: Assignments },
      { path: "notes", Component: Notes },
      { path: "clubs", Component: Clubs },
      { path: "exam-reports", Component: ExamReports },
      { path: "bus-schedules", Component: BusSchedules },
      { path: "survey", Component: Survey },
      { path: "help", Component: Help },
      { path: "notifications", Component: Notifications },
    ],
  },
]);
