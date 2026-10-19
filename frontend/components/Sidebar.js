"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Video, ImageIcon, FileText, Info } from "lucide-react";

// All tabs live here. To add a future tab, just add one line.
const tabs = [
  { name: "Home", href: "/", icon: House },
  { name: "Video", href: "/video", icon: Video },
  { name: "Photo", href: "/photo", icon: ImageIcon },
  { name: "Text", href: "/text", icon: FileText },
  { name: "About", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 z-40 flex w-full border-t border-steel bg-panel md:top-0 md:h-screen md:w-60 md:flex-col md:border-r md:border-t-0">
      {/* Logo (laptop only) */}
      <div className="hidden border-b border-steel p-6 md:block">
        <p className="text-glow font-display text-xl font-bold tracking-widest">SENTINEL</p>
        <p className="mt-1 font-mono text-[10px] tracking-widest text-silver">
          // AI DETECTION UNIT
        </p>
      </div>

      {/* Tabs */}
      <nav className="flex flex-1 flex-row justify-around gap-1 p-2 md:flex-col md:justify-start md:gap-2 md:p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 border px-3 py-2 font-mono text-[10px] tracking-widest transition md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm ${
                isActive
                  ? "glow border-chrome text-chrome"
                  : "border-transparent text-silver hover:border-gunmetal hover:text-chrome"
              }`}
            >
              <Icon size={18} />
              {tab.name.toUpperCase()}
            </Link>
          );
        })}
      </nav>

      {/* Status footer (laptop only) */}
      <div className="hidden border-t border-steel p-4 font-mono text-[10px] tracking-widest text-silver md:block">
        SYS <span className="blink text-signal-green">●</span> ONLINE
      </div>
    </aside>
  );
}