
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Finalize homepage design",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-10-18",
  },
  {
    id: 2,
    title: "Fix responsive navigation",
    project: "Mobile App",
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-10-22",
  },
  {
    id: 3,
    title: "Review campaign analytics",
    project: "Marketing Campaign",
    status: "Completed",
    priority: "Low",
    dueDate: "2026-10-15",
  },
  {
    id: 4,
    title: "Prepare project presentation",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-10-20",
  },
];

const emptyForm = {
  title: "",
  project: "Website Redesign",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" || task.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, filter]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      project: task.project,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (editingId !== null) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId ? { ...task, ...form } : task
        )
      );
    } else {
      setTasks((current) => [
        {
          id: Date.now(),
          ...form,
        },
        ...current,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      setTasks((current) => current.filter((task) => task.id !== id));
    }
  }

  function toggleComplete(task) {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status:
                item.status === "Completed" ? "To Do" : "Completed",
            }
          : item
      )
    );
  }

  const statusStyles = {
    "To Do": "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  const priorityStyles = {
    Low: "text-slate-500",
    Medium: "text-amber-600",
    High: "text-rose-600",
  };

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / Tasks</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Tasks
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize your work and keep track of your progress.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus size={18} />
          Add Task
        </button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "All Tasks", value: tasks.length },
          {
            label: "In Progress",
            value: tasks.filter((task) => task.status === "In Progress").length,
          },
          {
            label: "Completed",
            value: tasks.filter((task) => task.status === "Completed").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4">
            <Search size={19} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks or projects..."
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="All">All statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => toggleComplete(task)}
                aria-label={`Toggle completion for ${task.title}`}
                className="self-start text-slate-400 hover:text-emerald-600 sm:self-center"
              >
                {task.status === "Completed" ? (
                  <CheckCircle2 className="text-emerald-500" size={22} />
                ) : (
                  <Circle size={22} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <h3
                  className={`font-semibold ${
                    task.status === "Completed"
                      ? "text-slate-400 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {task.project}
                  {task.dueDate && ` · Due ${task.dueDate}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    statusStyles[task.status]
                  }`}
                >
                  {task.status}
                </span>

                <span
                  className={`text-xs font-semibold ${priorityStyles[task.priority]}`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => openEditForm(task)}
                  aria-label="Edit task"
                  className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-semibold text-slate-700">No tasks found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search or create a new task.
              </p>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId !== null ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium">Task title</label>
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Build login page"
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <label className="mb-2 block text-sm font-medium">Project</label>
            <select
              value={form.project}
              onChange={(event) =>
                setForm({ ...form, project: event.target.value })
              }
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <option>Website Redesign</option>
              <option>Mobile App</option>
              <option>Marketing Campaign</option>
            </select>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Priority</label>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({ ...form, dueDate: event.target.value })
              }
              className="mb-6 w-full rounded-xl border border-slate-200 px-4 py-3"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                {editingId !== null ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}