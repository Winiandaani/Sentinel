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
  const pathname = usePathname(); // which page we're on, e.g. "/video"

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-steel bg-panel">
      {/* Logo */}
      <div className="border-b border-steel p-6">
        <p className="text-glow font-display text-xl font-bold tracking-widest">SENTINEL</p>
        <p className="mt-1 font-mono text-[10px] tracking-widest text-silver">
          // AI DETECTION UNIT
        </p>
      </div>

      {/* Tabs */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 border px-4 py-3 font-mono text-sm tracking-widest transition ${
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

      {/* Status footer */}
      <div className="border-t border-steel p-4 font-mono text-[10px] tracking-widest text-silver">
        SYS <span className="blink text-signal-green">●</span> ONLINE
      </div>
    </aside>
  );
}