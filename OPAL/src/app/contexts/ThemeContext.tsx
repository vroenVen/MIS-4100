import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'cat' | 'dragonfly' | 'bear' | 'fish' | 'bunny' | 'fox';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  textOnPrimary: string;
  textOnSecondary: string;
  textOnTertiary: string;
  textOnQuaternary: string;
  background: string;
  text: string;
  surface: string;
  surfaceText: string;
}

export const themes: Record<ThemeName, Theme> = {
  cat: {
    name: 'cat',
    displayName: 'Cat',
    colors: {
      primary: '#F5D0C5',    // Pink
      secondary: '#D69F7E',  // Light Brown
      tertiary: '#774936',   // Brown
      quaternary: '#050609'  // Black
    },
    textOnPrimary: '#050609',      // Black on Pink
    textOnSecondary: '#050609',    // Black on Light Brown
    textOnTertiary: '#F5D0C5',     // Pink on Brown
    textOnQuaternary: '#F5D0C5',   // Pink on Black
    background: '#F5D0C5',
    text: '#050609',
    surface: '#D69F7E',
    surfaceText: '#050609'
  },
  dragonfly: {
    name: 'dragonfly',
    displayName: 'Dragonfly',
    colors: {
      primary: '#E3B505',    // Yellow
      secondary: '#95190C',  // Red
      tertiary: '#610345',   // Purple
      quaternary: '#107E7D'  // Turquoise
    },
    textOnPrimary: '#610345',      // Purple on Yellow
    textOnSecondary: '#E3B505',    // Yellow on Red
    textOnTertiary: '#E3B505',     // Yellow on Purple
    textOnQuaternary: '#E3B505',   // Yellow on Turquoise
    background: '#E3B505',
    text: '#610345',
    surface: '#610345',
    surfaceText: '#E3B505'
  },
  bear: {
    name: 'bear',
    displayName: 'Bear',
    colors: {
      primary: '#D36135',    // Orange
      secondary: '#A24936',  // Brown
      tertiary: '#3E5641',   // Green
      quaternary: '#282B28'  // Black
    },
    textOnPrimary: '#282B28',      // Black on Orange
    textOnSecondary: '#282B28',    // Black on Brown
    textOnTertiary: '#D36135',     // Orange on Green
    textOnQuaternary: '#D36135',   // Orange on Black
    background: '#D36135',
    text: '#282B28',
    surface: '#282B28',
    surfaceText: '#D36135'
  },
  fish: {
    name: 'fish',
    displayName: 'Fish',
    colors: {
      primary: '#4ECDC4',    // Cyan
      secondary: '#FF6B6B',  // Salmon
      tertiary: '#FFFFFF',   // White
      quaternary: '#292F36'  // Black
    },
    textOnPrimary: '#292F36',      // Black on Cyan
    textOnSecondary: '#FFFFFF',    // White on Salmon
    textOnTertiary: '#292F36',     // Black on White
    textOnQuaternary: '#FFFFFF',   // White on Black
    background: '#4ECDC4',
    text: '#292F36',
    surface: '#292F36',
    surfaceText: '#FFFFFF'
  },
  bunny: {
    name: 'bunny',
    displayName: 'Bunny',
    colors: {
      primary: '#DCC48E',    // Tan
      secondary: '#EAEFD3',  // Light Green
      tertiary: '#B3C0A4',   // Mint Green
      quaternary: '#505168'  // Gray-Blue
    },
    textOnPrimary: '#505168',      // Gray-Blue on Tan
    textOnSecondary: '#505168',    // Gray-Blue on Light Green
    textOnTertiary: '#505168',     // Gray-Blue on Mint Green
    textOnQuaternary: '#DCC48E',   // Tan on Gray-Blue
    background: '#EAEFD3',
    text: '#505168',
    surface: '#DCC48E',
    surfaceText: '#505168'
  },
  fox: {
    name: 'fox',
    displayName: 'Fox',
    colors: {
      primary: '#F6F7EB',    // Cream
      secondary: '#E94F37',  // Orange
      tertiary: '#3F88C5',   // Blue
      quaternary: '#393E41'  // Dark Gray
    },
    textOnPrimary: '#393E41',      // Dark Gray on Cream
    textOnSecondary: '#393E41',    // Dark Gray on Orange
    textOnTertiary: '#F6F7EB',     // Cream on Blue
    textOnQuaternary: '#F6F7EB',   // Cream on Dark Gray
    background: '#F6F7EB',
    text: '#393E41',
    surface: '#393E41',
    surfaceText: '#F6F7EB'
  }
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('cat');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('opal-theme') as ThemeName;
    const savedDarkMode = localStorage.getItem('opal-darkmode');
    
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const setTheme = (theme: ThemeName) => {
    setThemeName(theme);
    localStorage.setItem('opal-theme', theme);
  };

  const handleSetDarkMode = (mode: boolean) => {
    setDarkMode(mode);
    localStorage.setItem('opal-darkmode', String(mode));
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, darkMode, setDarkMode: handleSetDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}