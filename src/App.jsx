
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected application pages */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/kanban" element={<Kanban />} />
            </Route>
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
