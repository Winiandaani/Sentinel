"use client";

import { useEffect, useState } from "react";
import { Video, ImageIcon, FileText } from "lucide-react";
import { verdicts } from "@/components/ResultCard";
import { getScans, clearScans } from "@/lib/history";

const icons = { video: Video, photo: ImageIcon, text: FileText };

export default function RecentScans() {
  const [scans, setScans] = useState([]);

  // Read history once, after the page loads in the browser
  useEffect(() => {
    setScans(getScans());
  }, []);

  if (scans.length === 0) {
    return (
      <div className="mt-3 border border-dashed border-steel p-8 text-center font-mono text-sm text-silver">
        NO SCANS LOGGED YET
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {scans.map((s) => {
        const Icon = icons[s.type] || FileText;
        const v = verdicts[s.verdict] || verdicts.uncertain;

        return (
          <div key={s.time} className="flex items-center justify-between gap-4 border border-steel bg-panel px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Icon size={16} className="shrink-0 text-silver" />
              <span className="truncate text-sm">{s.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-4 font-mono text-[10px] tracking-widest">
              <span className={v.color}>{v.label}</span>
              <span className="hidden text-silver sm:inline">{new Date(s.time).toLocaleString()}</span>
            </div>
          </div>
        );
      })}

      <button
        onClick={() => {
          clearScans();
          setScans([]);
        }}
        className="mt-2 font-mono text-[10px] tracking-widest text-silver hover:text-chrome"
      >
        CLEAR HISTORY
      </button>
    </div>
  );
}