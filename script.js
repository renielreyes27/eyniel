const startBtn = document.getElementById("startBtn");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const heartContainer = document.querySelector(".heart-container");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const maxHeartCount = 12;
let heartInterval = null;

const gallerySection = document.getElementById("gallery");
const galleryParticles = document.querySelector(".gallery-particles");
const memoryCardTriggers = document.querySelectorAll(".memory-card__trigger");
const memoryUnlockButtons = document.querySelectorAll(".memory-unlock");
const memoryModalBackdrop = document.querySelector(".memory-modal-backdrop");
const memoryModal = document.querySelector(".memory-modal");
const memoryModalClose = document.querySelector(".memory-modal__close");
const memoryModalImage = document.querySelector(".memory-modal__image");
const memoryModalTitle = document.getElementById("memory-modal-title");
const memoryModalDescription = document.getElementById("memory-modal-description");
const memoryModalDate = document.getElementById("memory-modal-date");
let activeTrigger = null;
let galleryObserver = null;
let particleInterval = null;
let parallaxFrame = null;
let supportsPassive = false;

try {
    const opts = Object.defineProperty({}, "passive", {
        get() {
            supportsPassive = true;
        }
    });
    window.addEventListener("test", null, opts);
    window.removeEventListener("test", null, opts);
} catch (e) {
    supportsPassive = false;
}

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

function isGalleryVisible() {
    if (!gallerySection) return false;
    const rect = gallerySection.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

function createGalleryParticle() {
    if (prefersReducedMotion || !galleryParticles || document.visibilityState !== "visible") return;

    const particles = galleryParticles.querySelectorAll(".gallery-particle");
    if (particles.length >= 20) return;

    const particle = document.createElement("div");
    particle.className = "gallery-particle";
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.opacity = `${0.2 + Math.random() * 0.3}`;

    galleryParticles.appendChild(particle);

    requestAnimationFrame(() => {
        particle.style.transform = `translateY(-32px) scale(${0.6 + Math.random() * 0.6})`;
        particle.style.opacity = "0";
    });

    particle.addEventListener("transitionend", () => {
        particle.remove();
    });
}

function startGalleryParticles() {
    if (!galleryParticles || prefersReducedMotion || particleInterval || document.visibilityState !== "visible") return;

    particleInterval = setInterval(() => {
        if (isGalleryVisible()) {
            createGalleryParticle();
        }
    }, 400);
}

function stopGalleryParticles() {
    if (particleInterval) {
        clearInterval(particleInterval);
        particleInterval = null;
    }
    if (galleryParticles) {
        galleryParticles.innerHTML = "";
    }
}

function createBurstHeart(x, y) {
    if (prefersReducedMotion) return;

    const burst = document.createElement("div");
    burst.className = "burst-heart";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;

    document.body.appendChild(burst);

    requestAnimationFrame(() => {
        burst.style.transform = "translate(-50%, -50%) translateY(-28px) scale(1.1) rotate(45deg)";
        burst.style.opacity = "0";
    });

    burst.addEventListener("transitionend", () => {
        burst.remove();
    });
}

function openMemoryModal(triggerButton) {
    const modalElements = [
        memoryModalBackdrop,
        memoryModal,
        memoryModalClose,
        memoryModalImage,
        memoryModalTitle,
        memoryModalDescription
    ];

    if (modalElements.some((element) => !element)) {
        console.error("Memory modal: required modal elements are missing.");
        return;
    }

    const card = triggerButton.closest(".memory-card");
    if (!card) {
        console.error("Memory modal: the selected trigger is not inside a memory card.");
        return;
    }

    // Read existing DOM values from the card using attributes and textContent
    const cardImage = card.querySelector(".memory-card__image");
    const cardTitle = card.querySelector(".memory-card__title");
    const cardCaption = card.querySelector(".memory-card__caption");
    const cardDate = card.querySelector(".memory-card__date");

    if (!cardImage || !cardTitle || !cardCaption) {
        console.error("Memory modal: the selected card is missing its image, title, or caption.", card);
        return;
    }

    // Read the literal attribute so file:// keeps paths such as images/memory1.jpg.
    const imageSrc = cardImage.getAttribute("src");
    const imageAlt = cardImage.getAttribute("alt");
    const titleText = cardTitle.textContent.trim();
    const captionText = cardCaption.textContent.trim();
    const dateText = cardDate ? cardDate.textContent.trim() : "";

    if (!imageSrc || imageAlt === null || !titleText || !captionText) {
        console.error("Memory modal: the selected card has incomplete image, alt text, title, or caption content.", card);
        return;
    }

    // Populate modal elements BEFORE removing hidden state
    memoryModalImage.setAttribute("src", imageSrc);
    memoryModalImage.setAttribute("alt", imageAlt);
    memoryModalTitle.textContent = titleText;
    memoryModalDescription.textContent = captionText;

    if (memoryModalDate) {
        if (dateText) {
            memoryModalDate.textContent = dateText;
            memoryModalDate.hidden = false;
        } else {
            memoryModalDate.hidden = true;
        }
    }

    // Finally make modal visible and lock scroll, then move focus to close
    activeTrigger = triggerButton;
    memoryModalBackdrop.hidden = false;
    memoryModalBackdrop.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    if (memoryModalClose) {
        memoryModalClose.focus();
    }
}

function closeMemoryModal() {
    if (!memoryModalBackdrop) return;
    memoryModalBackdrop.hidden = true;
    memoryModalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (activeTrigger) {
        activeTrigger.focus();
        activeTrigger = null;
    }
}

function trapModalFocus(event) {
    if (!memoryModalBackdrop || memoryModalBackdrop.hidden) return;
    const focusable = memoryModalBackdrop.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
}

function onDocumentKeyDown(event) {
    if (event.key === "Escape" && memoryModalBackdrop && !memoryModalBackdrop.hidden) {
        event.preventDefault();
        closeMemoryModal();
    }
}

memoryCardTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        createBurstHeart(rect.left + rect.width / 2, rect.top + rect.height / 2 + window.scrollY);
        openMemoryModal(event.currentTarget);
    });
    trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            trigger.click();
        }
    });
});

