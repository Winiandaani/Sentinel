// Look and label for each possible verdict
const verdicts = {
  likely_ai: { label: "LIKELY AI", color: "text-signal-red", bar: "bg-signal-red", border: "border-signal-red" },
  likely_real: { label: "LIKELY REAL", color: "text-signal-green", bar: "bg-signal-green", border: "border-signal-green" },
  uncertain: { label: "UNCERTAIN", color: "text-signal-amber", bar: "bg-signal-amber", border: "border-signal-amber" },
};

export default function ResultCard({ result }) {
  const v = verdicts[result.verdict];

  return (
    <div className={`cut-corner mt-8 border-l-4 bg-panel p-6 ${v.border}`}>
      <p className="font-mono text-[10px] tracking-widest text-silver">// SCAN RESULT</p>
      <h2 className={`mt-2 font-display text-2xl font-bold tracking-widest ${v.color}`}>{v.label}</h2>

      {/* Confidence bar */}
      <div className="mt-6">
        <div className="flex justify-between font-mono text-xs tracking-widest text-silver">
          <span>CONFIDENCE</span>
          <span>{result.confidence}%</span>
        </div>
        <div className="mt-2 h-2 w-full bg-steel">
          <div className={`h-2 ${v.bar}`} style={{ width: `${result.confidence}%` }} />
        </div>
      </div>

      {/* Evidence list */}
      <p className="mt-6 font-mono text-[10px] tracking-widest text-silver">// EVIDENCE</p>
      <ul className="mt-2 space-y-2">
        {result.evidence.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-silver">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}