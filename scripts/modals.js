let lastFocusedElement = null;

function setModalState(modal, isOpen) {
    modal.classList.toggle("hidden", !isOpen);
    modal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);

    if (isOpen) {
        lastFocusedElement = document.activeElement;
        modal.querySelector("[data-modal-close]")?.focus();
    } else if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

function openModal(modal) {
    if (!modal) return;
    setModalState(modal, true);
}

function closeModal(modal) {
    if (!modal) return;
    setModalState(modal, false);
}

function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => closeModal(modal));
}

function initQrImageFallbacks() {
    document.querySelectorAll(".qr-img[data-fallback-link]").forEach(img => {
        img.addEventListener("error", () => {
            const fallbackLink = img.getAttribute("data-fallback-link");
            const modalBody = img.closest(".modal-body");
            if (!fallbackLink || !modalBody) return;

            modalBody.innerHTML = `
                <button class="modal-close" type="button" data-modal-close aria-label="Chiudi">×</button>
                <div class="qr-fallback">
                    <p>Il QR code non è ancora disponibile. Puoi aprire direttamente il profilo.</p>
                    <a class="btn btn-primary" href="${fallbackLink}" target="_blank" rel="noopener noreferrer">Apri il profilo</a>
                </div>
            `;
        }, { once: true });
    });
}

function setupBachecaPreview() {
    const modal = document.getElementById("image-modal");
    const image = document.getElementById("image-modal-img");
    const caption = document.getElementById("image-modal-caption");
    if (!modal || !image || !caption) return;

    window.addEventListener("bacheca:preview", event => {
        const { src, title } = event.detail;
        image.src = src;
        image.alt = title;
        caption.textContent = title;
        openModal(modal);
    });
}

export function setupQrModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.setAttribute("aria-hidden", "true");
        modal.addEventListener("click", () => closeModal(modal));
        modal.querySelector(".modal-body")?.addEventListener("click", event => {
            const closeButton = event.target.closest("[data-modal-close]");
            if (closeButton) {
                closeModal(modal);
                return;
            }

            event.stopPropagation();
        });
    });

    document.addEventListener("click", event => {
        const qrButton = event.target.closest(".qr-btn");
        if (!qrButton) return;

        event.preventDefault();
        event.stopPropagation();
        openModal(document.getElementById(`qr-modal-${qrButton.getAttribute("data-qr")}`));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeAllModals();
    });

    initQrImageFallbacks();
    setupBachecaPreview();
}
