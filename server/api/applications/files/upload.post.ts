/**
 * POST /api/applications/files/upload
 *
 * Static mock endpoint — accepts a multipart file upload and returns
 * a consistent upload metadata response.  In production you'd store the
 * file in S3/Minio/etc.; here we just echo back a fixed shape so the
 * frontend components have something real to work with.
 */
import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);

  // Find the uploaded file part (field name is "file" by convention)
  const filePart = parts?.find((p) => p.name === "file" || p.filename);

  if (!filePart?.filename) {
    throw createError({ statusCode: 400, message: "No file provided" });
  }

  const originalName = filePart.filename;
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "bin";
  const fileId = randomUUID();
  const storedName = `${randomUUID()}.${ext}`;

  // Derive a reasonable content-type
  const contentTypeMap: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const contentType =
    filePart.type ?? contentTypeMap[ext] ?? "application/octet-stream";

  return {
    error: 0,
    message: "Success",
    data: {
      id: fileId,
      original_file_name: originalName,
      path: `attachments/${storedName}`,
      file_name: storedName,
      file_etag: randomUUID().replace(/-/g, ""),
      file_size: filePart.data.length,
      content_type: contentType,
      user_id: randomUUID(),
      application_id: null,
    },
  };
});
