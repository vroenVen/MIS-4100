import { useState } from 'react';
import { WeeklyScheduleSetup } from './WeeklyScheduleSetup';
import { OpalLogo } from './OpalLogo';

interface IntakeSurveyProps {
  onComplete: () => void;
}

type ProductivityTime = 'morning' | 'midday' | 'evening' | 'night';

export function IntakeSurvey({ onComplete }: IntakeSurveyProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [productivityTime, setProductivityTime] = useState<ProductivityTime | null>(null);

  const handleProductivitySelect = (time: ProductivityTime) => {
    setProductivityTime(time);
  };

  const handleNameNext = () => {
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
      setStep(2);
    }
  };

  const handleNextStep = () => {
    if (productivityTime) {
      localStorage.setItem('productivityTime', productivityTime);
      setStep(3);
    }
  };

  const handleScheduleComplete = (schedule: any) => {
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
    localStorage.setItem('intakeComplete', 'true');
    onComplete();
  };

  if (step === 3) {
    return <WeeklyScheduleSetup onComplete={handleScheduleComplete} />;
  }

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex flex-col" style={{ background: 'linear-gradient(180deg, #E8F5F7 0%, #fdfcfa 100%)' }}>
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-12">
          <div className="mb-6">
            <OpalLogo size="sm" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2C2E4A' }}>Welcome!</h1>
          <p className="mb-8" style={{ color: '#717182' }}>Let's personalize your experience</p>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>✓</div>
              <div className="flex-1 h-1" style={{ backgroundColor: '#AA3BD1' }}></div>
              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>2</div>
              <div className="flex-1 h-1 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full text-gray-500 flex items-center justify-center text-sm font-semibold bg-gray-200">3</div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#2C2E4A' }}>
              When are you most productive during the day?
            </h2>

            <div className="space-y-3">
              {[
                { value: 'morning', label: 'Morning', time: '6am - 12pm', icon: '🌅' },
                { value: 'midday', label: 'Midday', time: '12pm - 5pm', icon: '☀️' },
                { value: 'evening', label: 'Evening', time: '5pm - 9pm', icon: '🌆' },
                { value: 'night', label: 'Night', time: '9pm - 12am', icon: '🌙' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleProductivitySelect(option.value as ProductivityTime)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    productivityTime === option.value
                      ? 'bg-white'
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

          <button
            onClick={handleNextStep}
            disabled={!productivityTime}
            className="w-full py-4 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-8"
            style={{ backgroundColor: !productivityTime ? '#e5e7eb' : '#2C2E4A' }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col" style={{ background: 'linear-gradient(180deg, #E8F5F7 0%, #fdfcfa 100%)' }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-12">
        <div className="mb-6">
          <OpalLogo size="sm" />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2C2E4A' }}>Welcome!</h1>
        <p className="mb-8" style={{ color: '#717182' }}>Let's personalize your experience</p>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#AA3BD1' }}>1</div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full text-gray-500 flex items-center justify-center text-sm font-semibold bg-gray-200">2</div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full text-gray-500 flex items-center justify-center text-sm font-semibold bg-gray-200">3</div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#2C2E4A' }}>
            What's your name?
          </h2>
          <p className="mb-6" style={{ color: '#717182' }}>We'll use this to personalize your experience</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNameNext()}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none text-lg"
            style={{ borderColor: '#e5e7eb' }}
            onFocus={(e) => e.target.style.borderColor = '#AA3BD1'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            autoFocus
          />
        </div>

        <button
          onClick={handleNameNext}
          disabled={!userName.trim()}
          className="w-full py-4 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-8"
          style={{ backgroundColor: !userName.trim() ? '#e5e7eb' : '#2C2E4A' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}