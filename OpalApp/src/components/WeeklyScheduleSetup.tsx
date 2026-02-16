import { useState } from 'react';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { OpalLogo } from './OpalLogo';

interface WeeklyScheduleSetupProps {
  onComplete: (schedule: WeeklySchedule) => void;
  initialSchedule?: WeeklySchedule;
  showBackButton?: boolean;
  onBack?: () => void;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface WeeklySchedule {
  [key: string]: ScheduleEvent[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyScheduleSetup({ onComplete, initialSchedule, showBackButton, onBack }: WeeklyScheduleSetupProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(
    initialSchedule || {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    }
  );
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleAddEvent = () => {
    if (eventTitle.trim()) {
      const newEvent: ScheduleEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        startTime,
        endTime
      };
      setSchedule({
        ...schedule,
        [selectedDay]: [...schedule[selectedDay], newEvent].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        )
      });
      setEventTitle('');
      setStartTime('09:00');
      setEndTime('10:00');
      setShowAddEvent(false);
    }
  };

  const handleRemoveEvent = (day: string, eventId: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].filter(event => event.id !== eventId)
    });
  };

  const handleComplete = () => {
    onComplete(schedule);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col" style={{ backgroundColor: '#fdfcfa' }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 transition-all self-start"
            style={{ color: '#AA3BD1' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        )}
        
        {!showBackButton && (
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>✓</div>
              <div className="flex-1 h-1" style={{ backgroundColor: '#AA3BD1' }}></div>
              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>✓</div>
              <div className="flex-1 h-1" style={{ backgroundColor: '#AA3BD1' }}></div>
              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>3</div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2C2E4A' }}>Your Weekly Schedule</h2>
        <p className="mb-6" style={{ color: '#717182' }}>Add your regular activities and events</p>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedDay === day
                  ? 'text-white'
                  : 'bg-white border'
              }`}
              style={selectedDay === day ? { backgroundColor: '#AA3BD1' } : { color: '#2C2E4A', borderColor: 'rgba(44, 46, 74, 0.2)' }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl p-4 shadow-sm mb-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: '#2C2E4A' }}>{selectedDay}</h3>
            <button
              onClick={() => setShowAddEvent(true)}
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: '#AA3BD1' }}
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {schedule[selectedDay].length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#717182' }}>No events scheduled</p>
          ) : (
            <div className="space-y-2">
              {schedule[selectedDay].map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: '#2C2E4A' }}>{event.title}</div>
                    <div className="text-sm" style={{ color: '#717182' }}>{event.startTime} - {event.endTime}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(selectedDay, event.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-white rounded-t-3xl p-6 w-full max-w-md mx-auto">
              <h3 className="font-semibold mb-4" style={{ color: '#2C2E4A' }}>Add Event</h3>
              <input
                type="text"
                placeholder="Event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-3 focus:outline-none"
                style={{ borderColor: '#e5e7eb' }}
                onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2C2E4A' }}>Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2C2E4A' }}>End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#e5e7eb', color: '#2C2E4A' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 py-3 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#2C2E4A' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            className="w-full py-4 text-white rounded-xl font-semibold transition-colors"
            style={{ backgroundColor: '#2C2E4A' }}
          >
            {showBackButton ? 'Save' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}