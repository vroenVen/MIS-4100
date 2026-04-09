import { useState } from "react";
import { useApp, SubTask } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { Plus, Trash2, ChevronDown, ChevronRight, Circle, CheckCircle2, Pencil, Check, X } from "lucide-react";
import { format, addDays, endOfWeek } from "date-fns";
import { PriorityBadge } from "../components/PriorityBadge";
import { capitalizeFirstLetter } from "../utils/stringHelpers";

export default function Tasks() {
  const { userData, tasks, addTask, updateTask, deleteTask } = useApp();
  const { theme, darkMode } = useTheme();
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newSubtask, setNewSubtask] = useState<{ [key: string]: string }>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDate, setEditTaskDate] = useState("");

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const handleAddTask = async () => {
    if (newTaskTitle) {
      // In production, priority would be set by AI backend
      // For demo, randomly assign a priority to show the system working
      const demoPriority = Math.floor(Math.random() * 11); // 0-10
      console.log("test Add task")
      

      addTask({
        title: newTaskTitle,
        completed: false,
        date: newTaskDate || undefined,
        subtasks: [],
        priority: demoPriority || undefined, // undefined if 0
      });
      setNewTaskTitle("");
      setNewTaskDate("");
      setShowAddTask(false);
      try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/save/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks), // ✅ MUST be array
      });

      const data = await response.text();
      console.log("Saved:", data);

    } catch (error) {
      console.error("Error saving to Django:", error);
    }
    }
  };

  const handleQuickDate = (type: 'today' | 'week') => {
    if (type === 'today') {
      setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
    } else {
      setNewTaskDate(format(endOfWeek(new Date()), 'yyyy-MM-dd'));
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const addSubtask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtaskText = newSubtask[taskId];
    
    if (task && subtaskText) {
      const newSubtaskObj: SubTask = {
        id: Date.now().toString(),
        title: subtaskText,
        completed: false,
      };
      
      updateTask(taskId, {
        subtasks: [...(task.subtasks || []), newSubtaskObj],
      });
      
      setNewSubtask({ ...newSubtask, [taskId]: "" });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const updatedSubtasks = task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  const startEditingTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setEditTaskTitle(task.title);
      setEditTaskDate(task.date || "");
    }
  };

  const saveTaskEdit = () => {
    if (editingTaskId && editTaskTitle) {
      updateTask(editingTaskId, {
        title: editTaskTitle,
        date: editTaskDate || undefined,
      });
      setEditingTaskId(null);
      setEditTaskTitle("");
      setEditTaskDate("");
    }
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditTaskTitle("");
    setEditTaskDate("");
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{capitalizeFirstLetter(userData.name)}'s Tasks</h1>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.textOnPrimary,
            }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Priority System Info Banner - Remove in production */}
        <div
          className="p-3 rounded-lg mb-4 text-sm"
          style={{
            backgroundColor: theme.colors.tertiary,
            color: theme.textOnTertiary,
          }}
        >
          <p className="font-semibold mb-1">📊 Priority System Active</p>
          <p className="opacity-90">
            Each task shows an AI-generated priority (1-10). In demo mode, priorities are randomly assigned. 
            Visit <a href="/priority-demo" className="underline">/priority-demo</a> to see all priority states.
          </p>
        </div>

        {showAddTask && (
          <div
            className="p-4 rounded-lg mb-6 space-y-3"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.textOnSecondary,
            }}
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2 rounded-lg border-2"
              style={{
                backgroundColor: darkMode ? theme.surface : theme.background,
                color: darkMode ? theme.surfaceText : theme.text,
                borderColor: theme.colors.primary,
              }}
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickDate('today')}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.colors.tertiary,
                  color: theme.textOnTertiary,
                }}
              >
                Today
              </button>
              <button
                onClick={() => handleQuickDate('week')}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.colors.tertiary,
                  color: theme.textOnTertiary,
                }}
              >
                By end of week
              </button>
            </div>

            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2"
              style={{
                backgroundColor: darkMode ? theme.surface : theme.background,
                color: darkMode ? theme.surfaceText : theme.text,
                borderColor: theme.colors.primary,
              }}
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.textOnPrimary,
                }}
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskTitle("");
                  setNewTaskDate("");
                }}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: theme.colors.tertiary,
                  color: theme.textOnTertiary,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <div
              className="p-6 rounded-lg text-center"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
              }}
            >
              <p className="opacity-70">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            sortedTasks.map((task) => {
              const isExpanded = expandedTasks.has(task.id);
              const isEditing = editingTaskId === task.id;
              
              return (
                <div
                  key={task.id}
                  className="rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.textOnSecondary,
                  }}
                >
                  <div className="p-4">
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          placeholder="Task title"
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{
                            backgroundColor: darkMode ? theme.surface : theme.background,
                            color: darkMode ? theme.surfaceText : theme.text,
                            borderColor: theme.colors.primary,
                          }}
                        />
                        <input
                          type="date"
                          value={editTaskDate}
                          onChange={(e) => setEditTaskDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{
                            backgroundColor: darkMode ? theme.surface : theme.background,
                            color: darkMode ? theme.surfaceText : theme.text,
                            borderColor: theme.colors.primary,
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveTaskEdit}
                            className="flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: theme.textOnPrimary,
                            }}
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelTaskEdit}
                            className="px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            style={{
                              backgroundColor: theme.colors.tertiary,
                              color: theme.textOnTertiary,
                            }}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => updateTask(task.id, { completed: !task.completed })}
                          className="mt-1"
                          style={{ color: theme.textOnSecondary }}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                              {task.title}
                            </div>
                            <PriorityBadge priority={task.priority} size="small" />
                          </div>
                          {task.date && (
                            <div className="text-sm opacity-70 mt-1">
                              {format(new Date(task.date), 'MMM d, yyyy')}
                            </div>
                          )}
                          
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="text-sm opacity-70 mt-1">
                              {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingTask(task.id)}
                            className="p-1"
                            style={{ color: theme.textOnSecondary }}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleExpanded(task.id)}
                            className="p-1"
                            style={{ color: theme.textOnSecondary }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1"
                            style={{ color: theme.textOnSecondary }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isExpanded && !isEditing && (
                    <div
                      className="px-4 pb-4 space-y-2"
                      style={{
                        backgroundColor: darkMode ? theme.surface : theme.background,
                      }}
                    >
                      <div className="text-sm font-semibold mb-2" style={{ color: textColor }}>
                        Subtasks
                      </div>
                      
                      {task.subtasks?.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 pl-4">
                          <button
                            onClick={() => toggleSubtask(task.id, subtask.id)}
                            style={{ color: textColor }}
                          >
                            {subtask.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`flex-1 ${subtask.completed ? 'line-through opacity-60' : ''}`}
                            style={{ color: textColor }}
                          >
                            {subtask.title}
                          </span>
                          <button
                            onClick={() => deleteSubtask(task.id, subtask.id)}
                            style={{ color: textColor }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2 pl-4 mt-2">
                        <input
                          type="text"
                          value={newSubtask[task.id] || ""}
                          onChange={(e) => setNewSubtask({ ...newSubtask, [task.id]: e.target.value })}
                          placeholder="Add subtask"
                          className="flex-1 px-3 py-1 rounded text-sm border-2"
                          style={{
                            backgroundColor: theme.colors.secondary,
                            color: theme.textOnSecondary,
                            borderColor: theme.colors.primary,
                          }}
                        />
                        <button
                          onClick={() => addSubtask(task.id)}
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.textOnPrimary,
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}