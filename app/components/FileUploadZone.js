"use client";

import { useRef, useState } from "react";

export default function FileUploadZone({ label, accept, hint, icon, badge, badgeColor, file, onChange }) {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!accept.split(",").map(s => s.trim()).includes(ext)) {
      alert(`Please upload a ${accept} file.`);
      return;
    }
    onChange(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className="relative rounded-sm cursor-pointer transition-all duration-200 select-none"
      style={{
        border: `1.5px dashed ${drag ? "var(--ink)" : file ? "var(--accent-green)" : "var(--border)"}`,
        background: drag
          ? "var(--paper-dark)"
          : file
          ? "rgba(39,174,96,0.04)"
          : "var(--paper)",
        padding: "28px 24px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="flex items-start gap-4">
        {/* Icon + badge */}
        <div className="relative shrink-0">
          <span className="text-2xl select-none" style={{ lineHeight: 1 }}>
            {file ? "✅" : icon}
          </span>
          {badge && !file && (
            <span
              className="absolute -top-1.5 -right-3 font-mono text-[9px] font-bold px-1 rounded-sm"
              style={{
                background: badgeColor || "var(--muted)",
                color: "var(--paper)",
                letterSpacing: "0.05em",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "var(--muted)" }}
          >
            {label}
          </p>

          {file ? (
            <div>
              <p
                className="font-sans text-sm font-medium truncate"
                style={{ color: "var(--ink)" }}
              >
                {file.name}
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: "var(--accent-green)" }}>
                {(file.size / 1024).toFixed(1)} KB — ready
              </p>
            </div>
          ) : (
            <div>
              <p className="font-sans text-sm" style={{ color: "var(--ink)" }}>
                Drop file here or{" "}
                <span
                  className="underline underline-offset-2"
                  style={{ color: "var(--accent-amber)" }}
                >
                  browse
                </span>
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: "var(--muted)" }}>
                e.g. {hint}
              </p>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="text-xs font-mono shrink-0 transition-opacity hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            ✕ clear
          </button>
        )}
      </div>
    </div>
  );
}
