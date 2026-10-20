"use client";

import { useState } from "react";
import TextInput, { countWords } from "@/components/TextInput";
import ResultCard from "@/components/ResultCard";
import ScanAnimation from "@/components/ScanAnimation";

const MIN_WORDS_TO_SCAN = 10;
const MIN_WORDS_RELIABLE = 80;

export default function TextPage() {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const canScan = countWords(text) >= MIN_WORDS_TO_SCAN && !isScanning;

  async function handleScan() {
    setIsScanning(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("SCAN FAILED: could not reach the Sentinel backend. Is it running?");
    } finally {
      setIsScanning(false);
    }
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
            setError("");
          }}
          minToScan={MIN_WORDS_TO_SCAN}
          minWords={MIN_WORDS_RELIABLE}
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

        {error && (
          <p className="mt-6 border border-signal-red p-4 font-mono text-xs tracking-widest text-signal-red">
            {error}
          </p>
        )}

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}