import { useState, useEffect } from 'react';
import { OpalLogo } from './OpalLogo';

interface DailyEnergyCheckProps {
  onComplete: () => void;
}

export function DailyEnergyCheck({ onComplete }: DailyEnergyCheckProps) {
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const handleSubmit = () => {
    if (energyLevel) {
      const today = new Date().toDateString();
      localStorage.setItem('lastEnergyCheck', today);
      
      // Save energy level with date
      const energyHistory = JSON.parse(localStorage.getItem('energyHistory') || '[]');
      energyHistory.push({
        date: today,
        level: energyLevel,
        timestamp: Date.now()
      });
      localStorage.setItem('energyHistory', JSON.stringify(energyHistory));
      
      onComplete();
    }
  };

  const energyOptions = [
    { value: 1, label: 'Very Low', emoji: '😴' },
    { value: 2, label: 'Low', emoji: '😔' },
    { value: 3, label: 'Moderate', emoji: '😐' },
    { value: 4, label: 'High', emoji: '😊' },
    { value: 5, label: 'Very High', emoji: '🚀' }
  ];

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #F3E8FF 0%, #fdfcfa 100%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <OpalLogo size="md" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2C2E4A' }}>
            Good Morning{userName ? `, ${userName}` : ''}! ☀️
          </h1>
          <p style={{ color: '#717182' }}>How much energy do you have today?</p>
        </div>

        <div className="space-y-3 mb-8">
          {energyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setEnergyLevel(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                energyLevel === option.value
                  ? 'scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={energyLevel === option.value ? { borderColor: '#AA3BD1', backgroundColor: '#F9F5FF' } : {}}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{option.emoji}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold" style={{ color: '#2C2E4A' }}>{option.value} - {option.label}</div>
                </div>
                {energyLevel === option.value && (
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

        <button
          onClick={handleSubmit}
          disabled={!energyLevel}
          className="w-full py-4 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: !energyLevel ? '#e5e7eb' : '#2C2E4A' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}