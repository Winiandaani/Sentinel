// Counts words in a piece of text
export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export default function TextInput({ value, onChange, minWords }) {
  const wordCount = countWords(value);
  const enough = wordCount >= minWords;

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
      <div className="mt-2 flex justify-between border-t border-steel pt-2 font-mono text-[10px] tracking-widest">
        <span className="text-silver">WORDS: {wordCount}</span>
        <span className={enough ? "text-signal-green" : "text-signal-amber"}>
          {enough ? "READY TO SCAN" : `NEED ${minWords - wordCount} MORE WORDS`}
        </span>
      </div>
    </div>
  );
}