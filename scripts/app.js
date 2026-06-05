import { initScrollAnimations } from "./animations.js";
import { loadBachecaImages } from "./bacheca.js";
import { setupQrModals } from "./modals.js";
import { setupNavigation } from "./navigation.js";
import { updateSEO } from "./seo.js";

document.addEventListener("DOMContentLoaded", () => {
    updateSEO("home");
    setupNavigation();
    setupQrModals();
    loadBachecaImages();
    initScrollAnimations();
});
