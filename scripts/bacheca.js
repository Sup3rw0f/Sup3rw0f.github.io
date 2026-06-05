import { initScrollAnimations } from "./animations.js";
import { BACHECA_CONFIG } from "./config.js";

function createBachecaCard(item) {
    const card = document.createElement("article");
    card.className = "bacheca-card fade-in";

    const button = document.createElement("button");
    button.className = "bacheca-preview-btn";
    button.type = "button";
    button.setAttribute("aria-label", `Apri ${item.title}`);

    const img = document.createElement("img");
    img.src = item.previewUrl || item.thumbnailUrl;
    img.alt = item.title;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
        img.onerror = null;
        img.src = item.thumbnailUrl || "https://placehold.co/600x800?text=Immagine+non+disponibile";
    }, { once: true });

    const info = document.createElement("div");
    info.className = "bacheca-card-info";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const meta = document.createElement("p");
    meta.textContent = item.updatedLabel ? `Aggiornato: ${item.updatedLabel}` : "Da Google Drive";
    info.append(title, meta);

    button.append(img);
    button.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("bacheca:preview", {
            detail: { src: item.previewUrl || item.thumbnailUrl, title: item.title }
        }));
    });

    card.append(button, info);
    return card;
}

function renderItems(gallery, items) {
    gallery.innerHTML = "";

    const feed = document.createElement("div");
    feed.className = "bacheca-feed";

    items.forEach(item => feed.appendChild(createBachecaCard(item)));
    gallery.appendChild(feed);
    initScrollAnimations();
}

function renderError(gallery) {
    gallery.innerHTML = `
        <div class="empty-state">
            Non è stato possibile caricare la bacheca. Riprova più tardi.
            <a href="https://drive.google.com/drive/folders/${BACHECA_CONFIG.folderId}" target="_blank" rel="noopener noreferrer">Apri Drive</a>
        </div>
    `;
}

export async function loadBachecaImages() {
    const gallery = document.getElementById("bacheca-gallery");
    if (!gallery) return;

    try {
        const response = await fetch(BACHECA_CONFIG.manifestUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`Bacheca manifest error: ${response.status}`);

        const data = await response.json();
        const items = (data.items || []).filter(item => item.thumbnailUrl || item.previewUrl);

        if (items.length === 0) {
            renderError(gallery);
            return;
        }

        renderItems(gallery, items);
    } catch (error) {
        console.error("Errore Bacheca:", error);
        renderError(gallery);
    }
}
