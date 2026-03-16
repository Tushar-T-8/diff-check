"use client";

export default function DiffPreview({ paragraphs }) {
  if (!paragraphs || paragraphs.length === 0) return null;

  // Count stats
  let totalAdded = 0, totalRemoved = 0, totalUnchanged = 0;
  paragraphs.forEach((p) => {
    p.content.forEach((token) => {
      if (typeof token === "string") totalUnchanged++;
      else {
        if (token.old) totalRemoved++;
        if (token.new) totalAdded++;
      }
    });
  });

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        border: "1.5px solid var(--border)",
        background: "var(--paper)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border)", background: "var(--paper-dark)" }}
      >
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          JSON Preview
        </span>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span style={{ color: "var(--accent-red)" }}>−{totalRemoved}</span>
          <span style={{ color: "var(--accent-green)" }}>+{totalAdded}</span>
          <span style={{ color: "var(--muted)" }}>{totalUnchanged} unchanged</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-4 max-h-72 overflow-y-auto">
        {paragraphs.map((para, pi) => (
          <p
            key={pi}
            className="font-sans text-sm leading-relaxed"
            style={{ color: "var(--ink)" }}
          >
            {para.content.map((token, ti) => {
              if (typeof token === "string") {
                return <span key={ti}>{token} </span>;
              }
              return (
                <span key={ti} className="inline">
                  {token.old && (
                    <span
                      className="line-through mx-0.5 px-0.5 rounded-sm font-medium"
                      style={{
                        color: "var(--accent-red)",
                        background: "rgba(192,57,43,0.08)",
                        textDecorationColor: "var(--accent-red)",
                      }}
                    >
                      {token.old}
                    </span>
                  )}
                  {token.old && token.new && " "}
                  {token.new && (
                    <span
                      className="mx-0.5 px-0.5 rounded-sm font-medium"
                      style={{
                        color: "var(--accent-green)",
                        background: "rgba(39,174,96,0.08)",
                      }}
                    >
                      {token.new}
                    </span>
                  )}{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </div>
  );
}
