import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  primary: string;
  secondary: string;
  danger: string;
  placeholder: string;
}

interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

interface ThemeContextValue extends Theme {
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f2f2f2',
  text: '#000000',
  primary: '#27ae60',
  secondary: '#555555',
  danger: '#e74c3c',
  placeholder: '#888888',
};

const darkColors: ThemeColors = {
  background: '#181818',
  surface: '#232323',
  text: '#ffffff',
  primary: '#27ae60',
  secondary: '#555555',
  danger: '#e74c3c',
  placeholder: '#777777',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('themeMode');
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      } else {
        const system = Appearance.getColorScheme();
        setMode(system === 'light' ? 'light' : 'dark');
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    await AsyncStorage.setItem('themeMode', newMode);
  };

  const value: ThemeContextValue = {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};


export default ThemeProvider;
