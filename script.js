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
// TERMINAL TYPING ANIMATION
// ==========================================

const terminalTypingElements = terminal
    ? [...terminal.querySelectorAll(".terminal-command, .terminal-output")]
    : [];

if (terminal && terminalTypingElements.length) {

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const originalTerminalText = terminalTypingElements.map(element =>
        element.textContent.replace(/\s+/g, " ").trim()
    );

    if (!prefersReducedMotion) {

        terminalTypingElements.forEach(element => {
            element.textContent = "";
        });

        terminal.classList.add("terminal-is-typing");

        const sleep = milliseconds =>
            new Promise(resolve => setTimeout(resolve, milliseconds));

        async function typeTerminalLine(element, text) {

            element.classList.add("terminal-type-caret");

            for (const character of text) {

                element.textContent += character;

                const delay =
                    character === " "
                        ? 13
                        : 20 + Math.random() * 15;

                await sleep(delay);

            }

            element.classList.remove("terminal-type-caret");
        }


        async function playTerminalTyping() {

            await sleep(300);

            for (
                let i = 0;
                i < terminalTypingElements.length;
                i++
            ) {

                await typeTerminalLine(
                    terminalTypingElements[i],
                    originalTerminalText[i]
                );

                await sleep(
                    i === terminalTypingElements.length - 1
                        ? 0
                        : 145
                );

            }

            terminal.classList.remove("terminal-is-typing");
        }


        const terminalTypingObserver =
            new IntersectionObserver(
                entries => {

                    const entry = entries[0];

                    if (!entry.isIntersecting) return;

                    terminalTypingObserver.disconnect();

                    playTerminalTyping();

                },
                {
                    threshold: 0.4
                }
            );

        terminalTypingObserver.observe(terminal);

    }

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


// ==========================================
// CUSTOM CURSOR
// ==========================================

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (cursorDot && cursorRing) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    document.addEventListener("mousemove", e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

    });


    function animateCursor() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    // Enlarge cursor over interactive elements

    const interactiveElements =
        document.querySelectorAll(
            "a, button, .project-card, .game-card, .review, .social-button"
        );

    interactiveElements.forEach(element => {

        element.addEventListener("mouseenter", () => {

            document.body.classList.add("cursor-hover");

        });

        element.addEventListener("mouseleave", () => {

            document.body.classList.remove("cursor-hover");

        });

    });

}


// ==========================================
// ANIMATED COUNTERS
// ==========================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const counter = entry.target;

            const target =
                Number(counter.dataset.target);

            const suffix =
                counter.dataset.suffix || "";

            const duration = 1400;

            const startTime =
                performance.now();


            function updateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;

                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );

                const currentValue =
                    Math.floor(
                        target * eased
                    );

                counter.textContent =
                    currentValue + suffix;


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                } else {

                    counter.textContent =
                        target + suffix;

                }

            }

            requestAnimationFrame(
                updateCounter
            );

            observer.unobserve(counter);

        });

    },
    {
        threshold: 0.5
    }
);


counters.forEach(counter => {

    counterObserver.observe(counter);

});


// ==========================================
// ACTIVE NAV LINK
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const navLinks =
            document.querySelectorAll(
                ".nav-link"
            );

        const sections =
            document.querySelectorAll(
                "section"
            );


        // Click to highlight immediately

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                function() {

                    navLinks.forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );

                    this.classList.add(
                        "active"
                    );

                }
            );

        });


        // Automatically update highlight
        // while scrolling

        window.addEventListener(
            "scroll",
            () => {

                let current = "";

                const scrollPosition =
                    window.scrollY + 200;


                sections.forEach(section => {

                    const sectionTop =
                        section.offsetTop;

                    const sectionHeight =
                        section.offsetHeight;


                    if (
                        scrollPosition >=
                            sectionTop &&
                        scrollPosition <
                            sectionTop +
                            sectionHeight
                    ) {

                        current =
                            section.getAttribute(
                                "id"
                            );

                    }

                });


                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute(
                            "href"
                        ) ===
                        `#${current}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            }
        );

    }
);

// ==========================================
// AVAILABILITY POPOVER
// ==========================================

const availabilityStatus =
    document.querySelector(".hero-status");

if (availabilityStatus) {

    availabilityStatus.setAttribute(
        "role",
        "button"
    );

    availabilityStatus.setAttribute(
        "aria-expanded",
        "false"
    );


    function setAvailabilityOpen(open) {

        availabilityStatus.classList.toggle(
            "availability-open",
            open
        );

        availabilityStatus.setAttribute(
            "aria-expanded",
            String(open)
        );

    }


    availabilityStatus.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const isOpen =
                availabilityStatus.classList.contains(
                    "availability-open"
                );

            setAvailabilityOpen(!isOpen);

        }
    );


    // Keyboard support

    availabilityStatus.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                const isOpen =
                    availabilityStatus.classList.contains(
                        "availability-open"
                    );

                setAvailabilityOpen(!isOpen);

            }

        }
    );


    // Click anywhere else to close it

    document.addEventListener(
        "click",
        event => {

            if (
                !availabilityStatus.contains(
                    event.target
                )
            ) {

                setAvailabilityOpen(false);

            }

        }
    );

}