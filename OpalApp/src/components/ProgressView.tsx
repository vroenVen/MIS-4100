import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DailyProgress {
  date: string;
  completed: number;
  total: number;
}

interface EnergyEntry {
  date: string;
  level: number;
  timestamp: number;
}

export function ProgressView() {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [energyHistory, setEnergyHistory] = useState<EnergyEntry[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('dailyProgress');
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    }

    const savedEnergy = localStorage.getItem('energyHistory');
    if (savedEnergy) {
      setEnergyHistory(JSON.parse(savedEnergy));
    }
  }, []);

  const getLast7Days = () => {
    const days: DailyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const existing = dailyProgress.find(p => p.date === dateString);
      days.push(existing || { date: dateString, completed: 0, total: 0 });
    }
    return days;
  };

  const last7Days = getLast7Days();
  
  const totalCompleted = last7Days.reduce((sum, day) => sum + day.completed, 0);
  const totalTasks = last7Days.reduce((sum, day) => sum + day.total, 0);
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const avgEnergy = energyHistory.length > 0
    ? (energyHistory.reduce((sum, entry) => sum + entry.level, 0) / energyHistory.length).toFixed(1)
    : '0';

  const recentEnergy = energyHistory.slice(-7);
  const lastWeekAvg = recentEnergy.length > 0
    ? recentEnergy.reduce((sum, entry) => sum + entry.level, 0) / recentEnergy.length
    : 0;
  const previousWeekEntries = energyHistory.slice(-14, -7);
  const previousWeekAvg = previousWeekEntries.length > 0
    ? previousWeekEntries.reduce((sum, entry) => sum + entry.level, 0) / previousWeekEntries.length
    : 0;

  const energyTrend = lastWeekAvg > previousWeekAvg ? 'up' : lastWeekAvg < previousWeekAvg ? 'down' : 'stable';

  const maxCompleted = Math.max(...last7Days.map(d => d.completed), 1);

  return (
    <div className="p-6 max-w-md mx-auto pb-20">
      <div className="mb-6">
        <div className="text-sm font-semibold text-blue-600 mb-1">OPAL</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress</h1>
        <p className="text-gray-600">Track your productivity and energy</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
          <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-3xl font-bold text-purple-600">{avgEnergy}</div>
            {energyTrend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
            {energyTrend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
            {energyTrend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
          </div>
          <div className="text-sm text-gray-600">Avg Energy</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
      </div>

      {/* Daily Completions Chart */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tasks Completed (Last 7 Days)</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {last7Days.map((day, index) => {
            const height = day.completed > 0 ? (day.completed / maxCompleted) * 100 : 5;
            const date = new Date(day.date);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end items-center flex-1">
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700 relative group"
                    style={{ height: `${height}%` }}
                  >
                    {day.completed > 0 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.completed}/{day.total}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Levels */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Energy Levels</h3>
        {energyHistory.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No energy data yet. Check in daily to track your energy!
          </p>
        ) : (
          <div className="space-y-2">
            {energyHistory.slice(-7).reverse().map((entry, index) => {
              const energyEmojis = ['😴', '😔', '😐', '😊', '🚀'];
              const energyLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
              const energyColors = [
                'bg-red-100 text-red-700',
                'bg-orange-100 text-orange-700',
                'bg-yellow-100 text-yellow-700',
                'bg-lime-100 text-lime-700',
                'bg-green-100 text-green-700'
              ];
              
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{energyEmojis[entry.level - 1]}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-sm px-2 py-0.5 rounded inline-block ${energyColors[entry.level - 1]}`}>
                      {entry.level} - {energyLabels[entry.level - 1]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Insights</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {totalCompleted > 0 && (
            <li>• You've completed {totalCompleted} tasks this week!</li>
          )}
          {energyHistory.length > 0 && (
            <li>• Your average energy level is {avgEnergy}/5</li>
          )}
          {completionRate >= 80 && (
            <li>• Great job! You're maintaining an {completionRate}% completion rate!</li>
          )}
          {completionRate < 50 && totalTasks > 0 && (
            <li>• Consider breaking tasks into smaller, manageable pieces</li>
          )}
        </ul>
      </div>
    </div>
  );
}