const startBtn = document.getElementById("startBtn");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade");
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
const memoryModalPrev = document.querySelector(".memory-modal__nav--prev");
const memoryModalNext = document.querySelector(".memory-modal__nav--next");
const memoryModalCounter = document.querySelector(".memory-modal__counter");
const memoryModalThumbnails = document.querySelector(".memory-modal__thumbnails");
let currentGallery = [];
let currentGalleryIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let activeTrigger = null;
let galleryObserver = null;
let particleInterval = null;
let parallaxFrame = null;
let supportsPassive = false;

// CENTRALIZED GALLERY DATA
// Maps the memory card index (0-5) to its specific array of images
const galleries = {
    0: [
        "images/memory1.jpg",
        "images/memory1-2.jpg",
        "images/memory1-3.jpg",
        "images/memory1-4.jpg"
    ],
    1: [
        "images/memory2.jpg",
        "images/memory2-2.jpg",
        "images/memory2-3.jpg"

    ],
    2: [
        "images/memory3.jpg",
        "images/memory3-2.jpg",
        "images/memory3-3.jpg"
    ],
    3: [
        "images/memory4.jpg",
        "images/memory4-2.jpg",
        "images/memory4-3.jpg"
    ],
    4: [
        "images/memory5.jpg",
        "images/memory5-2.jpg",
        "images/memory5-3.jpg"
    ],
    5: [
        "images/memory6.jpg",
        "images/memory6-2.jpg",
        "images/memory6-3.jpg",
        "images/memory6-4.jpg",
        "images/memory6-5.jpg"
    ]
};

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
        { threshold: 0.15 }
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

function preloadImage(index) {
    if (index >= 0 && index < currentGallery.length) {
        const img = new Image();
        img.src = currentGallery[index];
    }
}

function updateGalleryUI() {
    if (currentGallery.length > 1) {
        if (memoryModalPrev) memoryModalPrev.hidden = false;
        if (memoryModalNext) memoryModalNext.hidden = false;
        if (memoryModalCounter) {
            memoryModalCounter.hidden = false;
            memoryModalCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
        }
        if (memoryModalThumbnails) {
            memoryModalThumbnails.hidden = false;
            memoryModalThumbnails.innerHTML = '';
            currentGallery.forEach((imgSrc, index) => {
                const btn = document.createElement('button');
                btn.className = 'memory-modal__thumbnail-btn';
                if (index === currentGalleryIndex) btn.classList.add('active');

                const thumbImg = document.createElement('img');
                thumbImg.src = imgSrc;
                thumbImg.alt = `Thumbnail ${index + 1}`;
                thumbImg.className = 'memory-modal__thumbnail-img';
                thumbImg.setAttribute('loading', 'lazy');

                btn.appendChild(thumbImg);
                btn.addEventListener('click', () => changeModalImage(index));
                memoryModalThumbnails.appendChild(btn);
            });

            const activeBtn = memoryModalThumbnails.children[currentGalleryIndex];
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    } else {
        if (memoryModalPrev) memoryModalPrev.hidden = true;
        if (memoryModalNext) memoryModalNext.hidden = true;
        if (memoryModalCounter) memoryModalCounter.hidden = true;
        if (memoryModalThumbnails) memoryModalThumbnails.hidden = true;
    }

    preloadImage(currentGalleryIndex - 1);
    preloadImage(currentGalleryIndex + 1);
}

function changeModalImage(newIndex) {
    if (newIndex === currentGalleryIndex || newIndex < 0 || newIndex >= currentGallery.length) return;

    currentGalleryIndex = newIndex;
    if (memoryModalImage) {
        memoryModalImage.classList.add('fade-out');
        setTimeout(() => {
            memoryModalImage.setAttribute('src', currentGallery[currentGalleryIndex]);
            memoryModalImage.classList.remove('fade-out');
            updateGalleryUI();
        }, 300);
    }
}

function nextModalImage() {
    if (currentGallery.length <= 1) return;
    const newIndex = (currentGalleryIndex + 1) % currentGallery.length;
    changeModalImage(newIndex);
}

function prevModalImage() {
    if (currentGallery.length <= 1) return;
    const newIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
    changeModalImage(newIndex);
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextModalImage();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevModalImage();
    }
}

