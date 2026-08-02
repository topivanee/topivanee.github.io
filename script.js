// Smooth scrolling

document.querySelectorAll("nav a").forEach(link=>{


link.addEventListener("click",()=>{


document.querySelector(
link.getAttribute("href")
)
.scrollIntoView({

behavior:"smooth"

});


});


});


const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

document.querySelectorAll(".vouches img").forEach(img => {

    img.addEventListener("click", () => {

        lightboxImage.src = img.src;
        lightbox.classList.add("active");

    });

});

lightbox.addEventListener("click", () => {

    lightbox.classList.remove("active");

});

// Create particles


window.addEventListener("load", () => {

const particles = document.getElementById("particles");

for(let i = 0; i < 80; i++){

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left = Math.random()*100 + "%";
    particle.style.animationDuration = (5 + Math.random()*10) + "s";
    particle.style.animationDelay = "0s";

    particles.appendChild(particle);

}

});
// Tab Filtering Logic for Showcase
const filterBtns = document.querySelectorAll(".filter-btn");
const showcaseCards = document.querySelectorAll(".showcase-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove 'active' class from all buttons and add to clicked button
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        showcaseCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");

            if (filterValue === "all" || filterValue === cardCategory) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    });
});

// =========================
// YOUTUBE BACKGROUND MUSIC & SFX (MOBILE OPTIMIZED)
// =========================

const YOUTUBE_VIDEO_ID = "sF80I-TQiW0";

const clickSound = document.getElementById("click-sound");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

if (clickSound) clickSound.volume = 0.3;

// 1. Filter out musicToggle explicitly from global UI click sound
const clickableElements = document.querySelectorAll(
    "a, button:not(#music-toggle), .card, .skill-card, .contact-card, .vouches img"
);

clickableElements.forEach(element => {
    element.addEventListener("pointerdown", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    });
});

// 2. YouTube Background Audio API Setup
let player;
let isPlaying = false;
let userInteracted = false;

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': YOUTUBE_VIDEO_ID,
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    if (player && typeof player.setVolume === 'function') {
        player.setVolume(20);
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
        if (musicToggle) musicToggle.classList.add("playing");
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        if (musicIcon) musicIcon.className = "fa-solid fa-volume-xmark";
        if (musicToggle) musicToggle.classList.remove("playing");
    }
}

function startMusic() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

function stopMusic() {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

// 3. User interaction listener (Handles touch & click reliably across mobile browsers)
const handleFirstInteraction = () => {
    if (!userInteracted) {
        userInteracted = true;
        startMusic();
    }
    // Remove listeners once activated
    window.removeEventListener("pointerdown", handleFirstInteraction);
    window.removeEventListener("keydown", handleFirstInteraction);
};

window.addEventListener("pointerdown", handleFirstInteraction);
window.addEventListener("keydown", handleFirstInteraction);

// 4. Toggle Button Listener (Isolated from global click listeners)
if (musicToggle) {
    const toggleAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        userInteracted = true;

        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    };

    // Use pointerdown to respond instantly on mobile touch without delay
    musicToggle.addEventListener("pointerdown", toggleAudio);
}

// =========================
// FOOTER BACK-TO-TOP BUTTON
// =========================

const backToTopBtn = document.getElementById("back-to-top");

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// =========================
// STATS NUMBER COUNTER ANIMATION
// =========================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 40; // Lower is faster

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '').replace('%', '');

            // Calculate increment size
            const inc = Math.max(1, Math.ceil(target / speed));

            if (count < target) {
                let nextCount = count + inc;
                if (nextCount > target) nextCount = target;

                // Add symbols based on label
                if (target === 100) {
                    counter.innerText = nextCount + '%';
                } else if (target >= 10) {
                    counter.innerText = nextCount + '+';
                } else {
                    counter.innerText = nextCount;
                }

                setTimeout(updateCount, 30);
            } else {
                if (target === 100) {
                    counter.innerText = target + '%';
                } else if (target >= 10) {
                    counter.innerText = target + '+';
                } else {
                    counter.innerText = target;
                }
            }
        };

        updateCount();
    });
}

// Trigger animation on DOM ready
document.addEventListener('DOMContentLoaded', animateCounters);