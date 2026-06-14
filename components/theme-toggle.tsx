"use client";

import { useSyncExternalStore } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useHapticFeedback } from "./use-haptic-feedback";
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
  const { hapticNudge } = useHapticFeedback();
  const isDark = theme === "dark";

  if (!isClient) {
    return <div className="size-7 shrink-0 sm:size-9" aria-hidden />;
  }

  return (
    <div
      className={
        themeTransitionActive
          ? "pointer-events-none cursor-not-allowed opacity-50"
          : "cursor-pointer text-white opacity-60 transition-opacity duration-100 ease-in-out hover:opacity-100"
      }
      aria-disabled={themeTransitionActive}
    >
      <DarkModeSwitch
        checked={isDark}
        onChange={(checked) => {
          if (themeTransitionActive) return;
          setTheme(checked ? "dark" : "light");
          hapticNudge();
        }}
        size={36}
        sunColor="#ffffff"
        moonColor="#ffffff"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
    </div>
  );
}
