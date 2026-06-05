import { initScrollAnimations } from "./animations.js";
import { BACHECA_CONFIG } from "./config.js";

export async function loadBachecaImages() {
    const gallery = document.getElementById("bacheca-gallery");
    if (!gallery) return;

    const params = new URLSearchParams({
        q: `'${BACHECA_CONFIG.folderId}' in parents and trashed=false`,
        key: BACHECA_CONFIG.apiKey,
        fields: "files(id,name,mimeType)",
        orderBy: "name"
    });
    const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Errore nel recupero dei file da Google Drive");

        const data = await response.json();
        const imageFiles = data.files
            .filter(file => file.mimeType.startsWith("image/"))
            .sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));

        if (imageFiles.length === 0) {
            gallery.innerHTML = '<p class="empty-state">Al momento non ci sono volantini esposti in bacheca.</p>';
            return;
        }

        gallery.innerHTML = "";

        imageFiles.forEach(file => {
            const card = document.createElement("button");
            card.className = "bacheca-card fade-in";
            card.type = "button";
            card.setAttribute("aria-label", `Apri ${file.name}`);
            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;

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
            gallery.appendChild(card);
        });

        initScrollAnimations();
    } catch (error) {
        console.error("Errore Bacheca:", error);
        gallery.innerHTML = '<p class="text-medium font-300" style="color: #ae14a8;">Non è stato possibile caricare i volantini. Riprova più tardi.</p>';
    }
}
