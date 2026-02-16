import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: 'event' | 'assignment';
  date: string;
  completed: boolean;
}

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<any>({});

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedSchedule) {
      setWeeklySchedule(JSON.parse(savedSchedule));
    }
  }, []);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      new Date(task.date).toDateString() === date.toDateString()
    );
  };

  const getScheduleForDate = (date: Date) => {
    const dayName = fullDayNames[date.getDay()];
    return weeklySchedule[dayName] || [];
  };

  const hasEvents = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const tasksOnDay = getTasksForDate(date);
    const scheduleOnDay = getScheduleForDate(date);
    return tasksOnDay.length > 0 || scheduleOnDay.length > 0;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateSchedule = getScheduleForDate(selectedDate);

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <div className="text-sm font-semibold text-blue-600 mb-1">OPAL</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">View your schedule and tasks</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();
            const hasEventsOnDay = hasEvents(day);
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                {day}
                {hasEventsOnDay && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-blue-600'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-20">
        <h3 className="font-semibold text-gray-900 mb-4">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>

        {/* Weekly Schedule Events */}
        {selectedDateSchedule.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regular Schedule</h4>
            <div className="space-y-2">
              {selectedDateSchedule.map((event: ScheduleEvent) => (
                <div key={event.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="font-medium text-purple-900">{event.title}</div>
                  <div className="text-sm text-purple-700">{event.startTime} - {event.endTime}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {selectedDateTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks</h4>
            <div className="space-y-2">
              {selectedDateTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.type === 'event'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-orange-50 border-orange-200'
                  } ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className={`font-medium ${
                    task.type === 'event' ? 'text-blue-900' : 'text-orange-900'
                  } ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </div>
                  <div className={`text-sm ${
                    task.type === 'event' ? 'text-blue-700' : 'text-orange-700'
                  }`}>
                    {task.type === 'event' ? '📅 Event' : '📝 Assignment'}
                    {task.completed && ' • Completed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDateTasks.length === 0 && selectedDateSchedule.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No events or tasks scheduled</p>
        )}
      </div>
    </div>
  );
}