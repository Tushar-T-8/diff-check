/**
 * diffcheck.js
 * Pure Node.js equivalent of diffcheck.py
 *
 * Reads two .docx files, diffs them word-by-word using the
 * Myers diff algorithm, and writes a new .docx where:
 *   - removed words are RED + strikethrough
 *   - added words are GREEN
 *   - unchanged words are unstyled
 *
 * Dependencies (already in Next.js ecosystem, just npm install):
 *   npm install docx mammoth
 *
 *   mammoth  — extracts plain text from .docx buffers
 *   docx     — builds the output .docx document
 */
import { diffWords as jsDiff } from "diff";
import mammoth from "mammoth";
import {
  Document,
  Packer,
  Paragraph,
  Run,
  TextRun,
} from "docx";

// ---------------------------------------------------------------------------
// 1. Extract text from a .docx buffer
//    Returns an array of paragraphs, each an array of word strings.
// ---------------------------------------------------------------------------
async function extractParagraphs(buffer) {
  const { value } = await mammoth.extractRawText({ buffer });
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/).filter(Boolean));
}

// ---------------------------------------------------------------------------
// 2. Myers / SequenceMatcher-style diff on two word arrays
//    Returns an array of { tag, word } objects where tag is:
//      "equal"  — word is in both
//      "delete" — word only in old  → red + strikethrough
//      "insert" — word only in new  → green
// ---------------------------------------------------------------------------
function diffWords(oldWords, newWords) {
  const oldStr = oldWords.join(" ");
  const newStr = newWords.join(" ");

  const result = [];
  for (const part of jsDiff(oldStr, newStr)) {
    const words = part.value.trim().split(/\s+/).filter(Boolean);
    for (const word of words) {
      if (part.added)   result.push({ tag: "insert", word });
      else if (part.removed) result.push({ tag: "delete", word });
      else              result.push({ tag: "equal",  word });
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// 3. Build a .docx document from the diff and return it as a Buffer
// ---------------------------------------------------------------------------
async function buildDiffDoc(diffParagraphs) {
  const children = diffParagraphs.map((tokens) => {
    const runs = tokens.map(({ tag, word }) => {
      if (tag === "delete") {
        return new TextRun({
          text: word + " ",
          color: "C0392B",   // red
          strike: true,
        });
      }
      if (tag === "insert") {
        return new TextRun({
          text: word + " ",
          color: "27AE60",   // green
        });
      }
      // equal
      return new TextRun({ text: word + " " });
    });

    return new Paragraph({ children: runs });
  });

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}

// ---------------------------------------------------------------------------
// 4. Main exported function — mirrors generate_diff_doc() in diffcheck.py
//    Accepts Node.js Buffers, returns { docxBuffer, stats }
// ---------------------------------------------------------------------------
export async function generateDiffDoc(originalBuffer, revisedBuffer) {
  const [origParas, revParas] = await Promise.all([
    extractParagraphs(originalBuffer),
    extractParagraphs(revisedBuffer),
  ]);

  // Pad the shorter list so paragraph pairs always align
  const maxLen = Math.max(origParas.length, revParas.length);
  while (origParas.length < maxLen) origParas.push([]);
  while (revParas.length  < maxLen) revParas.push([]);

  const stats = { unchanged: 0, removed: 0, added: 0 };
  const diffParagraphs = [];

  for (let pi = 0; pi < maxLen; pi++) {
    const tokens = diffWords(origParas[pi], revParas[pi]);
    tokens.forEach(({ tag }) => {
      if (tag === "equal")  stats.unchanged++;
      if (tag === "delete") stats.removed++;
      if (tag === "insert") stats.added++;
    });
    diffParagraphs.push(tokens);
  }

  const docxBuffer = await buildDiffDoc(diffParagraphs);
  return { docxBuffer, stats };
}
// Add this export alongside generateDiffDoc

export async function getDiffParagraphs(originalBuffer, revisedBuffer) {
  const [origParas, revParas] = await Promise.all([
    extractParagraphs(originalBuffer),
    extractParagraphs(revisedBuffer),
  ]);

  const maxLen = Math.max(origParas.length, revParas.length);
  while (origParas.length < maxLen) origParas.push([]);
  while (revParas.length  < maxLen) revParas.push([]);

  const stats = { unchanged: 0, removed: 0, added: 0 };
  const diffParagraphs = [];

  for (let pi = 0; pi < maxLen; pi++) {
    const tokens = diffWords(origParas[pi], revParas[pi]);
    tokens.forEach(({ tag }) => {
      if (tag === "equal")  stats.unchanged++;
      if (tag === "delete") stats.removed++;
      if (tag === "insert") stats.added++;
    });
    diffParagraphs.push(tokens);
  }

  return { diffParagraphs, stats };
}