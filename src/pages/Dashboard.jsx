
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";

const TASKS_API = "http://localhost:5000/api/tasks";
const PROJECTS_API = "http://localhost:5000/api/projects";

const statusDetails = {
  todo: {
    label: "To Do",
    color: "bg-amber-100 text-amber-700",
  },
  inprogress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
  },
  done: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700",
  },
};

const projectColors = {
  Design: "bg-violet-500",
  Development: "bg-blue-500",
  Marketing: "bg-emerald-500",
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
};

function formatDate(date) {
  if (!date) return "No deadline";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "No deadline";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function getTaskStatus(task) {
  return statusDetails[task.status] || {
    label: task.status || "To Do",
    color: "bg-slate-100 text-slate-600",
  };
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get(TASKS_API),
          axios.get(PROJECTS_API),
        ]);

        setTasks(
          Array.isArray(tasksResponse.data) ? tasksResponse.data : []
        );

        setProjects(
          Array.isArray(projectsResponse.data)
            ? projectsResponse.data
            : []
        );
      } catch (err) {
        console.error("Dashboard data loading failed:", err);
        setError(
          "Unable to load dashboard data. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [tasks]
  );

  const chartData = useMemo(() => {
    const days = [];

    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);

      days.push({
        dateKey: [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-"),
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        tasks: 0,
      });
    }

    // Use actual task creation dates as a real activity measure.
    tasks.forEach((task) => {
      if (!task.createdAt) return;

      const created = new Date(task.createdAt);
      if (Number.isNaN(created.getTime())) return;

      const key = [
        created.getFullYear(),
        String(created.getMonth() + 1).padStart(2, "0"),
        String(created.getDate()).padStart(2, "0"),
      ].join("-");

      const matchingDay = days.find((day) => day.dateKey === key);

      if (matchingDay) matchingDay.tasks += 1;
    });

    return days.map(({ day, tasks: count }) => ({
      day,
      tasks: count,
    }));
  }, [tasks]);

  const projectsWithProgress = projects.slice(0, 4);

  function handleCreateProject() {
    navigate("/projects");
  }

  return (
    <div className="min-h-screen text-slate-900">
      <main className="min-w-0 p-5 sm:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Good morning, Srimanta 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your projects today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tasks")}
              aria-label="Search tasks"
              className="rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-100"
            >
              <Search size={19} />
            </button>

            <button
              onClick={() => navigate("/tasks")}
              aria-label="View tasks"
              className="relative rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-100"
            >
              <Bell size={19} />
              {pendingTasks > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New project</span>
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading dashboard data from MongoDB...
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Projects"
                value={projects.length}
                subtitle={`${projects.filter((project) => project.progress < 100).length} active projects`}
                icon={FolderKanban}
                color="violet"
              />

              <StatCard
                title="Total Tasks"
                value={tasks.length}
                subtitle="Across all projects"
                icon={ListTodo}
                color="blue"
              />

              <StatCard
                title="Completed"
                value={completedTasks}
                subtitle={`${completionRate}% of all tasks`}
                icon={CheckCircle2}
                color="emerald"
              />

              <StatCard
                title="Pending Tasks"
                value={pendingTasks}
                subtitle={`${inProgressTasks} in progress`}
                icon={Clock3}
                color="amber"
              />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">
                      Productivity Overview
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Tasks created over the last 7 days
                    </p>
                  </div>

                  <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                    Last 7 days
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="taskGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#f1f5f9"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                        }}
                      />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="tasks"
                        name="Tasks created"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fill="url(#taskGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Project Progress</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your active projects
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/projects")}
                    aria-label="View all projects"
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {projectsWithProgress.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No projects yet. Create your first project.
                  </p>
                ) : (
                  <div className="space-y-7">
                    {projectsWithProgress.map((project) => {
                      const color =
                        projectColors[project.color] ||
                        projectColors[project.category] ||
                        "bg-violet-500";

                      return (
                        <div key={project._id || project.id}>
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} text-xs font-bold text-white`}
                            >
                              {getInitials(project.name)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {project.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {project.category || "Project"} · Due{" "}
                                {formatDate(project.deadline)}
                              </p>
                            </div>

                            <span className="text-sm font-semibold">
                              {Number(project.progress) || 0}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${color}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    Number(project.progress) || 0
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">Recent Tasks</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest task updates
                  </p>
                </div>

                <button
                  onClick={() => navigate("/tasks")}
                  className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800"
                >
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
                    {recentTasks.map((task) => {
                      const status = getTaskStatus(task);

                      return (
                        <tr
                          key={task._id || task.id}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                        >
                          <td className="py-4 pr-4 font-medium text-slate-800">
                            {task.title}
                          </td>

                          <td className="py-4 pr-4 text-slate-500">
                            {task.project || "General"}
                          </td>

                          <td className="py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {recentTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-10 text-center text-sm text-slate-400"
                        >
                          No tasks yet. Create a task to see it here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <footer className="py-6 text-center text-xs text-slate-400">
          TaskFlow · Organize work. Achieve more.
        </footer>
      </main>
    </div>
  );
}
