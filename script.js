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
// YOUTUBE BACKGROUND MUSIC & SFX
// Track: A L E X - Nanda (sF80I-TQiW0)
// =========================

const YOUTUBE_VIDEO_ID = "sF80I-TQiW0";

const clickSound = document.getElementById("click-sound");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

if (clickSound) clickSound.volume = 0.3;

// 1. UI Click Sound
const clickableElements = document.querySelectorAll("a, button:not(#music-toggle), .card, .skill-card, .contact-card, .vouches img");
clickableElements.forEach(element => {
    element.addEventListener("click", () => {
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

// Global callback required by YouTube API
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': YOUTUBE_VIDEO_ID, // Required for loop to work
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    player.setVolume(20); // 20% volume for subtle chill ambient background
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        musicIcon.className = "fa-solid fa-volume-high";
        musicToggle.classList.add("playing");
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        musicIcon.className = "fa-solid fa-volume-xmark";
        musicToggle.classList.remove("playing");
    }
}

// 3. Play Music Function
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

// 4. Trigger on First Click anywhere (Bypasses browser autoplay restrictions)
document.addEventListener("click", () => {
    if (!userInteracted) {
        userInteracted = true;
        startMusic();
    }
}, { once: true });

// 5. Manual Toggle Button Listener
if (musicToggle) {
    musicToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents click SFX conflict
        userInteracted = true;

        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });
}

