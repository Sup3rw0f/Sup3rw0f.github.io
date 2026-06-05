import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BACHECA_CONFIG } from "./config.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputPath = path.join(root, "data", "bacheca.json");

function decodeHtml(value) {
    return value
        .replaceAll("&amp;", "&")
        .replaceAll("&quot;", "\"")
        .replaceAll("&#39;", "'")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
}

function parseEmbeddedFolder(html) {
    const entries = [...html.matchAll(/<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<img src="([^"]+)" alt="[^"]*"\/>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>[\s\S]*?<div class="flip-entry-last-modified"><div>([\s\S]*?)<\/div>/g)];

    return entries.map(match => {
        const [, id, webViewLink, thumbnailUrl, rawTitle, rawDate] = match;
        const title = decodeHtml(rawTitle.trim());

        return {
            id,
            title,
            updatedLabel: decodeHtml(rawDate.trim()),
            thumbnailUrl: decodeHtml(thumbnailUrl).replace(/=s190$/, "=s1000"),
            previewUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
            webViewLink: decodeHtml(webViewLink)
        };
    });
}

const response = await fetch(BACHECA_CONFIG.fallbackEmbedUrl);
if (!response.ok) {
    throw new Error(`Google Drive embedded folder error: ${response.status}`);
}

const html = await response.text();
const items = parseEmbeddedFolder(html);

if (items.length === 0) {
    throw new Error("No bacheca items found in Google Drive embedded folder.");
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
    updatedAt: new Date().toISOString(),
    source: BACHECA_CONFIG.fallbackEmbedUrl,
    items
}, null, 2)}\n`, "utf8");

console.log(`Updated data/bacheca.json with ${items.length} item(s).`);
