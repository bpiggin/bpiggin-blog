"use client";

import { X } from "react-feather";
import type { PanelId } from "./site-shell";

const panelTitles: Record<PanelId, string> = {
  about: "About me",
  experience: "Experience",
  links: "Links",
};

type ContentPanelProps = {
  panel: PanelId;
  onClose: () => void;
};

export function ContentPanel({ panel, onClose }: ContentPanelProps) {
  return (
    <div className="flex h-full flex-col px-8 py-8 sm:px-10">
      <div className="flex items-start justify-between gap-6">
        <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-6xl">
          {panelTitles[panel]}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-sm transition hover:bg-black/35"
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>
      </div>
      <div className="mt-10 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
        {panel === "about" && (
          <p>
            Placeholder for your about content — bio, what you do, and what you
            are interested in.
          </p>
        )}
        {panel === "experience" && (
          <p>Placeholder for your experience and work history.</p>
        )}
        {panel === "links" && <p>Placeholder for links to your profiles and projects.</p>}
      </div>
    </div>
  );
}
