"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ContentPanel } from "./content-panel";
import { useSiteReady } from "./site-ready-provider";
import { SiteHeader } from "./site-header";
import { ThemeToggle } from "./theme-toggle";

type View = "header" | "about";

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

const slideLeft = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

export function SiteShell() {
  const { isSiteReady } = useSiteReady();
  const [view, setView] = useState<View>("header");

  const toggleView = () =>
    setView((current) => (current === "header" ? "about" : "header"));

  return (
    <>
      <AnimatePresence>
        {isSiteReady && (
          <motion.div
            key="theme-toggle"
            className="pointer-events-none fixed top-4 right-4 z-30 sm:top-8 sm:right-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <div className="pointer-events-auto origin-top-right scale-[0.72] sm:scale-100">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isSiteReady && view === "header" ? (
          <motion.div
            key="header"
            role="button"
            tabIndex={0}
            onClick={toggleView}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleView();
              }
            }}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-start justify-start px-4 pt-42 pb-8 sm:justify-center sm:px-8 sm:py-8"
            {...slideLeft}
            transition={spring}
          >
            <div className="sm:mb-24">
              <SiteHeader />
            </div>
          </motion.div>
        ) : isSiteReady ? (
          <motion.div
            key="about"
            role="button"
            tabIndex={0}
            onClick={toggleView}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleView();
              }
            }}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-start justify-start px-4 pt-4 pb-6 pr-14 sm:px-8 sm:pt-8 sm:pb-8 sm:pr-8"
            {...slideLeft}
            transition={spring}
          >
            <ContentPanel />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
