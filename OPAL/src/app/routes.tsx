import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Tasks from "./pages/Tasks";
import Lists from "./pages/Lists";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import DailyCheckIn from "./pages/DailyCheckIn";
import { PriorityDemo } from "./components/PriorityDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "onboarding", Component: Onboarding },
      { path: "daily-checkin", Component: DailyCheckIn },
      { path: "tasks", Component: Tasks },
      { path: "lists", Component: Lists },
      { path: "calendar", Component: Calendar },
      { path: "settings", Component: Settings },
      { path: "priority-demo", Component: PriorityDemo },
    ],
  },
]);