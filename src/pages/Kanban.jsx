
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, CalendarDays, GripVertical } from "lucide-react";

const API_URL = "http://localhost:5000/api/tasks";

const columns = [
  { id: "todo", title: "To Do", color: "bg-amber-500" },
  { id: "inprogress", title: "In Progress", color: "bg-blue-500" },
  { id: "done", title: "Completed", color: "bg-emerald-500" },
];

const priorityStyles = {
  High: "bg-rose-50 text-rose-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

function toKanbanTask(task) {
  return {
    id: task._id || task.id,
    title: task.title,
    project: task.project || "General",
    priority: task.priority || "Medium",
    dueDate: task.dueDate
      ? String(task.dueDate).slice(0, 10)
      : "",
    status: task.status || "todo",
  };
}

function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            priorityStyles[task.priority] || priorityStyles.Medium
          }`}
        >
          {task.priority} priority
        </span>

        <button
          {...attributes}
          {...listeners}
          aria-label={`Drag ${task.title}`}
          className="cursor-grab touch-none rounded-md p-1 text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
      </div>

      <h3 className="font-semibold leading-6 text-slate-800">
        {task.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">{task.project}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <CalendarDays size={15} />
        {task.dueDate || "No deadline"}
      </div>
    </article>
  );
}

function KanbanColumn({ column, tasks, onAddTask }) {
  const { setNodeRef, isOver } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-96 rounded-2xl p-3 transition ${
        isOver ? "bg-violet-100/70" : "bg-slate-100/80"
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
          <h2 className="font-bold text-slate-800">{column.title}</h2>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.title}`}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-white"
        >
          <Plus size={18} />
        </button>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-72 space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function fetchTasks() {
      try {
        setError("");
        const response = await axios.get(API_URL);
        setTasks(response.data.map(toKanbanTask));
      } catch (err) {
        console.error("Failed to load Kanban tasks:", err);
        setError(
          "Could not load tasks. Make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  function findTask(id) {
    return tasks.find((task) => task.id === id);
  }

  function handleDragStart(event) {
    setActiveTask(findTask(event.active.id) || null);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const draggedTask = findTask(active.id);
    if (!draggedTask) return;

    const targetTask = findTask(over.id);
    const targetColumn = columns.find(
      (column) => column.id === over.id
    );

    let newStatus = draggedTask.status;

    if (targetColumn) {
      newStatus = targetColumn.id;
    } else if (targetTask) {
      newStatus = targetTask.status;
    }

    if (newStatus === draggedTask.status) return;

    const previousTasks = tasks;

    // Update the UI immediately.
    setTasks((current) =>
      current.map((task) =>
        task.id === draggedTask.id
          ? { ...task, status: newStatus }
          : task
      )
    );

    try {
      setSaving(true);
      setError("");

      await axios.put(`${API_URL}/${draggedTask.id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(previousTasks);
      setError("Could not save the task status. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function addTask(status) {
    const title = window.prompt("Enter the new task title:");
    if (!title?.trim()) return;

    try {
      setError("");

      const response = await axios.post(API_URL, {
        title: title.trim(),
        project: "TaskFlow",
        priority: "Medium",
        dueDate: null,
        status,
      });

      const newTask = toKanbanTask(response.data);

      setTasks((current) => [newTask, ...current]);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Could not create the task. Please try again.");
    }
  }

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / Board</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Kanban Board
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Drag tasks between columns to update their status.
          </p>
        </div>

        <button
          onClick={() => addTask("todo")}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          New Task
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {saving && (
        <p className="mb-4 text-sm text-slate-500">
          Saving task status...
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl bg-slate-100 p-10 text-center text-slate-500">
          Loading tasks from MongoDB...
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
          <div className="grid items-start gap-5 lg:grid-cols-3">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks.filter(
                  (task) => task.status === column.id
                )}
                onAddTask={addTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 rounded-xl border border-violet-300 bg-white p-4 shadow-xl">
                <p className="font-semibold text-slate-800">
                  {activeTask.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activeTask.project}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </main>
  );
}
