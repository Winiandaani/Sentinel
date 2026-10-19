"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import ResultCard from "@/components/ResultCard";
import ScanAnimation from "@/components/ScanAnimation";
// Fake result until the real AI is connected
const fakeResult = {
  verdict: "likely_ai",
  confidence: 87,
  evidence: [
    "No content credentials found",
    "Camera information missing from metadata",
    "AI model score: 0.87 (high)",
  ],
};

export default function PhotoPage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  function handleScan() {
    setIsScanning(true);
    setResult(null);

    // Pretend to scan for 2 seconds
    setTimeout(() => {
      setResult(fakeResult);
      setIsScanning(false);
    }, 2000);
  }

  return (
    <div className="p-10">
      <p className="font-mono text-xs tracking-widest text-silver">// MODULE 02</p>
      <h1 className="text-glow mt-2 font-display text-3xl font-bold tracking-widest">PHOTO SCAN</h1>
      <p className="mt-3 text-silver">Upload an image to check if it was made by AI.</p>

      <div className="mt-8 max-w-2xl">
        <UploadBox
          accept="image/*"
          label="UPLOAD AN IMAGE"
          onFileSelect={(f) => {
            setFile(f);
            setResult(null); // clear the old result when a new file is chosen
          }}
        />

        {file && (
  <div className="relative mt-6 inline-block">
    <img src={URL.createObjectURL(file)} alt="Preview" className="block max-h-80 border border-steel" />
    {isScanning && <ScanAnimation />}
  </div>
)}
        <button
          onClick={handleScan}
          disabled={!file || isScanning}
          className="glow mt-6 border border-gunmetal px-6 py-3 font-mono text-sm tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isScanning ? <span className="blink">SCANNING...</span> : "INITIATE SCAN"}
        </button>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}