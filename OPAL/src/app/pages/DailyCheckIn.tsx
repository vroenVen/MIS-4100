import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { PageHeader } from "../components/PageHeader";

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
      className="min-h-screen p-6 flex flex-col items-center justify-center"
      style={{ backgroundColor, color: textColor }}
    >
      <PageHeader />
      <div className="w-full max-w-md">
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
                  border: '2px solid #000000',
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
            border: '2px solid #000000',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}