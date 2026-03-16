"use client";

import { useState, useEffect } from "react";
import FileUploadZone from "./components/FileUploadZone";
import DiffViewer from "./components/DiffViewer";
import DiffStats from "./components/DiffStats";

export default function Home() {
  const [originalFile, setOriginalFile] = useState(null);
  const [revisedFile,  setRevisedFile]  = useState(null);
  const [status,       setStatus]       = useState("idle"); // idle|loading|success|error
  const [error,        setError]        = useState(null);
  const [diffResult,   setDiffResult]   = useState(null); // { diffParagraphs, stats, originalName, revisedName }

  // Auto-run whenever both files are present
  useEffect(() => {
    if (!originalFile || !revisedFile) return;
    runDiff();
  }, [originalFile, revisedFile]);

  const runDiff = async () => {
    setStatus("loading");
    setError(null);
    setDiffResult(null);

    const formData = new FormData();
    formData.append("original", originalFile);
    formData.append("revised",  revisedFile);

    try {
      const res = await fetch("/api/generate-diff", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();
      setDiffResult(data);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleOriginalChange = (file) => {
    setOriginalFile(file);
    setDiffResult(null);
    setError(null);
    setStatus("idle");
  };

  const handleRevisedChange = (file) => {
    setRevisedFile(file);
    setDiffResult(null);
    setError(null);
    setStatus("idle");
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="border-b fade-up"
        style={{ borderColor: "var(--border)", background: "var(--paper)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs font-semibold tracking-widest uppercase px-2 py-1 rounded"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              DiffCheck
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
              v2.0
            </span>
          </div>
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Document Diff Dashboard
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero */}
        <section className="mb-10 fade-up delay-1">
          <h1
            className="text-4xl font-sans font-light leading-tight mb-3"
            style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}
          >
            Compare two{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--accent-amber)" }}>
              Word documents
            </em>
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--muted)" }}>
            Upload both <code className="font-mono">.docx</code> files — the diff appears instantly.{" "}
            <span style={{ color: "var(--accent-red)" }}>Removals</span> and{" "}
            <span style={{ color: "var(--accent-green)" }}>additions</span> are highlighted inline.
          </p>
        </section>

        {/* Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 fade-up delay-2">
          <FileUploadZone
            label="Original Document"
            accept=".docx"
            hint="SampleDoc.docx"
            icon="📄"
            badge="v1"
            badgeColor="var(--muted)"
            file={originalFile}
            onChange={handleOriginalChange}
          />
          <FileUploadZone
            label="Revised Document"
            accept=".docx"
            hint="SampleDoc1.docx"
            icon="📝"
            badge="v2"
            badgeColor="var(--accent-amber)"
            file={revisedFile}
            onChange={handleRevisedChange}
          />
        </div>

        {/* Loading state */}
        {status === "loading" && (
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-sm mb-6 font-mono text-sm"
            style={{ background: "var(--paper-dark)", border: "1.5px solid var(--border)" }}
          >
            <span
              className="inline-block w-3 h-3 border-2 rounded-full shrink-0"
              style={{
                borderColor: "var(--ink)",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ color: "var(--muted)" }}>Comparing documents…</span>
          </div>
        )}

        {/* Error state */}
        {status === "error" && error && (
          <div
            className="px-5 py-4 rounded-sm mb-6 font-mono text-xs"
            style={{
              background: "rgba(192,57,43,0.06)",
              border: "1.5px solid var(--accent-red)",
              color: "var(--accent-red)",
            }}
          >
            ✕ {error}
          </div>
        )}

        {/* Results */}
        {status === "success" && diffResult && (
          <div className="space-y-5 fade-up">
            <DiffStats stats={diffResult.stats} />
            <DiffViewer
              paragraphs={diffResult.diffParagraphs}
              originalName={diffResult.originalName}
              revisedName={diffResult.revisedName}
            />
          </div>
        )}

        {/* Empty prompt */}
        {status === "idle" && (
          <div
            className="flex items-center justify-center py-16 rounded-sm font-mono text-xs"
            style={{
              border: "1.5px dashed var(--border)",
              color: "var(--muted)",
            }}
          >
            {!originalFile && !revisedFile
              ? "Upload both documents to see the diff"
              : !revisedFile
              ? "Now upload the revised document →"
              : "Now upload the original document ←"}
          </div>
        )}
      </div>

      <footer className="border-t mt-20 py-6" style={{ borderColor: "var(--border)" }}>
        <div
          className="max-w-5xl mx-auto px-6 font-mono text-xs"
          style={{ color: "var(--muted)" }}
        >
          DiffCheck — powered by mammoth · docx · Next.js App Router
        </div>
      </footer>
    </main>
  );
}