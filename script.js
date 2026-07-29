const startBtn = document.getElementById("startBtn");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const heartContainer = document.querySelector(".heart-container");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const maxHeartCount = 12;
let heartInterval = null;

function smoothScrollTo(target) {
    if (!target) return;

    target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
    });
}

if (startBtn) {
    startBtn.addEventListener("click", () => {
        smoothScrollTo(document.getElementById("story"));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const anchor = event.currentTarget.getAttribute("href");
        const target = document.querySelector(anchor);
        if (target) {
            smoothScrollTo(target);
        }
    });
});

if (window.IntersectionObserver) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => {
        item.classList.add("is-visible");
    });
}

function createHeart() {
    if (!heartContainer || document.visibilityState !== "visible") return;

    const currentHearts = heartContainer.querySelectorAll(".heart").length;
    if (currentHearts >= maxHeartCount) return;

    const heart = document.createElement("div");
    heart.className = "heart animate";
    const leftPercent = 8 + Math.random() * 84;
    const startBottom = 10 + Math.random() * 10;

    heart.style.left = `${leftPercent}%`;
    heart.style.bottom = `${startBottom}px`;

    heartContainer.appendChild(heart);

    heart.addEventListener("animationend", () => {
        heart.remove();
    });
}

function startHearts() {
    if (!heartContainer || prefersReducedMotion || heartInterval || document.visibilityState !== "visible") return;

    heartInterval = setInterval(createHeart, 900);
}

function stopHearts() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        startHearts();
    } else {
        stopHearts();
    }
});

startHearts();