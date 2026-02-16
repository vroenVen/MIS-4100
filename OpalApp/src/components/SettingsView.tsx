import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { WeeklyScheduleSetup, WeeklySchedule } from './WeeklyScheduleSetup';
import { OpalLogo } from './OpalLogo';

type ProductivityTime = 'morning' | 'midday' | 'evening' | 'night';

export function SettingsView() {
  const [productivityTime, setProductivityTime] = useState<ProductivityTime>('morning');
  const [showScheduleEdit, setShowScheduleEdit] = useState(false);
  const [showProductivityEdit, setShowProductivityEdit] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  useEffect(() => {
    const savedProductivity = localStorage.getItem('productivityTime');
    if (savedProductivity) {
      setProductivityTime(savedProductivity as ProductivityTime);
    }

    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedSchedule) {
      setWeeklySchedule(JSON.parse(savedSchedule));
    }
  }, []);

  const handleProductivityUpdate = (time: ProductivityTime) => {
    setProductivityTime(time);
    localStorage.setItem('productivityTime', time);
    setShowProductivityEdit(false);
  };

  const handleScheduleUpdate = (schedule: WeeklySchedule) => {
    setWeeklySchedule(schedule);
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
    setShowScheduleEdit(false);
  };

  const getProductivityLabel = () => {
    const labels = {
      morning: 'Morning (6am - 12pm)',
      midday: 'Midday (12pm - 5pm)',
      evening: 'Evening (5pm - 9pm)',
      night: 'Night (9pm - 12am)'
    };
    return labels[productivityTime];
  };

  const getTotalScheduleEvents = () => {
    return Object.values(weeklySchedule).reduce((total, events) => total + events.length, 0);
  };

  if (showScheduleEdit) {
    return (
      <WeeklyScheduleSetup
        initialSchedule={weeklySchedule}
        onComplete={handleScheduleUpdate}
        showBackButton
        onBack={() => setShowScheduleEdit(false)}
      />
    );
  }

  if (showProductivityEdit) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#fdfcfa' }}>
        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => setShowProductivityEdit(false)}
            className="mb-6 flex items-center gap-2 transition-all"
            style={{ color: '#AA3BD1' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C2E4A' }}>Peak Productivity Time</h2>

          <div className="space-y-3">
            {[
              { value: 'morning', label: 'Morning', time: '6am - 12pm', icon: '🌅' },
              { value: 'midday', label: 'Midday', time: '12pm - 5pm', icon: '☀️' },
              { value: 'evening', label: 'Evening', time: '5pm - 9pm', icon: '🌆' },
              { value: 'night', label: 'Night', time: '9pm - 12am', icon: '🌙' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleProductivityUpdate(option.value as ProductivityTime)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  productivityTime === option.value
                    ? ''
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={productivityTime === option.value ? { borderColor: '#AA3BD1', backgroundColor: '#F9F5FF' } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#2C2E4A' }}>{option.label}</div>
                    <div className="text-sm" style={{ color: '#717182' }}>{option.time}</div>
                  </div>
                  {productivityTime === option.value && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#AA3BD1' }}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <OpalLogo size="sm" showText={false} />
        <h1 className="text-3xl font-bold mb-2 mt-4" style={{ color: '#2C2E4A' }}>Settings</h1>
        <p style={{ color: '#717182' }}>Manage your preferences</p>
      </div>

      <div className="space-y-4">
        {/* Productivity Time Setting */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowProductivityEdit(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold mb-1" style={{ color: '#2C2E4A' }}>Peak Productivity Time</h3>
              <p className="text-sm" style={{ color: '#717182' }}>{getProductivityLabel()}</p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#AA3BD1' }} />
          </button>
        </div>

        {/* Weekly Schedule Setting */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowScheduleEdit(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold mb-1" style={{ color: '#2C2E4A' }}>Weekly Schedule</h3>
              <p className="text-sm" style={{ color: '#717182' }}>
                {getTotalScheduleEvents()} Recurring Events
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#AA3BD1' }} />
          </button>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mt-8">
          <h3 className="font-semibold mb-3" style={{ color: '#2C2E4A' }}>About</h3>
          <div className="space-y-2 text-sm" style={{ color: '#717182' }}>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Data Storage</span>
              <span className="font-medium">Local</span>
            </div>
          </div>
        </div>

        {/* Clear Data */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}