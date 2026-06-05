import { initScrollAnimations } from "./animations.js";
import { updateSEO } from "./seo.js";

let currentPage = "home";
let isTransitioning = false;

function updateActiveNavigation(page) {
    document.querySelectorAll("[data-page]").forEach(btn => {
        if (!btn.classList.contains("nav-link")) return;
        btn.classList.toggle("active", btn.getAttribute("data-page") === page);
    });
}

function showPage(page) {
    document.querySelectorAll(".page-content").forEach(panel => panel.classList.remove("active"));
    document.getElementById(`page-${page}`)?.classList.add("active");
    updateActiveNavigation(page);
    currentPage = page;
    updateSEO(page);
    window.scrollTo({ top: 0, behavior: "instant" });
    initScrollAnimations();
}

export function navigateTo(page, clickEvent = null) {
    if (page === currentPage || isTransitioning) return;

    if (window.innerWidth <= 800) {
        showPage(page);
        return;
    }

    isTransitioning = true;
    const veil = document.getElementById("transition-veil");

    if (clickEvent) {
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        veil.style.transformOrigin = `${rect.left + rect.width / 2}px center`;
    } else {
        veil.style.transformOrigin = "left center";
    }

    veil.className = "veil-cover";

    setTimeout(() => {
        showPage(page);
        veil.style.transformOrigin = "right center";
        veil.className = "veil-idle";

        setTimeout(() => {
            isTransitioning = false;
        }, 480);
    }, 480);
}

export function setupNavigation() {
    document.body.addEventListener("click", event => {
        const targetPageBtn = event.target.closest("[data-page]");
        if (!targetPageBtn) return;

        navigateTo(targetPageBtn.getAttribute("data-page"), event);
        document.getElementById("mobile-drawer")?.classList.add("hidden");
        document.querySelector(".icon-menu")?.classList.remove("hidden");
        document.querySelector(".icon-x")?.classList.add("hidden");
    });

    window.addEventListener("scroll", () => {
        document.getElementById("main-nav")?.classList.toggle("scrolled", window.scrollY > 10);
    });

    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const iconMenu = document.querySelector(".icon-menu");
    const iconX = document.querySelector(".icon-x");

    hamburgerBtn?.addEventListener("click", () => {
        const isOpen = !mobileDrawer.classList.contains("hidden");
        mobileDrawer.classList.toggle("hidden", isOpen);
        iconMenu?.classList.toggle("hidden", !isOpen);
        iconX?.classList.toggle("hidden", isOpen);
        hamburgerBtn.setAttribute("aria-label", isOpen ? "Apri menu" : "Chiudi menu");
    });
}
