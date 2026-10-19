export default function Home() {
  return (
    <main className="min-h-screen p-10">
      {/* Status line */}
      <p className="font-mono text-xs tracking-widest text-silver">
        // SYSTEM STATUS: <span className="blink text-signal-green">ONLINE</span>
      </p>

      {/* Logo and tagline */}
      <h1 className="text-glow mt-4 font-display text-5xl font-bold tracking-widest">
        SENTINEL
      </h1>
      <p className="mt-3 text-silver">Detect AI-generated videos, photos and text.</p>

      {/* Theme test box */}
      <div className="cut-corner mt-8 max-w-md border border-steel bg-panel p-6">
        <p className="font-mono text-sm">
          THEME TEST: this box should have one cut-off corner.
        </p>
      </div>

      {/* Glow test button */}
      <button className="glow mt-6 border border-gunmetal px-6 py-3 font-mono text-sm tracking-widest">
        INITIATE SCAN
      </button>
    </main>
  );
}