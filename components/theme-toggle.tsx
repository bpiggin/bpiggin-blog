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
    return <div className="size-7 shrink-0 sm:size-9" aria-hidden />;
  }

  return (
    <div
      className={
        themeTransitionActive
          ? "pointer-events-none cursor-not-allowed opacity-50"
          : "cursor-pointer text-site opacity-60 transition-[color,opacity] duration-100 ease-in-out hover:text-[#f5eacf] hover:opacity-100"
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
        sunColor="currentColor"
        moonColor="currentColor"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
    </div>
  );
}
