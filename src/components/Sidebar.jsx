
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  Settings,
  CircleHelp,
  Zap,
  Plus,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "My Projects", icon: FolderKanban, path: "/projects" },
  { label: "My Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Calendar", icon: CalendarDays, path: "/calendar" },
  { label: "Kanban Board", icon: FolderKanban, path: "/kanban" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Zap size={23} fill="currentColor" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            TaskFlow
          </h1>
          <p className="text-xs text-slate-500">
            Work smarter together
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/projects")}
        className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700"
      >
        <Plus size={18} />
        Create new
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-2">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-10">
        <button
          onClick={() => navigate("/tasks")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"
        >
          <CircleHelp size={19} />
          Help & Support
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"
        >
          <Settings size={19} />
          Settings
        </button>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
            {(user?.name || "U")
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || "TaskFlow workspace"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