memoryUnlockButtons.forEach((unlock) => {
    const secretMessage = unlock.parentElement.querySelector(".memory-secret-message");
    unlock.addEventListener("click", () => {
        if (secretMessage) {
            secretMessage.hidden = false;
        }
    });
});

if (memoryModalClose) {
    memoryModalClose.addEventListener("click", () => {
        closeMemoryModal();
    });
}

if (memoryModalBackdrop) {
    memoryModalBackdrop.addEventListener("click", (event) => {
        if (event.target === memoryModalBackdrop) {
            closeMemoryModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (memoryModalBackdrop && !memoryModalBackdrop.hidden) {
        trapModalFocus(event);
        onDocumentKeyDown(event);
    }
});

function updateParallax() {
    if (prefersReducedMotion || window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    const cards = document.querySelectorAll(".memory-card__image-wrap");
    cards.forEach((wrap) => {
        const rect = wrap.getBoundingClientRect();
        const speed = 0.08;
        const offset = (rect.top - window.innerHeight / 2) * speed;
        wrap.style.transform = `translateY(${offset}px)`;
    });
}

function resetParallax() {
    document.querySelectorAll(".memory-card__image-wrap").forEach((wrap) => {
        wrap.style.transform = "translateY(0)";
    });
}

function onScroll() {
    if (prefersReducedMotion) return;
    if (parallaxFrame) {
        cancelAnimationFrame(parallaxFrame);
    }
    parallaxFrame = requestAnimationFrame(() => {
        updateParallax();
    });
}

function onVisibilityChange() {
    if (document.visibilityState === "visible") {
        startHearts();
        startGalleryParticles();
    } else {
        stopHearts();
        stopGalleryParticles();
        if (parallaxFrame) {
            cancelAnimationFrame(parallaxFrame);
            parallaxFrame = null;
        }
    }
}

document.addEventListener("visibilitychange", onVisibilityChange);

if (window.IntersectionObserver && gallerySection) {
    galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startGalleryParticles();
            } else {
                stopGalleryParticles();
            }
        });
    }, { threshold: 0.15 });
    galleryObserver.observe(gallerySection);
} else {
    startGalleryParticles();
}

window.addEventListener("scroll", onScroll, supportsPassive ? { passive: true } : false);
window.addEventListener("resize", () => {
    if (prefersReducedMotion || window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(pointer: coarse)").matches) {
        resetParallax();
    } else {
        updateParallax();
    }
}, supportsPassive ? { passive: true } : false);

startHearts();
