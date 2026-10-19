"use client";

import { useState } from "react";
import TextInput, { countWords } from "@/components/TextInput";
import ResultCard from "@/components/ResultCard";
import ScanAnimation from "@/components/ScanAnimation";

const MIN_WORDS = 80;

// Fake result until the real AI is connected
const fakeResult = {
  verdict: "likely_real",
  confidence: 72,
  evidence: [
    "Sentence lengths vary a lot (human-like)",
    "Word choice is not very predictable",
    "AI text model score: 0.28 (low)",
  ],
};

export default function TextPage() {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const canScan = countWords(text) >= MIN_WORDS && !isScanning;

  function handleScan() {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      setResult(fakeResult);
      setIsScanning(false);
    }, 2000);
  }

  return (
    <div className="p-10">
      <p className="font-mono text-xs tracking-widest text-silver">// MODULE 03</p>
      <h1 className="text-glow mt-2 font-display text-3xl font-bold tracking-widest">TEXT SCAN</h1>
      <p className="mt-3 text-silver">Paste a paragraph to check if it was written by AI.</p>

      <div className="relative mt-8 max-w-2xl">
        <TextInput
          value={text}
          onChange={(newText) => {
            setText(newText);
            setResult(null);
          }}
          minWords={MIN_WORDS}
        />
        {isScanning && <ScanAnimation text="ANALYZING TEXT..." />}
      </div>

      <div className="max-w-2xl">
        <button
          onClick={handleScan}
          disabled={!canScan}
          className="glow mt-6 border border-gunmetal px-6 py-3 font-mono text-sm tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isScanning ? <span className="blink">SCANNING...</span> : "INITIATE SCAN"}
        </button>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}