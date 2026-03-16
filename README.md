# DiffCheck — Document Diff Dashboard

A Next.js dashboard that lets you upload a Word document and a JSON diff file,
runs your Python `diffcheck.py` script on the server, and hands back a formatted
`.docx` with removed words in **red strikethrough** and added words in **green**.

---

## Project Structure

```
diff-dashboard/
├── app/
│   ├── layout.js                    # Root layout
│   ├── page.js                      # Main dashboard page
│   ├── globals.css                  # Global styles + CSS variables
│   ├── components/
│   │   ├── FileUploadZone.js        # Drag-and-drop upload widget
│   │   ├── DiffPreview.js           # Client-side JSON diff preview
│   │   └── StatusLog.js             # Live run log panel
│   └── api/
│       └── generate-diff/
│           └── route.js             # API route — receives files, runs Python, serves .docx
├── python/
│   └── diffcheck.py                 # Python diff script (accepts CLI args)
├── uploads/                         # Temp session directories (auto-cleaned after 10 min)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Prerequisites

| Tool       | Version  |
|------------|----------|
| Node.js    | 18+      |
| Python     | 3.8+     |
| pip        | any      |

---

## 1 — Install Python dependencies

```bash
pip install python-docx
```

---

## 2 — Install Node dependencies

```bash
cd diff-dashboard
npm install
```

---

## 3 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

### Upload flow
1. User drops/selects a `.docx` file and a `.json` diff file in the browser.
2. Clicking **Generate Diff Document** sends both files as `multipart/form-data`
   to `POST /api/generate-diff`.

### API route (`app/api/generate-diff/route.js`)
1. Parses the multipart body using the native Web API `Request.formData()`.
2. Writes both files to a unique temp session directory under `uploads/<uuid>/`.
3. Spawns `python3 python/diffcheck.py <docx> <json> <output>` via Node's
   `child_process.exec`.
4. If the script succeeds, issues a short-lived download token (10 min) and
   returns it as JSON.
5. The client uses that token to call `GET /api/generate-diff?token=<token>`,
   which streams the `.docx` back as a file download.
6. Temp files are automatically deleted after 10 minutes.

### Python script (`python/diffcheck.py`)
- **Legacy mode** (no args): reads `SampleDoc.docx` + `sample.json`, writes
  `SampleDoc_diff.docx` — same as the original script you had.
- **CLI mode** (3 args): `python3 diffcheck.py <original> <diff.json> <output>` —
  used by the API route so each upload gets its own isolated paths.

---

## JSON diff format

```json
{
  "paragraphs": [
    {
      "content": [
        "Unchanged",
        "words",
        { "old": "removed-word", "new": "replacement-word" },
        "more",
        "words."
      ]
    }
  ]
}
```

- Plain strings → rendered as-is.
- `{ "old": "...", "new": "..." }` → old text in red strikethrough, new text in green.
- Either key is optional (deletion-only or insertion-only).

---

## Production notes

- Replace the in-memory `generatedFiles` map in `route.js` with Redis or a
  database for multi-instance deployments.
- Add rate limiting on the API route (e.g. `next-rate-limit`).
- Consider storing uploads in S3 or similar instead of the local filesystem.
- Ensure `python3` is available in your production environment PATH, or set
  `PYTHON_BIN` env var and update `route.js` accordingly.

---

## Environment variables (optional)

| Variable     | Default                     | Purpose                          |
|--------------|-----------------------------|----------------------------------|
| `PYTHON_BIN` | `python3`                   | Override Python executable path  |
| `UPLOAD_DIR` | `<project>/uploads`         | Override temp upload directory   |
