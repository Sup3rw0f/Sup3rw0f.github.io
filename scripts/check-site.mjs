import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const htmlPath = path.join(root, "index.html");
const html = await readFile(htmlPath, "utf8");
const errors = [];

function isExternal(value) {
    return /^(https?:|mailto:|tel:|#)/.test(value);
}

async function exists(relativePath) {
    try {
        await access(path.join(root, relativePath));
        return true;
    } catch {
        return false;
    }
}

function collectAttributes(attributeName) {
    const regex = new RegExp(`${attributeName}="([^"]+)"`, "g");
    return [...html.matchAll(regex)].map(match => match[1]);
}

const references = [
    ...collectAttributes("href"),
    ...collectAttributes("src")
];

for (const srcset of collectAttributes("srcset")) {
    srcset.split(",").forEach(entry => {
        const [candidate] = entry.trim().split(/\s+/);
        if (candidate) references.push(candidate);
    });
}

for (const reference of references) {
    if (!reference || isExternal(reference)) continue;

    const isFallbackImage = html.includes(`src="${reference}"`) && html.includes(`src="${reference}"`) && html.includes("data-fallback-link");
    if (isFallbackImage) continue;

    if (!(await exists(reference))) {
        errors.push(`Missing referenced file: ${reference}`);
    }
}

for (const script of ["animations.js", "app.js", "bacheca.js", "config.js", "modals.js", "navigation.js", "seo.js"]) {
    const result = spawnSync(process.execPath, ["--check", path.join(root, "scripts", script)], { encoding: "utf8" });
    if (result.status !== 0) {
        errors.push(`Syntax error in scripts/${script}\n${result.stderr}`);
    }
}

if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
}

console.log("Site checks passed.");
