
import {
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  MoreHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import StatCard from "../components/StatCard";

const activity = [
  { day: "Mon", tasks: 8 },
  { day: "Tue", tasks: 12 },
  { day: "Wed", tasks: 9 },
  { day: "Thu", tasks: 16 },
  { day: "Fri", tasks: 13 },
  { day: "Sat", tasks: 19 },
  { day: "Sun", tasks: 15 },
];

const projects = [
  {
    name: "Website Redesign",
    category: "Design",
    progress: 75,
    color: "bg-violet-500",
    initials: "WR",
    due: "Oct 18",
  },
  {
    name: "Mobile App",
    category: "Development",
    progress: 48,
    color: "bg-blue-500",
    initials: "MA",
    due: "Oct 22",
  },
  {
    name: "Marketing Campaign",
    category: "Marketing",
    progress: 90,
    color: "bg-emerald-500",
    initials: "MC",
    due: "Oct 15",
  },
];

const tasks = [
  { title: "Finalize homepage design", project: "Website Redesign", status: "In Progress", color: "bg-blue-100 text-blue-700" },
  { title: "Fix responsive navigation", project: "Mobile App", status: "To Do", color: "bg-amber-100 text-amber-700" },
  { title: "Review campaign analytics", project: "Marketing Campaign", status: "Completed", color: "bg-emerald-100 text-emerald-700" },
  { title: "Prepare project presentation", project: "Website Redesign", status: "In Progress", color: "bg-blue-100 text-blue-700" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen text-slate-900">

      <main className="min-w-0 p-5 sm:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Friday, October 9, 2026</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Good morning, Srimanta 👋
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your projects today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Search" className="rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-100">
              <Search size={19} />
            </button>
            <button aria-label="Notifications" className="relative rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-100">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700">
              <Plus size={18} /> <span className="hidden sm:inline">New project</span>
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Projects" value="12" subtitle="3 projects active" icon={FolderKanban} color="violet" />
          <StatCard title="Total Tasks" value="48" subtitle="Across all projects" icon={ListTodo} color="blue" />
          <StatCard title="Completed" value="32" subtitle="67% of all tasks" icon={CheckCircle2} color="emerald" />
          <StatCard title="Pending Tasks" value="16" subtitle="4 due this week" icon={Clock3} color="amber" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Productivity Overview</h3>
                <p className="mt-1 text-sm text-slate-500">Tasks completed this week</p>
              </div>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                This week
              </button>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={3} fill="url(#taskGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Project Progress</h3>
                <p className="mt-1 text-sm text-slate-500">Your active projects</p>
              </div>
              <button aria-label="More project options" className="rounded-lg p-2 hover:bg-slate-100">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-7">
              {projects.map((project) => (
                <div key={project.name}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${project.color} text-xs font-bold text-white`}>
                      {project.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{project.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{project.category} · Due {project.due}</p>
                    </div>
                    <span className="text-sm font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">Recent Tasks</h3>
              <p className="mt-1 text-sm text-slate-500">A quick look at your task list</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800">
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-4 font-medium">Task</th>
                  <th className="pb-4 font-medium">Project</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.title} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-4 pr-4 font-medium text-slate-800">{task.title}</td>
                    <td className="py-4 pr-4 text-slate-500">{task.project}</td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${task.color}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-slate-400">
          TaskFlow · Organize work. Achieve more.
        </footer>
      </main>
    </div>
  );
}