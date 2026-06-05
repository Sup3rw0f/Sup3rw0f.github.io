import { JSON_LD, SEO_DATA } from "./config.js";

export function updateSEO(page) {
    const data = SEO_DATA[page];
    if (!data) return;

    document.title = data.title;
    document.documentElement.lang = "it";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = data.description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
    }
    canonical.href = data.canonical;

    const openGraphData = {
        "og:title": data.title,
        "og:description": data.description,
        "og:url": data.canonical,
        "og:type": "website",
        "og:site_name": "Guerriere da Sempre",
        "og:locale": "it_IT",
        "og:image": "https://www.guerrieredasempre.it/og-image.jpg",
        "og:image:alt": "Guerriere da Sempre - Supporto oncologico a Gessate"
    };

    Object.entries(openGraphData).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement("meta");
            tag.setAttribute("property", property);
            document.head.appendChild(tag);
        }
        tag.content = content;
    });

    if (!document.getElementById("jsonld-org")) {
        const script = document.createElement("script");
        script.id = "jsonld-org";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(JSON_LD);
        document.head.appendChild(script);
    }
}
