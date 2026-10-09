
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/tasks";

const emptyForm = {
  title: "",
  project: "Website Redesign",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

// Convert the backend status to the labels used by the UI.
const toUIStatus = (status) => {
  const statuses = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Completed",
  };

  return statuses[status] || status || "To Do";
};

// Convert the UI status to the values accepted by MongoDB.
const toAPIStatus = (status) => {
  const statuses = {
    "To Do": "todo",
    "In Progress": "inprogress",
    Completed: "done",
  };

  return statuses[status] || "todo";
};

// Convert a MongoDB task into the format used by this page.
const toUITask = (task) => ({
  id: task._id,
  title: task.title,
  project: task.project || "General",
  status: toUIStatus(task.status),
  priority: task.priority || "Medium",
  dueDate: task.dueDate
    ? String(task.dueDate).slice(0, 10)
    : "",
});

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load tasks from MongoDB through the Express API.
  async function fetchTasks() {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setTasks(response.data.map(toUITask));
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Could not load tasks. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

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

  // Create a new task or update an existing one in MongoDB.
  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    const taskData = {
      ...form,
      title: form.title.trim(),
      status: toAPIStatus(form.status),
      dueDate: form.dueDate || null,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, taskData);
      } else {
        await axios.post(API_URL, taskData);
      }

      await fetchTasks();

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(
        err.response?.data?.message || "Could not save the task."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete the task from MongoDB.
  async function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await axios.delete(`${API_URL}/${id}`);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Could not delete the task.");
    }
  }

  // Update completion status in MongoDB.
  async function toggleComplete(task) {
    const newStatus =
      task.status === "Completed" ? "To Do" : "Completed";

    try {
      setError("");

      await axios.put(`${API_URL}/${task.id}`, {
        status: toAPIStatus(newStatus),
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Could not update the task status.");
    }
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

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "All Tasks", value: tasks.length },
          {
            label: "In Progress",
            value: tasks.filter(
              (task) => task.status === "In Progress"
            ).length,
          },
          {
            label: "Completed",
            value: tasks.filter(
              (task) => task.status === "Completed"
            ).length,
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

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading tasks...
          </div>
        ) : (
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
                    <CheckCircle2
                      className="text-emerald-500"
                      size={22}
                    />
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
                      statusStyles[task.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      priorityStyles[task.priority] ||
                      "text-slate-500"
                    }`}
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
                <p className="font-semibold text-slate-700">
                  {tasks.length === 0
                    ? "No tasks yet"
                    : "No tasks found"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search or create a new task.
                </p>
              </div>
            )}
          </div>
        )}
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

            <label className="mb-2 block text-sm font-medium">
              Task title
            </label>
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Build login page"
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <label className="mb-2 block text-sm font-medium">
              Project
            </label>
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
              <option>TaskFlow</option>
              <option>General</option>
            </select>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>
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
                <label className="mb-2 block text-sm font-medium">
                  Priority
                </label>
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

            <label className="mb-2 block text-sm font-medium">
              Due date
            </label>
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
                disabled={saving}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
