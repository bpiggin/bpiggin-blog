"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSiteReady } from "./site-ready-provider";

export function LoadingScreen() {
  const { isSiteReady } = useSiteReady();

  return (
    <AnimatePresence>
      {!isSiteReady && (
        <motion.div
          key="loading"
          role="status"
          aria-live="polite"
          aria-label="Loading site"
          className="pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="size-10 animate-spin rounded-full border-2 border-site/25 border-t-site"
            aria-hidden
          />
          <p className="text-sm font-medium tracking-wide text-site/90">Loading site</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
