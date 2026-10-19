export default function ScanAnimation({ text = "ANALYZING PIXELS..." }) {
  return (
    <div className="pointer-events-none absolute inset-0 bg-void/40">
      {/* Sweeping line */}
      <div className="scan-line" />

      {/* HUD corner brackets */}
      <span className="absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-chrome" />
      <span className="absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-chrome" />
      <span className="absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-chrome" />
      <span className="absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-chrome" />

      {/* Status text */}
      <p className="blink absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-chrome">
        {text}
      </p>
    </div>
  );
}