// UPDATE: Accept index parameter to load the correct gallery
function openMemoryModal(triggerButton, index) {
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

    const cardImage = card.querySelector(".memory-card__image");
    const cardTitle = card.querySelector(".memory-card__title");
    const cardCaption = card.querySelector(".memory-card__caption");
    const cardDate = card.querySelector(".memory-card__date");

    if (!cardImage || !cardTitle || !cardCaption) {
        console.error("Memory modal: the selected card is missing its image, title, or caption.", card);
        return;
    }

    const imageSrc = cardImage.getAttribute("src");
    const imageAlt = cardImage.getAttribute("alt");
    const titleText = cardTitle.textContent.trim();
    const captionText = cardCaption.textContent.trim();
    const dateText = cardDate ? cardDate.textContent.trim() : "";

    if (!imageSrc || imageAlt === null || !titleText || !captionText) {
        console.error("Memory modal: the selected card has incomplete image, alt text, title, or caption content.", card);
        return;
    }

    // UPDATE: Load gallery from centralized object based on card index, fallback to single image
    currentGallery = (galleries[index] && galleries[index].length > 0) ? galleries[index] : [imageSrc];
    currentGalleryIndex = 0;

    // Populate modal elements BEFORE removing hidden state
    memoryModalImage.setAttribute("src", currentGallery[0]);
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

    updateGalleryUI();

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
    if (memoryModalBackdrop && !memoryModalBackdrop.hidden) {
        if (event.key === "Escape") {
            event.preventDefault();
            closeMemoryModal();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            prevModalImage();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nextModalImage();
        }
    }
}

// UPDATE: Added 'index' parameter to the forEach loop to pass it into openMemoryModal
memoryCardTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        createBurstHeart(rect.left + rect.width / 2, rect.top + rect.height / 2 + window.scrollY);
        openMemoryModal(event.currentTarget, index); // Pass index here
    });
    trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            trigger.click();
        }
    });
});

if (memoryModalPrev) {
    memoryModalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevModalImage();
    });
}

if (memoryModalNext) {
    memoryModalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextModalImage();
    });
}

if (memoryModalImage) {
    memoryModalImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, supportsPassive ? { passive: true } : false);

    memoryModalImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, supportsPassive ? { passive: true } : false);
}

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

// --- BACKGROUND MUSIC LOGIC ---
const bgMusic = document.getElementById("bg-music");
let musicFadeInterval = null;
let hasUserInteracted = false;
let isGalleryVisibleFlag = false;

if (bgMusic) {
    bgMusic.volume = 0; // Start at volume 0 for fade-in
}

// Function to smoothly fade audio in or out
function fadeAudio(targetVolume, duration = 2500) {
    if (!bgMusic) return;
    
    clearInterval(musicFadeInterval);
    
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - bgMusic.volume) / steps;

    musicFadeInterval = setInterval(() => {
        let newVolume = bgMusic.volume + volumeStep;
        
        // Check if we reached the target volume
        if ((volumeStep > 0 && newVolume >= targetVolume) || 
            (volumeStep < 0 && newVolume <= targetVolume)) {
            bgMusic.volume = targetVolume;
            clearInterval(musicFadeInterval);
            
            // Pause if fading out completely
            if (targetVolume === 0) {
                bgMusic.pause();
            }
        } else {
            bgMusic.volume = newVolume;
        }
    }, stepTime);
}

function playGalleryMusic() {
    if (!bgMusic || !hasUserInteracted) return;
    
    // Play the audio and fade in to 100% volume
    bgMusic.play().then(() => {
        fadeAudio(1.0); 
    }).catch(error => {
        console.warn("Autoplay blocked:", error);
    });
}

function pauseGalleryMusic() {
    if (!bgMusic) return;
    // Fade out to 0% volume
    fadeAudio(0);
}

// Handle browser autoplay policies by waiting for first user interaction
function handleFirstInteraction() {
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        
        // If the gallery is already visible when they interact, start the music
        if (isGalleryVisibleFlag) {
            playGalleryMusic();
        }
        
        // Remove the listeners after the first interaction
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
    }
}

document.addEventListener("click", handleFirstInteraction);
document.addEventListener("keydown", handleFirstInteraction);
document.addEventListener("touchstart", handleFirstInteraction);
// ------------------------------

if (window.IntersectionObserver && gallerySection) {
    galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                isGalleryVisibleFlag = true;
                startGalleryParticles();
                playGalleryMusic();
            } else {
                isGalleryVisibleFlag = false;
                stopGalleryParticles();
                pauseGalleryMusic();
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
