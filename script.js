// ==========================================
// MOBILE NAVIGATION
// ==========================================

const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.querySelector(".navbar");

mobileMenu.addEventListener("click", () => {
    navbar.classList.toggle("mobile-open");
});


// Close mobile navigation after clicking a link

document.querySelectorAll(".navbar nav a").forEach(link => {

    link.addEventListener("click", () => {
        navbar.classList.remove("mobile-open");
    });

});


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {
    observer.observe(element);
});


// ==========================================
// DISCORD BUTTON
// ==========================================

const discordButton = document.getElementById("discordButton");

const discordUsername = "topivanee";

discordButton.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(discordUsername);

        showToast("Discord username copied!");

    } catch (error) {

        showToast("Discord: " + discordUsername);

    }

});


// ==========================================
// TOAST
// ==========================================

const toast = document.getElementById("toast");

let toastTimeout;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ==========================================
// SMOOTH NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetID = link.getAttribute("href");

        if (targetID === "#") return;

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// ==========================================
// PROJECT CARD TILT
// ==========================================

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", event => {

        if (window.innerWidth < 850) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;

        card.style.transform = `
            perspective(900px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-4px)
        `;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

// ==========================================
// HERO MOUSE GLOW
// ==========================================

const hero = document.querySelector(".hero");
const heroMouseGlow = document.getElementById("heroMouseGlow");

if (hero && heroMouseGlow) {

    hero.addEventListener("mousemove", event => {

        heroMouseGlow.style.left = `${event.clientX}px`;
        heroMouseGlow.style.top = `${event.clientY}px`;

    });

}


// ==========================================
// HERO TERMINAL PARALLAX
// ==========================================

const terminal = document.querySelector(".hero-terminal");

if (terminal) {

    hero.addEventListener("mousemove", event => {

        if (window.innerWidth < 950) return;

        const rect = hero.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

        const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

        const rotateY = x * 5;
        const rotateX = y * -4;

        terminal.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateY(-2px)
        `;

    });


    hero.addEventListener("mouseleave", () => {

        terminal.style.transform = `
            rotateY(-3deg)
            rotateX(2deg)
        `;

    });

}


// ==========================================
// VIDEO PORTFOLIO
// ==========================================

const videoProjects = document.querySelectorAll(".video-project");

const videoModal = document.getElementById("videoModal");
const expandedVideo = document.getElementById("expandedVideo");
const modalClose = document.getElementById("modalClose");


// ------------------------------------------
// HOVER PLAY / PAUSE
// ------------------------------------------

videoProjects.forEach(project => {

    const video = project.querySelector(".project-video");
    const playButton = project.querySelector(".play-button");

    project.addEventListener("mouseenter", () => {

        video.play().catch(() => {});

    });


    project.addEventListener("mouseleave", () => {

        video.pause();

        video.currentTime = 0;

    });


    // Play button

    playButton.addEventListener("click", event => {

        event.stopPropagation();

        openVideo(video.src);

    });


    // Clicking the video

    project.addEventListener("click", event => {

        if (event.target.closest(".project-arrow")) {
            return;
        }

        openVideo(video.src);

    });

});


// ------------------------------------------
// OPEN VIDEO
// ------------------------------------------

function openVideo(src) {

    expandedVideo.src = src;

    videoModal.classList.add("active");

    document.body.style.overflow = "hidden";

    expandedVideo.play().catch(() => {});

}


// ------------------------------------------
// CLOSE VIDEO
// ------------------------------------------

function closeVideo() {

    videoModal.classList.remove("active");

    expandedVideo.pause();

    expandedVideo.removeAttribute("src");

    expandedVideo.load();

    document.body.style.overflow = "";

}


modalClose.addEventListener("click", closeVideo);


// Clicking outside video closes modal

videoModal.addEventListener("click", event => {

    if (
        event.target === videoModal ||
        event.target.classList.contains("modal-backdrop")
    ) {

        closeVideo();

    }

});


// ------------------------------------------
// ESC KEY
// ------------------------------------------

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (videoModal.classList.contains("active")) {

            closeVideo();

        }

    }

});