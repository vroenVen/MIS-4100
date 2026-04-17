import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { capitalizeFirstLetter } from "../utils/stringHelpers";
import { PageHeader } from "../components/PageHeader";
import { PriorityBadge } from "../components/PriorityBadge";

export default function Calendar() {
  const { userData, tasks, calendarView, setCalendarView } = useApp();
  const { theme, darkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const handlePrev = () => {
    if (calendarView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (calendarView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const getTitle = () => {
    if (calendarView === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (calendarView === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  const getDaysToShow = () => {
    if (calendarView === 'month') {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    } else if (calendarView === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
    } else {
      return [currentDate];
    }
  };

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.date) return false;
      return isSameDay(parseISO(task.date), day);
    });
  };

  const getSuggestedTasks = () => {
    const unscheduledTasks = tasks.filter(task => !task.date && !task.completed);
    const productivityMap = {
      morning: '9:00 AM - 12:00 PM',
      midday: '12:00 PM - 3:00 PM',
      evening: '3:00 PM - 6:00 PM',
      night: '6:00 PM - 9:00 PM',
    };

    if (unscheduledTasks.length === 0) {
      return null;
    }

    return (
      <div
        className="p-4 rounded-lg mb-4"
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.textOnPrimary,
          border: '2px solid #000000',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Circle className="w-5 h-5" />
          <h3 className="font-semibold">Suggested Tasks</h3>
        </div>
        <p className="text-sm opacity-90 mb-3">
          Schedule these during your peak time: {productivityMap[userData.productivityTime]}
        </p>
        <div className="space-y-2">
          {unscheduledTasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              className="text-sm p-2 rounded"
              style={{
                backgroundColor: darkMode ? theme.surface : theme.background,
                color: darkMode ? theme.surfaceText : theme.text,
                border: '2px solid #000000',
              }}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const days = getDaysToShow();

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <PageHeader />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{capitalizeFirstLetter(userData.name)}'s Calendar</h1>

          {/* View Selector */}
          <div className="flex gap-2 mb-4">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: calendarView === view ? theme.colors.primary : theme.colors.secondary,
                  color: calendarView === view ? theme.textOnPrimary : theme.textOnSecondary,
                  border: '2px solid #000000',
                }}
              >
                {capitalizeFirstLetter(view)}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
                border: '2px solid #000000',
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">{getTitle()}</h2>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
                border: '2px solid #000000',
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {getSuggestedTasks()}

        {/* Calendar Grid */}
        <div className="space-y-3">
          {calendarView === 'month' && (
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold py-2"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {day}
                </div>
              ))}
            </div>
          )}

          <div className={calendarView === 'month' ? 'grid grid-cols-7 gap-2' : 'space-y-3'}>
            {days.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isTodayDate = isToday(day);

              if (calendarView === 'month') {
                return (
                  <div
                    key={day.toString()}
                    className="aspect-square p-2 rounded-lg text-sm relative"
                    style={{
                      backgroundColor: isTodayDate
                        ? theme.colors.primary
                        : theme.colors.secondary,
                      color: isTodayDate
                        ? theme.textOnPrimary
                        : theme.textOnSecondary,
                      border: '2px solid #000000',
                    }}
                  >
                    <div className="font-semibold mb-1">{format(day, 'd')}</div>
                    {dayTasks.length > 0 && (
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className="text-xs truncate px-1 py-0.5 rounded"
                            style={{
                              backgroundColor: darkMode ? theme.surface : theme.background,
                              color: darkMode ? theme.surfaceText : theme.text,
                              opacity: task.completed ? 0.5 : 1,
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs opacity-70">+{dayTasks.length - 2} more</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={day.toString()}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: isTodayDate
                        ? theme.colors.primary
                        : theme.colors.secondary,
                      color: isTodayDate
                        ? theme.textOnPrimary
                        : theme.textOnSecondary,
                      border: '2px solid #000000',
                    }}
                  >
                    <div className="font-semibold mb-3">
                      {calendarView === 'week' ? format(day, 'EEE, MMM d') : format(day, 'EEEE')}
                    </div>
                    {dayTasks.length === 0 ? (
                      <div className="text-sm opacity-70">No tasks scheduled</div>
                    ) : (
                      <div className="space-y-2">
                        {dayTasks.map(task => (
                          <div
                            key={task.id}
                            className="p-2 rounded text-sm flex items-start justify-between gap-2"
                            style={{
                              backgroundColor: darkMode ? theme.surface : theme.background,
                              color: darkMode ? theme.surfaceText : theme.text,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              opacity: task.completed ? 0.6 : 1,
                              border: '2px solid #000000',
                            }}
                          >
                            <div className="flex-1">
                              {task.title}
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="text-xs opacity-70 mt-1">
                                  {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks
                                </div>
                              )}
                            </div>
                            <PriorityBadge priority={task.priority} size="small" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}