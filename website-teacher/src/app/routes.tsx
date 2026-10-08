import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Dashboard from "./components/Dashboard";
import Classes from "./components/Classes";
import CalendarView from "./components/CalendarView";
import Drive from "./components/Drive";
import Assignments from "./components/Assignments";
import MarksAttendance from "./components/MarksAttendance";
import FileUpload from "./components/FileUpload";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: CalendarView },
      { path: "dashboard", Component: Dashboard },
      { path: "classes", Component: Classes },
      { path: "marks-attendance", Component: MarksAttendance },
      { path: "attainment", Component: FileUpload },
      { path: "drive", Component: Drive },
      { path: "assignments", Component: Assignments },
      { path: "*", Component: NotFound },
    ],
  },
]);