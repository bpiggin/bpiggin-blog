import { SiteShell } from "@/components/site-shell";
import { ThemeBackground } from "@/components/theme-background";

export default function Home() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <ThemeBackground />
      <SiteShell />
    </div>
  );
}
