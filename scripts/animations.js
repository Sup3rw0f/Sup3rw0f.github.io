export function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".fade-in:not(.visible)");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    fadeElements.forEach(el => observer.observe(el));
}
