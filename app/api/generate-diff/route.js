import { getDiffParagraphs } from "../../../lib/diffcheck.js";

async function parseMultipart(req) {
  const formData = await req.formData();
  const originalEntry = formData.get("original");
  const revisedEntry  = formData.get("revised");

  if (!originalEntry || !revisedEntry) {
    throw new Error("Both 'original' and 'revised' .docx fields are required.");
  }

  return {
    originalBuffer: Buffer.from(await originalEntry.arrayBuffer()),
    originalName:   originalEntry.name || "original.docx",
    revisedBuffer:  Buffer.from(await revisedEntry.arrayBuffer()),
    revisedName:    revisedEntry.name  || "revised.docx",
  };
}

export async function POST(req) {
  try {
    const { originalBuffer, originalName, revisedBuffer, revisedName } =
      await parseMultipart(req);

    const { diffParagraphs, stats } = await getDiffParagraphs(
      originalBuffer,
      revisedBuffer
    );

    return Response.json(
      { success: true, diffParagraphs, stats, originalName, revisedName },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}