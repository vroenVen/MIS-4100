import { useState } from 'react';
import { Home, ListTodo, Calendar, TrendingUp, Settings } from 'lucide-react';
import { TasksView } from './TasksView';
import { ListsView } from './ListsView';
import { CalendarView } from './CalendarView';
import { ProgressView } from './ProgressView';
import { SettingsView } from './SettingsView';

type View = 'tasks' | 'lists' | 'calendar' | 'progress' | 'settings';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('tasks');

  const renderView = () => {
    switch (currentView) {
      case 'tasks':
        return <TasksView />;
      case 'lists':
        return <ListsView />;
      case 'calendar':
        return <CalendarView />;
      case 'progress':
        return <ProgressView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TasksView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fdfcfa' }}>
      <div className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-6 py-3 safe-area-inset-bottom" style={{ borderTop: '1px solid rgba(44, 46, 74, 0.1)' }}>
        <div className="max-w-md mx-auto flex justify-around">
          <button
            onClick={() => setCurrentView('tasks')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors`}
            style={{ color: currentView === 'tasks' ? '#AA3BD1' : '#717182' }}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Tasks</span>
          </button>
          <button
            onClick={() => setCurrentView('lists')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors`}
            style={{ color: currentView === 'lists' ? '#AA3BD1' : '#717182' }}
          >
            <ListTodo className="w-6 h-6" />
            <span className="text-xs font-medium">Lists</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors`}
            style={{ color: currentView === 'calendar' ? '#AA3BD1' : '#717182' }}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors`}
            style={{ color: currentView === 'progress' ? '#AA3BD1' : '#717182' }}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors`}
            style={{ color: currentView === 'settings' ? '#AA3BD1' : '#717182' }}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}