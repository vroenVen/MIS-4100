import { useState, useEffect } from 'react';
import { IntakeSurvey } from './components/IntakeSurvey';
import { DailyEnergyCheck } from './components/DailyEnergyCheck';
import { MainApp } from './components/MainApp';

export default function App() {

    const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/messages/")
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // return (
  //   <div>
  //     <h1>Messages</h1>
  //     {messages.map((msg) => (
  //       <p key={msg.id}>{msg.text}</p>
  //     ))}
  //   </div>
  // );



  const [hasCompletedIntake, setHasCompletedIntake] = useState(false);
  const [needsDailyCheck, setNeedsDailyCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed intake survey
    const intakeData = localStorage.getItem('intakeComplete');
    setHasCompletedIntake(!!intakeData);

    // Check if user needs daily energy check
    const lastCheckDate = localStorage.getItem('lastEnergyCheck');
    const today = new Date().toDateString();
    setNeedsDailyCheck(lastCheckDate !== today && !!intakeData);

    setIsLoading(false);
  }, []);

  const handleIntakeComplete = () => {
    setHasCompletedIntake(true);
    setNeedsDailyCheck(true);
  };

  const handleDailyCheckComplete = () => {
    setNeedsDailyCheck(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdfcfa' }}>
        <div style={{ color: '#2C2E4A' }}>Loading...</div>
      </div>
    );
  }

  if (!hasCompletedIntake) {
    return <IntakeSurvey onComplete={handleIntakeComplete} />;
  }

  if (needsDailyCheck) {
    return <DailyEnergyCheck onComplete={handleDailyCheckComplete} />;
  }

  return <MainApp />;
}