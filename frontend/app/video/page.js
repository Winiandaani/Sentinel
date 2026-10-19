"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import ResultCard from "@/components/ResultCard";
import ScanAnimation from "@/components/ScanAnimation";

export default function VideoPage() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleScan() {
    setIsScanning(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/video`, {
        method: "POST",
        body: formData,
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
      <p className="font-mono text-xs tracking-widest text-silver">// MODULE 01</p>
      <h1 className="text-glow mt-2 font-display text-3xl font-bold tracking-widest">VIDEO SCAN</h1>
      <p className="mt-3 text-silver">Upload a video to check if it was made by AI.</p>

      <div className="mt-8 max-w-2xl">
        <UploadBox
          accept="video/*"
          label="UPLOAD A VIDEO"
          onFileSelect={(f) => {
            setFile(f);
            setResult(null);
            setError("");
          }}
        />

        {file && (
          <div className="relative mt-6 inline-block">
            <video src={URL.createObjectURL(file)} controls className="block max-h-80 border border-steel" />
            {isScanning && <ScanAnimation text="ANALYZING FRAMES..." />}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={!file || isScanning}
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