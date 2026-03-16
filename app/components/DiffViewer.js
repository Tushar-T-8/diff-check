"use client";

export default function DiffViewer({ paragraphs, originalName, revisedName }) {
  if (!paragraphs?.length) return null;

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1.5px solid var(--border)" }}
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
          Diff View
        </span>
        <div className="flex items-center gap-4 font-mono text-xs" style={{ color: "var(--muted)" }}>
          <span>{originalName}</span>
          <span>→</span>
          <span>{revisedName}</span>
        </div>
      </div>

      {/* Legend */}
      <div
        className="px-5 py-2 flex items-center gap-5 border-b font-mono text-xs"
        style={{ borderColor: "var(--border)", background: "var(--paper)" }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: "rgba(192,57,43,0.15)", border: "1px solid var(--accent-red)" }}
          />
          <span style={{ color: "var(--accent-red)" }}>removed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: "rgba(39,174,96,0.15)", border: "1px solid var(--accent-green)" }}
          />
          <span style={{ color: "var(--accent-green)" }}>added</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: "var(--paper-dark)", border: "1px solid var(--border)" }}
          />
          <span style={{ color: "var(--muted)" }}>unchanged</span>
        </span>
      </div>

      {/* Paragraphs */}
      <div
        className="px-5 py-5 space-y-4 overflow-y-auto font-sans text-sm leading-relaxed"
        style={{ maxHeight: "60vh", background: "var(--paper)" }}
      >
        {paragraphs.map((tokens, pi) => (
          <p key={pi} style={{ color: "var(--ink)" }}>
            {tokens.map(({ tag, word }, ti) => {
              if (tag === "delete") {
                return (
                  <span
                    key={ti}
                    className="line-through mx-px px-0.5 rounded-sm"
                    style={{
                      color: "var(--accent-red)",
                      background: "rgba(192,57,43,0.10)",
                      textDecorationColor: "var(--accent-red)",
                    }}
                  >
                    {word}{" "}
                  </span>
                );
              }
              if (tag === "insert") {
                return (
                  <span
                    key={ti}
                    className="mx-px px-0.5 rounded-sm"
                    style={{
                      color: "var(--accent-green)",
                      background: "rgba(39,174,96,0.10)",
                    }}
                  >
                    {word}{" "}
                  </span>
                );
              }
              return <span key={ti}>{word} </span>;
            })}
          </p>
        ))}
      </div>
    </div>
  );
}