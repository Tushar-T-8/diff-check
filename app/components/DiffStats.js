"use client";

export default function DiffStats({ stats }) {
  if (!stats) return null;

  const { unchanged, removed, added } = stats;
  const total = unchanged + removed + added;
  const pctUnchanged = total ? Math.round((unchanged / total) * 100) : 0;
  const pctRemoved   = total ? Math.round((removed   / total) * 100) : 0;
  const pctAdded     = total ? Math.round((added     / total) * 100) : 0;

  const rows = [
    {
      label : "Unchanged",
      count : unchanged,
      pct   : pctUnchanged,
      color : "var(--muted)",
      bg    : "var(--paper-dark)",
    },
    {
      label : "Removed",
      count : removed,
      pct   : pctRemoved,
      color : "var(--accent-red)",
      bg    : "rgba(192,57,43,0.10)",
    },
    {
      label : "Added",
      count : added,
      pct   : pctAdded,
      color : "var(--accent-green)",
      bg    : "rgba(39,174,96,0.10)",
    },
  ];

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
          Diff Summary
        </span>
        <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
          {total} words total
        </span>
      </div>

      {/* Stacked bar */}
      <div className="px-5 pt-5">
        <div
          className="flex rounded-sm overflow-hidden h-2.5 w-full"
          style={{ background: "var(--border)" }}
        >
          {pctUnchanged > 0 && (
            <div style={{ width: `${pctUnchanged}%`, background: "var(--border)" }} />
          )}
          {pctRemoved > 0 && (
            <div style={{ width: `${pctRemoved}%`, background: "var(--accent-red)", opacity: 0.7 }} />
          )}
          {pctAdded > 0 && (
            <div style={{ width: `${pctAdded}%`, background: "var(--accent-green)", opacity: 0.7 }} />
          )}
        </div>
      </div>

      {/* Stat rows */}
      <div className="px-5 py-4 space-y-3">
        {rows.map(({ label, count, pct, color, bg }) => (
          <div key={label} className="flex items-center gap-3">
            {/* Bar */}
            <div
              className="flex-1 h-7 rounded-sm flex items-center px-3 justify-between"
              style={{ background: bg }}
            >
              <span
                className="font-mono text-xs font-medium"
                style={{ color }}
              >
                {label}
              </span>
              <span className="font-mono text-xs" style={{ color }}>
                {count} words
              </span>
            </div>
            {/* Percent */}
            <span
              className="font-mono text-xs w-10 text-right shrink-0"
              style={{ color: "var(--muted)" }}
            >
              {pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Similarity score */}
      <div
        className="px-5 pb-5 pt-1 flex items-center gap-2"
      >
        <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
          Similarity
        </span>
        <div
          className="flex-1 h-1 rounded-full"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-1 rounded-full transition-all duration-700"
            style={{
              width: `${pctUnchanged}%`,
              background: pctUnchanged > 80
                ? "var(--accent-green)"
                : pctUnchanged > 50
                ? "var(--accent-amber)"
                : "var(--accent-red)",
            }}
          />
        </div>
        <span
          className="font-mono text-xs font-semibold shrink-0"
          style={{
            color: pctUnchanged > 80
              ? "var(--accent-green)"
              : pctUnchanged > 50
              ? "var(--accent-amber)"
              : "var(--accent-red)",
          }}
        >
          {pctUnchanged}%
        </span>
      </div>
    </div>
  );
}
