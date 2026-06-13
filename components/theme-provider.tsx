"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  themeTransitionActive: boolean;
  setThemeTransitionActive: (active: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_EVENT = "site-theme-change";

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => "light");
  const [themeTransitionActive, setThemeTransitionActive] = useState(false);

  const setTheme = useCallback(
    (theme: Theme) => {
      if (themeTransitionActive) return;
      applyTheme(theme);
    },
    [themeTransitionActive],
  );

  const toggleTheme = useCallback(() => {
    if (themeTransitionActive) return;
    applyTheme(getTheme() === "light" ? "dark" : "light");
  }, [themeTransitionActive]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        themeTransitionActive,
        setThemeTransitionActive,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
