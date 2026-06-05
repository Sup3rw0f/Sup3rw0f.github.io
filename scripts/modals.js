function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => modal.classList.add("hidden"));
}

function initQrImageFallbacks() {
    document.querySelectorAll(".qr-img[data-fallback-link]").forEach(img => {
        img.addEventListener("error", () => {
            const fallbackLink = img.getAttribute("data-fallback-link");
            const modalBody = img.closest(".modal-body");
            if (!fallbackLink || !modalBody) return;

            modalBody.innerHTML = `
                <div class="qr-fallback">
                    <p>Il QR code non è ancora disponibile. Puoi aprire direttamente il profilo.</p>
                    <a class="btn btn-primary" href="${fallbackLink}" target="_blank" rel="noopener noreferrer">Apri il profilo</a>
                </div>
            `;
        }, { once: true });
    });
}

export function setupQrModals() {
    document.querySelectorAll(".qr-btn").forEach(btn => {
        btn.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const qrType = btn.getAttribute("data-qr");
            document.getElementById(`qr-modal-${qrType}`)?.classList.remove("hidden");
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", () => modal.classList.add("hidden"));
        modal.querySelector(".modal-body")?.addEventListener("click", event => event.stopPropagation());
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeAllModals();
    });

    initQrImageFallbacks();
}
