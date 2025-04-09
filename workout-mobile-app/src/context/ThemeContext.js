import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  useSystemTheme: false,
  setUseSystemTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preferences from storage on mount
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const storedThemePrefs = await AsyncStorage.getItem('themePreferences');
        if (storedThemePrefs) {
          const { isDarkMode: storedDarkMode, useSystemTheme: storedUseSystem } = JSON.parse(storedThemePrefs);
          setUseSystemTheme(storedUseSystem);
          
          if (storedUseSystem) {
            setIsDarkMode(systemColorScheme === 'dark');
          } else {
            setIsDarkMode(storedDarkMode);
          }
        } else {
          // Default to system theme if no stored preferences
          setUseSystemTheme(true);
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreferences();
  }, []);

  // Update theme when system theme changes if useSystemTheme is true
  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);

  // Save theme preferences to storage when they change
  useEffect(() => {
    if (!isLoading) {
      const saveThemePreferences = async () => {
        try {
          await AsyncStorage.setItem(
            'themePreferences',
            JSON.stringify({ isDarkMode, useSystemTheme })
          );
        } catch (error) {
          console.error('Error saving theme preferences:', error);
        }
      };

      saveThemePreferences();
    }
  }, [isDarkMode, useSystemTheme, isLoading]);

  const toggleTheme = () => {
    if (!useSystemTheme) {
      setIsDarkMode(prev => !prev);
    }
  };

  const toggleUseSystemTheme = () => {
    const newUseSystemValue = !useSystemTheme;
    setUseSystemTheme(newUseSystemValue);
    
    if (newUseSystemValue) {
      // If switching to system theme, immediately adopt system preference
      setIsDarkMode(systemColorScheme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        useSystemTheme,
        toggleUseSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
