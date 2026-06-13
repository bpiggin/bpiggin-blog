"use client";

import { useSyncExternalStore } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "./theme-provider";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const isClient = useIsClient();
  const { theme, setTheme, themeTransitionActive } = useTheme();
  const isDark = theme === "dark";

  if (!isClient) {
    return <div className="size-9 shrink-0" aria-hidden />;
  }

  return (
    <div
      className={
        themeTransitionActive
          ? "pointer-events-none cursor-not-allowed opacity-50"
          : undefined
      }
      aria-disabled={themeTransitionActive}
    >
      <DarkModeSwitch
        checked={isDark}
        onChange={(checked) => {
          if (themeTransitionActive) return;
          setTheme(checked ? "dark" : "light");
        }}
        size={36}
        sunColor="#ffffff"
        moonColor="#ffffff"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
    </div>
  );
}
