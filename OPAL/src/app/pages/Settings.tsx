import { useState } from "react";
import { useApp, RecurringEvent } from "../contexts/AppContext";
import { useTheme, ThemeName } from "../contexts/ThemeContext";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export default function Settings() {
  const { userData, updateUserData } = useApp();
  const { theme, themeName, setTheme, darkMode, setDarkMode } = useTheme();
  
  const [name, setName] = useState(userData.name);
  const [productivityTime, setProductivityTime] = useState(userData.productivityTime);
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>(userData.recurringEvents);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDay, setNewEventDay] = useState("Monday");
  const [newEventTime, setNewEventTime] = useState("");

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const themes: { name: ThemeName; display: string; emoji: string }[] = [
    { name: 'cat', display: 'Cat', emoji: '🐱' },
    { name: 'dragonfly', display: 'Dragonfly', emoji: '🦟' },
    { name: 'bear', display: 'Bear', emoji: '🐻' },
    { name: 'fish', display: 'Fish', emoji: '🐟' },
    { name: 'bunny', display: 'Bunny', emoji: '🐰' },
    { name: 'fox', display: 'Fox', emoji: '🦊' },
  ];

  const handleAddEvent = () => {
    if (newEventTitle && newEventTime) {
      setRecurringEvents([
        ...recurringEvents,
        {
          id: Date.now().toString(),
          title: newEventTitle,
          day: newEventDay,
          time: newEventTime,
        },
      ]);
      setNewEventTitle("");
      setNewEventTime("");
    }
  };

  const handleDeleteEvent = (id: string) => {
    setRecurringEvents(recurringEvents.filter(event => event.id !== id));
  };

  const handleSave = () => {
    updateUserData({
      name,
      productivityTime,
      recurringEvents,
    });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <PageHeader />
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.textOnSecondary,
              border: '2px solid #000000',
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: darkMode ? theme.surface : theme.background,
                    color: darkMode ? theme.surfaceText : theme.text,
                    borderColor: theme.colors.primary,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Most Productive Time</label>
                <select
                  value={productivityTime}
                  onChange={(e) => setProductivityTime(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: darkMode ? theme.surface : theme.background,
                    color: darkMode ? theme.surfaceText : theme.text,
                    borderColor: theme.colors.primary,
                  }}
                >
                  <option value="morning">Morning</option>
                  <option value="midday">Midday</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recurring Events */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.textOnSecondary,
              border: '2px solid #000000',
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Recurring Events</h2>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event name"
                className="w-full px-3 py-2 rounded border-2"
                style={{
                  backgroundColor: darkMode ? theme.surface : theme.background,
                  color: darkMode ? theme.surfaceText : theme.text,
                  borderColor: theme.colors.primary,
                }}
              />
              
              <select
                value={newEventDay}
                onChange={(e) => setNewEventDay(e.target.value)}
                className="w-full px-3 py-2 rounded border-2"
                style={{
                  backgroundColor: darkMode ? theme.surface : theme.background,
                  color: darkMode ? theme.surfaceText : theme.text,
                  borderColor: theme.colors.primary,
                }}
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full px-3 py-2 rounded border-2"
                style={{
                  backgroundColor: darkMode ? theme.surface : theme.background,
                  color: darkMode ? theme.surfaceText : theme.text,
                  borderColor: theme.colors.primary,
                }}
              />

              <button
                onClick={handleAddEvent}
                className="w-full py-2 rounded flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.colors.tertiary,
                  color: theme.textOnTertiary,
                  border: '2px solid #000000',
                }}
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>

            {recurringEvents.length > 0 && (
              <div className="space-y-2">
                {recurringEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded"
                    style={{
                      backgroundColor: darkMode ? theme.surface : theme.background,
                      color: darkMode ? theme.surfaceText : theme.text,
                      border: '2px solid #000000',
                    }}
                  >
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-70">{event.day} at {event.time}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appearance */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.textOnSecondary,
              border: '2px solid #000000',
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: darkMode ? theme.colors.primary : theme.colors.tertiary,
                    color: darkMode ? theme.textOnPrimary : theme.textOnTertiary,
                    border: '2px solid #000000',
                  }}
                >
                  {darkMode ? 'On' : 'Off'}
                </button>
              </div>

              <div>
                <label className="block text-sm mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      className="p-3 rounded-lg text-center transition-all"
                      style={{
                        backgroundColor: themeName === t.name ? theme.colors.primary : theme.colors.tertiary,
                        color: themeName === t.name ? theme.textOnPrimary : theme.textOnTertiary,
                        borderWidth: '2px',
                        borderColor: '#000000',
                      }}
                    >
                      <div className="text-2xl mb-1">{t.emoji}</div>
                      <div className="text-sm">{t.display}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-lg font-semibold text-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.textOnPrimary,
              border: '2px solid #000000',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}