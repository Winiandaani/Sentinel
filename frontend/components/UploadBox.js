"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function UploadBox({ accept, label, onFileSelect }) {
  const inputRef = useRef(null); // points to the hidden file picker
  const [isDragging, setIsDragging] = useState(false); // is a file being dragged over?
  const [fileName, setFileName] = useState(""); // name of the chosen file

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file); // send the file to the page using this box
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`cut-corner flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-12 text-center transition ${
        isDragging ? "glow border-chrome bg-steel" : "border-gunmetal bg-panel hover:border-silver"
      }`}
    >
      <Upload size={32} className="text-silver" />
      <p className="font-mono text-sm tracking-widest">{fileName || label}</p>
      <p className="font-mono text-[10px] tracking-widest text-silver">
        {fileName ? "CLICK TO CHANGE FILE" : "DRAG & DROP OR CLICK TO BROWSE"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}