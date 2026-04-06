import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router";
import { CheckCircle2, Circle, Battery, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";
import { format, isToday } from "date-fns";
import { PriorityBadge } from "../components/PriorityBadge";
import { capitalizeFirstLetter } from "../utils/stringHelpers";

export default function Home() {
  const { userData, tasks, updateTask } = useApp();
  const { theme, darkMode } = useTheme();
  const navigate = useNavigate();

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const todayTasks = tasks.filter(task => {
    if (!task.date) return false;
    return isToday(new Date(task.date));
  });

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;

  const getEnergyIcon = (energy?: number) => {
    if (!energy) return <Battery className="w-5 h-5" />;
    if (energy <= 2) return <BatteryLow className="w-5 h-5" />;
    if (energy <= 3) return <BatteryMedium className="w-5 h-5" />;
    return <BatteryFull className="w-5 h-5" />;
  };

  const toggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{capitalizeFirstLetter(userData.name)}'s Dashboard</h1>
          <p className="opacity-70">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>

        {/* Energy Level */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.textOnPrimary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Today's Energy</div>
              <div className="text-2xl font-bold">
                {userData.todayEnergy ? `${userData.todayEnergy}/5` : 'Not set'}
              </div>
            </div>
            <div>{getEnergyIcon(userData.todayEnergy)}</div>
          </div>
        </div>

        {/* Progress */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.secondary,
            color: theme.textOnSecondary,
          }}
        >
          <div className="text-sm opacity-80 mb-2">Today's Progress</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold">{completedToday}</div>
            <div className="text-xl opacity-70 mb-0.5">/ {totalToday} tasks</div>
          </div>
          {totalToday > 0 && (
            <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.primary, opacity: 0.3 }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(completedToday / totalToday) * 100}%`,
                  backgroundColor: theme.textOnSecondary,
                }}
              />
            </div>
          )}
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm px-3 py-1 rounded-lg"
              style={{
                backgroundColor: theme.colors.tertiary,
                color: theme.textOnTertiary,
              }}
            >
              View All
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div
              className="p-6 rounded-lg text-center"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
              }}
            >
              <p className="opacity-70">No tasks scheduled for today</p>
              <button
                onClick={() => navigate('/tasks')}
                className="mt-3 px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.textOnPrimary,
                }}
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.textOnSecondary,
                  }}
                >
                  <button
                    onClick={() => toggleTask(task.id, !task.completed)}
                    style={{ color: theme.textOnSecondary }}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}
                  >
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} size="small" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Productivity Tip */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.tertiary,
            color: theme.textOnTertiary,
          }}
        >
          <div className="text-sm opacity-80 mb-1">💡 Productivity Tip</div>
          <p>
            You're most productive in the <strong>{capitalizeFirstLetter(userData.productivityTime)}</strong>. 
            Schedule important tasks during this time!
          </p>
        </div>
      </div>
    </div>
  );
}