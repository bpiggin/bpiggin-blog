"use client";

import { siteTitleClass } from "./site-text-styles";

export function SiteHeader() {
  return (
    <header>
      <div className={`flex flex-col gap-1.5 sm:gap-2 ${siteTitleClass}`}>
        <span>Ben Piggin</span>
        <span className="flex flex-col gap-1 sm:hidden">
          <span>Founding Engineer at</span>
          <span>Jack & Jill</span>
        </span>
        <span className="hidden sm:block">Founding Engineer at Jack & Jill</span>
      </div>
    </header>
  );
}
