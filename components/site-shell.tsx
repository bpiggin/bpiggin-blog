"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ContentPanel } from "./content-panel";
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
  const [view, setView] = useState<View>("header");

  return (
    <>
      <div className="pointer-events-none fixed top-8 right-8 z-30">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "header" ? (
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
        ) : (
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
        )}
      </AnimatePresence>
    </>
  );
}
