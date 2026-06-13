"use client";

import { createContext, useContext, useState } from "react";

type SiteReadyContextValue = {
  isSiteReady: boolean;
  setSiteReady: (ready: boolean) => void;
};

const SiteReadyContext = createContext<SiteReadyContextValue | null>(null);

export function SiteReadyProvider({ children }: { children: React.ReactNode }) {
  const [isSiteReady, setSiteReady] = useState(false);

  return (
    <SiteReadyContext.Provider value={{ isSiteReady, setSiteReady }}>
      {children}
    </SiteReadyContext.Provider>
  );
}

export function useSiteReady() {
  const context = useContext(SiteReadyContext);
  if (!context) {
    throw new Error("useSiteReady must be used within SiteReadyProvider");
  }
  return context;
}
