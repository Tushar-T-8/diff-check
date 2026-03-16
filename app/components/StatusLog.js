"use client";

const ICONS = {
  info:    "›",
  success: "✓",
  error:   "✕",
};

const COLORS = {
  info:    "var(--muted)",
  success: "var(--accent-green)",
  error:   "var(--accent-red)",
};

export default function StatusLog({ logs, status }) {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1.5px solid var(--border)", background: "var(--paper)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border)", background: "var(--paper-dark)" }}
      >
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Run Log
        </span>
        {/* Status badge */}
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-sm"
          style={{
            background:
              status === "success"
                ? "rgba(39,174,96,0.12)"
                : status === "error"
                ? "rgba(192,57,43,0.12)"
                : status === "loading"
                ? "rgba(212,160,23,0.12)"
                : "var(--paper-dark)",
            color:
              status === "success"
                ? "var(--accent-green)"
                : status === "error"
                ? "var(--accent-red)"
                : status === "loading"
                ? "var(--accent-amber)"
                : "var(--muted)",
          }}
        >
          {status === "idle"    && "IDLE"}
          {status === "loading" && "RUNNING"}
          {status === "success" && "DONE"}
          {status === "error"   && "FAILED"}
        </span>
      </div>

      {/* Log lines */}
      <div className="px-5 py-4 space-y-2 min-h-[120px] max-h-72 overflow-y-auto font-mono text-xs">
        {logs.length === 0 ? (
          <span style={{ color: "var(--muted)" }}>Waiting for files…</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: COLORS[log.type], flexShrink: 0 }}>
                {ICONS[log.type]}
              </span>
              <span style={{ color: COLORS[log.type] }}>{log.msg}</span>
              <span
                className="ml-auto shrink-0"
                style={{ color: "var(--border)" }}
              >
                {log.ts}
              </span>
            </div>
          ))
        )}

        {/* Animated cursor when loading */}
        {status === "loading" && (
          <div className="flex items-center gap-2 mt-1">
            <span style={{ color: "var(--accent-amber)" }}>›</span>
            <span
              className="inline-block w-16 h-1.5 rounded-full"
              style={{
                background: "var(--accent-amber)",
                transformOrigin: "left center",
                animation: "pulse-bar 1.2s ease-in-out infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
