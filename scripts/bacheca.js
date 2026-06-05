import { initScrollAnimations } from "./animations.js";
import { BACHECA_CONFIG } from "./config.js";

function buildDriveApiUrl() {
    const params = new URLSearchParams({
        q: `'${BACHECA_CONFIG.folderId}' in parents and trashed=false`,
        key: BACHECA_CONFIG.apiKey,
        fields: "files(id,name,mimeType)",
        orderBy: "name"
    });

    return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
}

function renderDriveFallback(gallery) {
    gallery.innerHTML = `
        <div class="drive-fallback">
            <iframe
                title="Bacheca volantini da Google Drive"
                src="${BACHECA_CONFIG.fallbackEmbedUrl}"
                loading="lazy"
                referrerpolicy="no-referrer"
            ></iframe>
            <a class="btn btn-outline" href="https://drive.google.com/drive/folders/${BACHECA_CONFIG.folderId}" target="_blank" rel="noopener noreferrer">Apri la bacheca su Drive</a>
        </div>
    `;
}

function createBachecaCard(file) {
    const card = document.createElement("button");
    card.className = "bacheca-card fade-in";
    card.type = "button";
    card.setAttribute("aria-label", `Apri ${file.name}`);

    const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = file.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
        img.onerror = null;
        img.src = "https://placehold.co/600x800?text=Immagine+non+disponibile";
    }, { once: true });

    const info = document.createElement("div");
    info.className = "bacheca-card-info";
    const title = document.createElement("h3");
    title.textContent = file.name;
    info.appendChild(title);

    card.append(img, info);
    card.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("bacheca:preview", {
            detail: { src: imageUrl, title: file.name }
        }));
    });

    return card;
}

export async function loadBachecaImages() {
    const gallery = document.getElementById("bacheca-gallery");
    if (!gallery) return;

    try {
        const response = await fetch(buildDriveApiUrl());
        if (!response.ok) throw new Error(`Google Drive API error: ${response.status}`);

        const data = await response.json();
        const imageFiles = (data.files || [])
            .filter(file => file.mimeType.startsWith("image/"))
            .sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));

        if (imageFiles.length === 0) {
            renderDriveFallback(gallery);
            return;
        }

        gallery.innerHTML = "";
        imageFiles.forEach(file => gallery.appendChild(createBachecaCard(file)));
        initScrollAnimations();
    } catch (error) {
        console.error("Errore Bacheca:", error);
        renderDriveFallback(gallery);
    }
}
