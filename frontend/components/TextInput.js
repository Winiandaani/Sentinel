// Counts words in a piece of text
export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export default function TextInput({ value, onChange, minToScan, minWords }) {
  const wordCount = countWords(value);

  // Pick the message and color for the counter
  let message, color;
  if (wordCount < minToScan) {
    message = `NEED ${minToScan - wordCount} MORE WORDS`;
    color = "text-signal-amber";
  } else if (wordCount < minWords) {
    message = `SHORT TEXT: RESULT WILL BE A WEAK HINT (${minWords}+ IS BEST)`;
    color = "text-silver";
  } else {
    message = "READY TO SCAN";
    color = "text-signal-green";
  }

  return (
    <div className="cut-corner border border-steel bg-panel p-4 focus-within:border-chrome">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="PASTE TEXT TO ANALYZE..."
        rows={10}
        className="w-full resize-y bg-transparent text-sm text-chrome outline-none placeholder:font-mono placeholder:text-xs placeholder:tracking-widest placeholder:text-gunmetal"
      />

      {/* Word counter bar */}
      <div className="mt-2 flex justify-between gap-4 border-t border-steel pt-2 font-mono text-[10px] tracking-widest">
        <span className="text-silver">WORDS: {wordCount}</span>
        <span className={`text-right ${color}`}>{message}</span>
      </div>
    </div>
  );
}