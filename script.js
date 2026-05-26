// ─── DATI SEO E STRUTTURATI ──────────────────────────────────────────────────
const SEO_DATA = {
    home: {
        title       : "Guerriere da Sempre | Supporto oncologico a Gessate (MI)",
        description: "Progetto di volontariato fondato da Elena e Serena a Gessate (MI). Offriamo il Passa Parrucca gratuito, ascolto tra pari ed estetica oncologica per donne in cura. Con il patrocinio del Comune di Gessate.",
        canonical: "https://www.guerrieredasempre.it/",
    },
    progetto: {
        title: "Il Progetto – Passa Parrucca e Servizi | Guerriere da Sempre",
        description: "Scopri il Passa Parrucca: parrucche gratuite per donne in chemioterapia a Gessate e nella Martesana. Inoltre estetica oncologica, ascolto tra pari e gruppi di cammino.",
        canonical: "https://www.guerrieredasempre.it/progetto/",
    },
    contatti: {
        title: "Contatti | Guerriere da Sempre – Gessate (MI)",
        description: "Scrivici su Instagram o Facebook. Guerriere da Sempre risponde direttamente, senza centralino. Consulenze a Gessate (MI) su appuntamento, con il patrocinio del Comune.",
        canonical: "https://www.guerrieredasempre.it/contatti/",
    }
};

const JSON_LD = {
    "@context": "https://schema.org",
    "@graph": [{
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://www.guerrieredasempre.it/#org",
        "name": "Guerriere da Sempre",
        "description": "Progetto di volontariato oncologico fondato da Elena e Serena a Gessate (MI). Offre il Passa Parrucca gratuito, ascolto tra pari ed estetica oncologica.",
        "url": "https://www.guerrieredasempre.it",
        "foundingDate": "2023",
        "areaServed": { "@type": "AdministrativeArea", "name": "Martesana, Gessate (MI)" },
        "address": { "@type": "PostalAddress", "addressLocality": "Gessate", "addressRegion": "MI", "addressCountry": "IT" },
        "sameAs": ["https://www.instagram.com/guerrieredasempre/", "https://www.facebook.com/guerrieredasempre"],
        "founder": [{ "@type": "Person", "name": "Elena" }, { "@type": "Person", "name": "Serena" }],
        "knowsAbout": ["supporto oncologico", "chemioterapia", "parrucche oncologiche", "estetica oncologica", "volontariato sanitario"],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servizi gratuiti per donne in cura",
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Passa Parrucca", "description": "Prestito gratuito di parrucche per donne in chemioterapia, senza burocrazia né scadenze." }, "price": "0", "priceCurrency": "EUR" },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Estetica oncologica", "description": "Consigli e sessioni di make-up curativo durante le cure oncologiche." }, "price": "0", "priceCurrency": "EUR" },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ascolto tra pari", "description": "Supporto emotivo da parte di chi ha vissuto l'esperienza del tumore in prima persona." }, "price": "0", "priceCurrency": "EUR" }
            ]
        }
    }]
};

// ─── ROUTER & MOTORE SEO DYNAMIC ─────────────────────────────────────────────
let currentPage = "home";
let isTransitioning = false;

function updateSEO(page) {
    const data = SEO_DATA[page];
    if (!data) return;

    // Head primario
    document.title = data.title;
    document.documentElement.lang = "it";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement("meta"); metaDesc.name = "description"; document.head.appendChild(metaDesc); }
    metaDesc.content = data.description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = data.canonical;

    // Open Graph
    const og = {
        "og:title": data.title,
        "og:description": data.description,
        "og:url": data.canonical,
        "og:type": "website",
        "og:site_name": "Guerriere da Sempre",
        "og:locale": "it_IT",
        "og:image": "https://www.guerrieredasempre.it/og-image.jpg",
        "og:image:alt": "Guerriere da Sempre – Supporto oncologico a Gessate",
    };
    Object.entries(og).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
        tag.content = content;
    });

    // Structured Data JSON-LD
    if (!document.getElementById("jsonld-org")) {
        const script = document.createElement("script");
        script.id = "jsonld-org";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(JSON_LD);
        document.head.appendChild(script);
    }
}

