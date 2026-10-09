
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  FolderKanban,
  CalendarDays,
  Trash2,
  X,
  ArrowUpRight,
} from "lucide-react";

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with a modern user experience.",
    category: "Design",
    progress: 75,
    deadline: "2026-10-18",
    color: "violet",
  },
  {
    id: 2,
    name: "Mobile App",
    description: "Build a responsive mobile application for customers.",
    category: "Development",
    progress: 48,
    deadline: "2026-10-22",
    color: "blue",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Plan and execute the next digital marketing campaign.",
    category: "Marketing",
    progress: 90,
    deadline: "2026-10-15",
    color: "emerald",
  },
];

const emptyProject = {
  name: "",
  description: "",
  category: "Development",
  progress: 0,
  deadline: "",
  color: "violet",
};

const colorStyles = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

const progressStyles = {
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
};

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyProject);
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      category: project.category,
      progress: project.progress,
      deadline: project.deadline,
      color: project.color,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) return;

    if (editingId !== null) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingId ? { ...project, ...form } : project
        )
      );
    } else {
      setProjects((current) => [
        {
          id: Date.now(),
          ...form,
        },
        ...current,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyProject);
  }

  function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;

    setProjects((current) =>
      current.filter((project) => project.id !== id)
    );
  }

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / Projects</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Projects
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Plan your work, monitor progress, and meet your deadlines.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus size={18} />
          New Project
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Projects", value: projects.length },
          {
            label: "In Progress",
            value: projects.filter(
              (project) => project.progress > 0 && project.progress < 100
            ).length,
          },
          {
            label: "Completed",
            value: projects.filter((project) => project.progress === 100)
              .length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <Search size={19} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <option value="All">All categories</option>
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Marketing">Marketing</option>
        </select>
      </section>

      <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  colorStyles[project.color] || colorStyles.violet
                }`}
              >
                <FolderKanban size={23} />
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => openEditForm(project)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  aria-label={`Delete ${project.name}`}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                colorStyles[project.color] || colorStyles.violet
              }`}
            >
              {project.category}
            </span>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              {project.name}
            </h2>

            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
              {project.description || "No description added."}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Progress</p>
              <p className="text-sm font-bold text-slate-900">
                {project.progress}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  progressStyles[project.color] || progressStyles.violet
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={16} />
                {project.deadline || "No deadline"}
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                Details <ArrowUpRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </section>

      {filteredProjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <FolderKanban className="mx-auto text-slate-400" size={36} />
          <p className="mt-4 font-semibold text-slate-800">
            No projects found
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try another search or create a new project.
          </p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId !== null ? "Edit Project" : "Create Project"}
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
              Project name
            </label>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="e.g. TaskFlow Website"
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="What is this project about?"
              rows={3}
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) => {
                    const selected = event.target.value;
                    const colorMap = {
                      Design: "violet",
                      Development: "blue",
                      Marketing: "emerald",
                    };

                    setForm({
                      ...form,
                      category: selected,
                      color: colorMap[selected],
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <option>Design</option>
                  <option>Development</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Progress: {form.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={form.progress}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      progress: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-violet-600"
                />
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(event) =>
                setForm({ ...form, deadline: event.target.value })
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
                {editingId !== null ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}