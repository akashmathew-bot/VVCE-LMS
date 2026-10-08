import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { DriveProvider } from "./context/DriveContext";
import { MarksProvider } from "./context/MarksContext";

export default function App() {
  return (
    <MarksProvider>
      <DriveProvider>
        <RouterProvider router={router} />
        <Toaster />
      </DriveProvider>
    </MarksProvider>
  );
}