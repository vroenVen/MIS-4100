import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";

export default function DailyCheckIn() {
  const { updateUserData } = useApp();
  const { theme, darkMode } = useTheme();
  const navigate = useNavigate();
  const [energy, setEnergy] = useState<number>(3);

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const handleSubmit = () => {
    const today = new Date().toDateString();
    updateUserData({
      lastCheckInDate: today,
      todayEnergy: energy,
    });
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Good morning! ☀️</h1>
        <p className="text-xl mb-8 opacity-80">How much energy do you have today?</p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setEnergy(level)}
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all"
                style={{
                  backgroundColor: energy === level ? theme.colors.primary : theme.colors.secondary,
                  color: energy === level ? theme.textOnPrimary : theme.textOnSecondary,
                  transform: energy === level ? 'scale(1.1)' : 'scale(1)',
                  borderWidth: '3px',
                  borderColor: energy === level ? theme.colors.primary : 'transparent',
                }}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm opacity-70 px-2">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-semibold text-lg"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.textOnPrimary,
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
