"use client";

import { LoadingScreen } from "./loading-screen";
import { SiteReadyProvider } from "./site-ready-provider";
import { SiteShell } from "./site-shell";
import { ThemeBackground } from "./theme-background";

export function HomePage() {
  return (
    <SiteReadyProvider>
      <div className="relative h-dvh overflow-hidden">
        <ThemeBackground />
        <LoadingScreen />
        <SiteShell />
      </div>
    </SiteReadyProvider>
  );
}
