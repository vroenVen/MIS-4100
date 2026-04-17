import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AppProvider, useApp } from "../contexts/AppContext";
import { Home, ListTodo, Calendar as CalendarIcon, Settings, CheckSquare } from "lucide-react";

function RootContent() {
  const { theme, darkMode } = useTheme();
  const { userData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Check onboarding status and daily check-in
  useEffect(() => {
    if (!userData.onboardingComplete && location.pathname !== '/onboarding') {
      navigate('/onboarding');
      return;
    }

    // Check if daily check-in is needed
    const today = new Date().toDateString();
    if (
      userData.onboardingComplete &&
      userData.lastCheckInDate !== today &&
      location.pathname !== '/daily-checkin' &&
      location.pathname !== '/onboarding'
    ) {
      navigate('/daily-checkin');
    }
  }, [userData.onboardingComplete, userData.lastCheckInDate, navigate, location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/lists', icon: ListTodo, label: 'Lists' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Don't show navigation on onboarding or check-in
  const hideNav = location.pathname === '/onboarding' || location.pathname === '/daily-checkin';

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {!hideNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 border-t"
          style={{
            backgroundColor: theme.surface,
            borderTopColor: '#000000',
            borderTopWidth: '2px',
          }}
        >
          <div className="flex justify-around items-center h-16 max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center justify-center flex-1 h-full transition-opacity"
                  style={{
                    color: active ? theme.colors.primary : theme.surfaceText,
                    opacity: active ? 1 : 0.6,
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RootContent />
      </AppProvider>
    </ThemeProvider>
  );
}