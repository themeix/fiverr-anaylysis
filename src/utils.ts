export async function saveFiles(env: { FILES: R2Bucket }, files: {
  screenshot: Uint8Array;
  html: string;
  json: string;
  excel: Uint8Array;
}): Promise<{ screenshot: string; html: string; json: string; excel: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const screenshotKey = `reviews-${timestamp}.png`;
  const htmlKey = `reviews-${timestamp}.html`;
  const jsonKey = `reviews-${timestamp}.json`;
  const excelKey = `reviews-${timestamp}.csv`;

  await env.FILES.put(screenshotKey, files.screenshot, {
    httpMetadata: { contentType: "image/png" }
  });

  await env.FILES.put(htmlKey, files.html, {
    httpMetadata: { contentType: "text/html" }
  });

  await env.FILES.put(jsonKey, files.json, {
    httpMetadata: { contentType: "application/json" }
  });

  await env.FILES.put(excelKey, files.excel, {
    httpMetadata: { contentType: "text/csv" }
  });

  return {
    screenshot: screenshotKey,
    html: htmlKey,
    json: jsonKey,
    excel: excelKey
  };
}