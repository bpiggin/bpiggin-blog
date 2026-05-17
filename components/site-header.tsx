"use client";

import { ArrowUpRight, Briefcase, Smile } from "react-feather";
import type { PanelId } from "./site-shell";

const navButtonClass =
  "group inline-flex w-fit cursor-pointer items-baseline gap-[0.08em] border-0 bg-transparent p-0 text-left text-5xl leading-none font-semibold tracking-tight text-white transition-colors duration-100 ease-in-out sm:text-7xl lg:text-6xl";

const navIconClass =
  "h-[1.15cap] w-[1.15cap] shrink-0 opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100";

const navLinkIconClass =
  "h-[1.4cap] w-[1.4cap] shrink-0 opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100";

type SiteHeaderProps = {
  onOpenPanel: (panel: PanelId) => void;
};

export function SiteHeader({ onOpenPanel }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:gap-5">
      <h1 className="cursor-default text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
        Ben Piggin
      </h1>
      <button
        type="button"
        onClick={() => onOpenPanel("about")}
        className={`${navButtonClass} hover:text-[#ff4528]`}
      >
        About me
        <Smile className={navIconClass} strokeWidth={2.75} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onOpenPanel("experience")}
        className={`${navButtonClass} hover:text-[#ffca18]`}
      >
        Experience
        <Briefcase className={navIconClass} strokeWidth={2.75} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onOpenPanel("links")}
        className={`${navButtonClass} hover:text-[#72e04a]`}
      >
        Links
        <ArrowUpRight className={navLinkIconClass} strokeWidth={2.75} aria-hidden />
      </button>
    </header>
  );
}
