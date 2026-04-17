import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, RecurringEvent } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { Plus, Trash2 } from "lucide-react";
import { Logo } from "../components/Logo";

export default function Onboarding() {
  const { updateUserData } = useApp();
  const { theme, darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [productivityTime, setProductivityTime] = useState<'morning' | 'midday' | 'evening' | 'night'>('morning');
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDay, setNewEventDay] = useState("Monday");
  const [newEventTime, setNewEventTime] = useState("");

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;
  const buttonBg = theme.colors.primary;
  const buttonText = theme.textOnPrimary;

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

  const handleFinish = () => {
    updateUserData({
      name,
      productivityTime,
      recurringEvents,
      onboardingComplete: true,
    });
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="large" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to OPal</h1>
        <p className="text-center mb-8 opacity-80">Let's personalize your experience</p>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2">What's your name?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{
                  backgroundColor: darkMode ? theme.background : theme.colors.secondary,
                  color: darkMode ? theme.text : theme.textOnSecondary,
                  borderColor: theme.colors.primary,
                }}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block mb-3">When are you most productive?</label>
              <div className="space-y-2">
                {(['morning', 'midday', 'evening', 'night'] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => setProductivityTime(time)}
                    className="w-full px-4 py-3 rounded-lg text-left transition-all"
                    style={{
                      backgroundColor: productivityTime === time ? theme.colors.primary : theme.colors.secondary,
                      color: productivityTime === time ? theme.textOnPrimary : theme.textOnSecondary,
                      border: '2px solid #000000',
                    }}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name}
              className="w-full py-3 rounded-lg font-semibold disabled:opacity-50"
              style={{
                backgroundColor: buttonBg,
                color: buttonText,
                border: '2px solid #000000',
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Set up your weekly routine</h2>
              <p className="opacity-80 mb-6">Add recurring events that happen every week</p>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event name"
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: darkMode ? theme.background : theme.colors.secondary,
                    color: darkMode ? theme.text : theme.textOnSecondary,
                    borderColor: theme.colors.primary,
                  }}
                />
                
                <select
                  value={newEventDay}
                  onChange={(e) => setNewEventDay(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: darkMode ? theme.background : theme.colors.secondary,
                    color: darkMode ? theme.text : theme.textOnSecondary,
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
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: darkMode ? theme.background : theme.colors.secondary,
                    color: darkMode ? theme.text : theme.textOnSecondary,
                    borderColor: theme.colors.primary,
                  }}
                />

                <button
                  onClick={handleAddEvent}
                  className="w-full py-2 rounded-lg flex items-center justify-center gap-2"
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
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold mb-2">Your recurring events:</h3>
                  {recurringEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.textOnSecondary,
                        border: '2px solid #000000',
                      }}
                    >
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm opacity-80">{event.day} at {event.time}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2"
                        style={{ color: theme.textOnSecondary }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.textOnSecondary,
                  border: '2px solid #000000',
                }}
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: buttonBg,
                  color: buttonText,
                  border: '2px solid #000000',
                }}
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}