import { useState, useEffect } from 'react';
import { Plus, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { OpalLogo } from './OpalLogo';

interface Task {
  id: string;
  title: string;
  type: 'event' | 'assignment';
  date: string;
  completed: boolean;
  createdAt: number;
}

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<'event' | 'assignment'>('event');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('today');
  const [userName, setUserName] = useState('My');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName + "'s");
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Update daily progress
    const today = new Date().toDateString();
    const todayTasks = updatedTasks.filter(t => new Date(t.date).toDateString() === today);
    const completedToday = todayTasks.filter(t => t.completed).length;
    
    const progress = JSON.parse(localStorage.getItem('dailyProgress') || '[]');
    const existingIndex = progress.findIndex((p: any) => p.date === today);
    
    if (existingIndex >= 0) {
      progress[existingIndex] = {
        date: today,
        completed: completedToday,
        total: todayTasks.length
      };
    } else {
      progress.push({
        date: today,
        completed: completedToday,
        total: todayTasks.length
      });
    }
    
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
  };

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        type: taskType,
        date: taskDate,
        completed: false,
        createdAt: Date.now()
      };
      saveTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDate(new Date().toISOString().split('T')[0]);
      setShowAddTask(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    saveTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    saveTasks(tasks.filter(task => task.id !== taskId));
  };

  const getFilteredTasks = () => {
    const today = new Date().toDateString();
    switch (filter) {
      case 'today':
        return tasks.filter(task => new Date(task.date).toDateString() === today);
      case 'upcoming':
        return tasks.filter(task => new Date(task.date) > new Date());
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks().sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const todayTasks = tasks.filter(task => 
    new Date(task.date).toDateString() === new Date().toDateString()
  );
  const completedToday = todayTasks.filter(task => task.completed).length;

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <OpalLogo size="sm" showText={false} />
        <h1 className="text-3xl font-bold mb-2 mt-4" style={{ color: '#2C2E4A' }}>{userName} Tasks</h1>
        <p style={{ color: '#717182' }}>
          {completedToday} of {todayTasks.length} tasks completed today
        </p>
      </div>

      {/* Progress Bar */}
      {todayTasks.length > 0 && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#717182' }}>Today's Progress</span>
            <span className="font-semibold" style={{ color: '#AA3BD1' }}>
              {Math.round((completedToday / todayTasks.length) * 100)}%
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#f5f5f7' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${(completedToday / todayTasks.length) * 100}%`,
                backgroundColor: '#AA3BD1'
              }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('today')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'today' ? 'text-white' : 'bg-white border'
          }`}
          style={filter === 'today' ? { backgroundColor: '#AA3BD1' } : { color: '#2C2E4A', borderColor: 'rgba(44, 46, 74, 0.2)' }}
        >
          Today
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming' ? 'text-white' : 'bg-white border'
          }`}
          style={filter === 'upcoming' ? { backgroundColor: '#AA3BD1' } : { color: '#2C2E4A', borderColor: 'rgba(44, 46, 74, 0.2)' }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'text-white' : 'bg-white border'
          }`}
          style={filter === 'all' ? { backgroundColor: '#AA3BD1' } : { color: '#2C2E4A', borderColor: 'rgba(44, 46, 74, 0.2)' }}
        >
          All
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 mb-20">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#717182' }}>
            <p>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-4 shadow-sm ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.completed
                      ? ''
                      : 'border-gray-300'
                  }`}
                  style={task.completed ? { backgroundColor: '#AA3BD1', borderColor: '#AA3BD1' } : {}}
                  onMouseEnter={(e) => !task.completed && (e.currentTarget.style.borderColor = '#AA3BD1')}
                  onMouseLeave={(e) => !task.completed && (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: task.completed ? '#717182' : '#2C2E4A' }}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.type === 'event' 
                        ? ''
                        : ''
                    }`}
                    style={task.type === 'event' ? { backgroundColor: '#F3E8FF', color: '#7C3AED' } : { backgroundColor: '#FFF4ED', color: '#EA580C' }}
                    >
                      {task.type === 'event' ? '📅 Event' : '📝 Assignment'}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: '#717182' }}>
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(task.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddTask(true)}
        className="fixed bottom-24 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        style={{ backgroundColor: '#AA3BD1' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#AA3BD1'}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md mx-auto">
            <h3 className="font-semibold mb-4" style={{ color: '#2C2E4A' }}>Add New Task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-3 focus:outline-none"
              style={{ borderColor: '#e5e7eb' }}
              onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => setTaskType('event')}
                className={`py-3 rounded-lg border-2 font-medium transition-colors ${
                  taskType === 'event'
                    ? ''
                    : ''
                }`}
                style={taskType === 'event' ? { borderColor: '#AA3BD1', backgroundColor: '#F9F5FF', color: '#7C3AED' } : { borderColor: '#e5e7eb', color: '#2C2E4A' }}
              >
                📅 Event
              </button>
              <button
                onClick={() => setTaskType('assignment')}
                className={`py-3 rounded-lg border-2 font-medium transition-colors ${
                  taskType === 'assignment'
                    ? ''
                    : ''
                }`}
                style={taskType === 'assignment' ? { borderColor: '#AA3BD1', backgroundColor: '#F9F5FF', color: '#7C3AED' } : { borderColor: '#e5e7eb', color: '#2C2E4A' }}
              >
                📝 Assignment
              </button>
            </div>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none"
              style={{ borderColor: '#e5e7eb' }}
              onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e5e7eb', color: '#2C2E4A' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#2C2E4A' }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}