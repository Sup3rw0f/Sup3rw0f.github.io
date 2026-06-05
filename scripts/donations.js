import { SATISPAY_CONFIG } from "./config.js";

function formatEuro(cents) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(cents / 100);
}

function buildPaymentUrl(amount) {
    if (!SATISPAY_CONFIG.paymentLink) return "";
    const url = new URL(SATISPAY_CONFIG.paymentLink);
    if (amount) url.searchParams.set("amount", String(amount));
    return url.toString();
}

export function setupDonations() {
    const widget = document.querySelector("[data-satispay-widget]");
    if (!widget) return;

    const amountButtons = widget.querySelector("[data-satispay-amounts]");
    const donateButton = widget.querySelector("[data-satispay-donate]");
    const status = widget.querySelector("[data-satispay-status]");
    let selectedAmount = SATISPAY_CONFIG.amounts[1] || SATISPAY_CONFIG.amounts[0] || null;

    if (amountButtons) {
        amountButtons.innerHTML = "";
        SATISPAY_CONFIG.amounts.forEach(amount => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "amount-chip";
            button.textContent = formatEuro(amount);
            button.setAttribute("aria-pressed", String(amount === selectedAmount));
            button.addEventListener("click", () => {
                selectedAmount = amount;
                amountButtons.querySelectorAll(".amount-chip").forEach(chip => {
                    chip.setAttribute("aria-pressed", String(chip === button));
                });
            });
            amountButtons.appendChild(button);
        });
    }

    donateButton?.addEventListener("click", event => {
        const url = buildPaymentUrl(selectedAmount);
        if (!url) {
            event.preventDefault();
            if (status) {
                status.textContent = "Link Satispay non ancora configurato. Inseriscilo in scripts/config.js.";
            }
            return;
        }

        donateButton.setAttribute("href", url);
    });
}