// Navigazione orchestrata col Velo Magenta
function navigateTo(page, clickEvent = null) {
    if (page === currentPage || isTransitioning) return;
    isTransitioning = true;

    const veil = document.getElementById("transition-veil");
    
    // Imposta l'origine della transizione in base al click del mouse
    if (clickEvent) {
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        const originX = `${rect.left + rect.width / 2}px`;
        const originY = `${rect.top + rect.height / 2}px`;
        veil.style.transformOrigin = `${originX} ${originY}`;
    } else {
        veil.style.transformOrigin = "50% 50%";
    }

    // Fase 1: Copertura (il velo sale)
    veil.className = "veil-cover";

    setTimeout(() => {
        // Disattiva vecchia pagina, attiva la nuova
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');

        // Aggiorna classi bottoni di navigazione attiva
        document.querySelectorAll(`[data-page]`).forEach(btn => {
            if(btn.getAttribute('data-page') === page && btn.classList.contains('nav-link')) {
                btn.classList.add('active');
            } else if (btn.classList.contains('nav-link')) {
                btn.classList.remove('active');
            }
        });

        currentPage = page;
        updateSEO(page);
        window.scrollTo({ top: 0, behavior: "instant" });

        // Forza il riavvio immediato dell'IntersectionObserver sulla nuova pagina
        initScrollAnimations();

        // Fase 2: Rivelazione (il velo si ritira verso l'alto)
        veil.style.transformOrigin = "50% 0px";
        veil.className = "veil-idle";

        setTimeout(() => {
            isTransitioning = false;
        }, 480);

    }, 480);
}

// ─── ELEMENTI INTERATTIVI E LISTENER ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Inizializzazione SEO iniziale
    updateSEO("home");

    // Click sui bottoni con attributo data-page (Navigazione Globale)
    document.body.addEventListener("click", (e) => {
        const targetPageBtn = e.target.closest("[data-page]");
        if (targetPageBtn) {
            const page = targetPageBtn.getAttribute("data-page");
            navigateTo(page, e);
            
            // Chiude il menu mobile se un bottone interno viene cliccato
            document.getElementById("mobile-drawer").classList.add("hidden");
            document.querySelector(".icon-menu").classList.remove("hidden");
            document.querySelector(".icon-x").classList.add("hidden");
        }
    });

    // Controllo Scroll per l'effetto ombra della Nav
    window.addEventListener("scroll", () => {
        const nav = document.getElementById("main-nav");
        if (window.scrollY > 10) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // Menu Mobile (Hamburger logic)
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const iconMenu = document.querySelector(".icon-menu");
    const iconX = document.querySelector(".icon-x");

    hamburgerBtn.addEventListener("click", () => {
        const isOpen = !mobileDrawer.classList.contains("hidden");
        if (isOpen) {
            mobileDrawer.classList.add("hidden");
            iconMenu.classList.remove("hidden");
            iconX.classList.add("hidden");
            hamburgerBtn.setAttribute("aria-label", "Apri menu");
        } else {
            mobileDrawer.classList.remove("hidden");
            iconMenu.classList.add("hidden");
            iconX.classList.remove("hidden");
            hamburgerBtn.setAttribute("aria-label", "Chiudi menu");
        }
    });

    // Gestione Modale QR Code (Instagram)
    const openQrBtn = document.getElementById("open-qr-btn");
    const closeQrBtn = document.getElementById("close-qr-btn");
    const qrModal = document.getElementById("qr-modal");

    if (openQrBtn) {
        openQrBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            qrModal.classList.remove("hidden");
        });
    }

    if (closeQrBtn) {
        closeQrBtn.addEventListener("click", () => qrModal.classList.add("hidden"));
    }

    if (qrModal) {
        qrModal.addEventListener("click", () => qrModal.classList.add("hidden"));
        qrModal.querySelector(".modal-body").addEventListener("click", (e) => e.stopPropagation());
    }

    // Chiudi modale con tasto ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            qrModal.classList.add("hidden");
        }
    });

    // Inizializza animazioni di scroll
    initScrollAnimations();
});

// ─── INTERSECTION OBSERVER (FADE-IN SULLO SCROLL) ───────────────────────────
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".fade-in:not(.visible)");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Introduce un micro-delay sequenziale se gli elementi appaiono insieme
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });

    fadeElements.forEach(el => observer.observe(el));
}