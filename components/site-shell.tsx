"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ContentPanel } from "./content-panel";
import { useSiteReady } from "./site-ready-provider";
import { SiteHeader } from "./site-header";
import { ThemeToggle } from "./theme-toggle";

export type PanelId = "about" | "experience" | "links";

type View = "header" | PanelId;

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

export function SiteShell() {
  const { isSiteReady } = useSiteReady();
  const [view, setView] = useState<View>("header");

  return (
    <>
      <AnimatePresence>
        {isSiteReady && (
          <motion.div
            key="theme-toggle"
            className="pointer-events-none fixed top-8 right-8 z-30"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isSiteReady && view === "header" ? (
          <motion.div
            key="header"
            className="absolute inset-0 z-10 flex flex-col px-8 py-8"
            initial={{ x: "-100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 0, y: "-100%" }}
            transition={spring}
          >
            <SiteHeader onOpenPanel={(panel) => setView(panel)} />
          </motion.div>
        ) : isSiteReady && view !== "header" ? (
          <motion.div
            key={view}
            className="absolute inset-0 z-10"
            initial={{ x: "-100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 0, y: "-100%" }}
            transition={spring}
          >
            <ContentPanel panel={view} onClose={() => setView("header")} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
