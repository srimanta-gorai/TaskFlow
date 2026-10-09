import { NavLink } from "react-router-dom";


import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  Settings,
  CircleHelp,
  Zap,
  Plus,
} from "lucide-react";



const menuItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Projects", icon: FolderKanban },
  { label: "My Tasks", icon: CheckSquare },
  { label: "Calendar", icon: CalendarDays },
  { label: "Kanban Board", icon: FolderKanban },
];

export default function Sidebar() {
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
          <p className="text-xs text-slate-500">Work smarter together</p>
        </div>
      </div>

      <button className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700">
        <Plus size={18} />
        Create new
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-2">
    {menuItems.map(({ label, icon: Icon }) => {
    const paths = {
      Overview: "/",
      "My Projects": "/projects",
      "My Tasks": "/tasks",
      Calendar: "/calendar",
      "Kanban Board": "/kanban",
    };

    return (
      <NavLink
        key={label}
        to={paths[label]}
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
        {label === "My Tasks" && (
          <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs">
            8
          </span>
        )}
      </NavLink>
        );
    })}
      </nav>

      <div className="mt-auto space-y-2 pt-10">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
          <CircleHelp size={19} /> Help & Support
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
          <Settings size={19} /> Settings
        </button>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
            SG
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              Srimanta Gorai
            </p>
            <p className="text-xs text-slate-500">Free workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}