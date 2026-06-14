"use client";

import { siteBioTextClass } from "./site-text-styles";

const linkHoverClass =
  "transition-opacity duration-100 ease-in-out hover:opacity-60";

const linkClass = `text-base text-[#f5eacf] underline decoration-[#f5eacf]/50 underline-offset-4 sm:text-lg ${linkHoverClass}`;

export function ContentPanel() {
  return (
    <div className="flex w-full max-w-[calc(100%-3rem)] flex-col gap-8 sm:max-w-xl">
      <div className={`flex flex-col gap-4 sm:gap-6 ${siteBioTextClass}`}>
        <span>
           I'm Ben and I love building things that help people live better lives.
        </span>
        <span>
           I'm really excited about agents and AI in general.
        </span>
        <span>
          Currently building{" "}
          <a
            href="https://www.jackandjill.ai/jack"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline decoration-[#f5eacf]/50 underline-offset-4 ${linkHoverClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            Jack
          </a>
          .
        </span>
      </div>

      <ul className="space-y-1 text-base text-[#f5eacf] sm:text-lg">
        <li>
          <a
            href="https://uk.linkedin.com/in/benjamin-piggin"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://github.com/bpiggin"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}
