// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


// ==========================================
// DISCORD BUTTON
// ==========================================

const discordButton = document.getElementById("discordButton");
const discordUsername = "topivanee";

if (discordButton) {
    discordButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(discordUsername);
            showToast("Discord username copied!");
        } catch (error) {
            showToast("Discord: " + discordUsername);
        }
    });
}


// ==========================================
// TOAST
// ==========================================

const toast = document.getElementById("toast");
let toastTimeout;

function showToast(message) {
    if (!toast) return;

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

        if (!targetID || targetID === "#") return;

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
// GLOBAL MOUSE GLOW
// ==========================================

const hero =
    document.querySelector(".hero");

const heroMouseGlow =
    document.getElementById("heroMouseGlow");

if (heroMouseGlow) {
    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener(
        "mousemove",
        event => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    );

    function animateMouseGlow() {
        glowX +=
            (mouseX - glowX) *
            0.08;

        glowY +=
            (mouseY - glowY) *
            0.08;

        heroMouseGlow.style.left =
            `${glowX}px`;

        heroMouseGlow.style.top =
            `${glowY}px`;

        requestAnimationFrame(
            animateMouseGlow
        );
    }

    animateMouseGlow();
}


// ==========================================
// HERO PORTRAIT / ORBIT MOTION
// ==========================================

const heroOrbitStage =
    document.getElementById("heroOrbitStage");

const heroProfileCard =
    document.getElementById("heroProfileCard");

if (
    hero &&
    heroOrbitStage &&
    heroProfileCard
) {
    let targetRotateX = 0;
    let targetRotateY = 0;

    let currentRotateX = 0;
    let currentRotateY = 0;

    let targetStageX = 0;
    let targetStageY = 0;

    let currentStageX = 0;
    let currentStageY = 0;

    hero.addEventListener(
        "mousemove",
        event => {
            if (window.innerWidth < 851) return;

            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            targetRotateY = x * 7;
            targetRotateX = y * -6;

            targetStageX = x * 9;
            targetStageY = y * 7;
        }
    );

    hero.addEventListener(
        "mouseleave",
        () => {
            targetRotateX = 0;
            targetRotateY = 0;

            targetStageX = 0;
            targetStageY = 0;
        }
    );

    function animateHeroPortrait() {
        currentRotateX +=
            (targetRotateX - currentRotateX) *
            0.08;

        currentRotateY +=
            (targetRotateY - currentRotateY) *
            0.08;

        currentStageX +=
            (targetStageX - currentStageX) *
            0.06;

        currentStageY +=
            (targetStageY - currentStageY) *
            0.06;

        heroProfileCard.style.setProperty(
            "--portrait-rotate-x",
            `${currentRotateX}deg`
        );

        heroProfileCard.style.setProperty(
            "--portrait-rotate-y",
            `${currentRotateY}deg`
        );

        heroOrbitStage.style.translate =
            `${currentStageX}px ${currentStageY}px`;

        requestAnimationFrame(
            animateHeroPortrait
        );
    }

    animateHeroPortrait();
}


// ==========================================
// LARGE PARTICLE FISH
// ==========================================

const fishCanvas =
    document.getElementById("dotCharacter");

if (fishCanvas) {
    const ctx =
        fishCanvas.getContext("2d");

    let width = 0;
    let height = 0;

    let dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    let particles = [];
    let bubbles = [];

    const mouse = {
        x: -1000,
        y: -1000
    };


    // ======================================
    // GEOMETRY HELPERS
    // ======================================

    function addPoint(
        points,
        x,
        y,
        type = "body"
    ) {
        points.push({
            x,
            y,
            type
        });
    }


    function addLine(
        points,
        x1,
        y1,
        x2,
        y2,
        amount,
        type = "body"
    ) {
        for (
            let i = 0;
            i < amount;
            i++
        ) {
            const t =
                i /
                Math.max(
                    amount - 1,
                    1
                );

            addPoint(
                points,
                x1 +
                    (x2 - x1) *
                    t,
                y1 +
                    (y2 - y1) *
                    t,
                type
            );
        }
    }


    function addCurve(
        points,
        startX,
        startY,
        controlX,
        controlY,
        endX,
        endY,
        amount,
        type = "body"
    ) {
        for (
            let i = 0;
            i < amount;
            i++
        ) {
            const t =
                i /
                Math.max(
                    amount - 1,
                    1
                );

            const inv =
                1 - t;

            const x =
                inv *
                    inv *
                    startX +
                2 *
                    inv *
                    t *
                    controlX +
                t *
                    t *
                    endX;

            const y =
                inv *
                    inv *
                    startY +
                2 *
                    inv *
                    t *
                    controlY +
                t *
                    t *
                    endY;

            addPoint(
                points,
                x,
                y,
                type
            );
        }
    }


    function addEllipse(
        points,
        cx,
        cy,
        radiusX,
        radiusY,
        amount,
        type = "body"
    ) {
        for (
            let i = 0;
            i < amount;
            i++
        ) {
            const angle =
                (
                    i /
                    amount
                ) *
                Math.PI *
                2;

            addPoint(
                points,
                cx +
                    Math.cos(angle) *
                    radiusX,
                cy +
                    Math.sin(angle) *
                    radiusY,
                type
            );
        }
    }


    function pointInsideFish(
        x,
        y,
        centerX,
        centerY,
        bodyWidth,
        bodyHeight
    ) {
        const nx =
            (x - centerX) /
            (bodyWidth * .5);

        const ny =
            (y - centerY) /
            (bodyHeight * .5);

        return (
            nx * nx +
            ny * ny
        ) <= 1;
    }


    // ======================================
    // BUILD FISH
    // ======================================

    function buildFish() {
        const points = [];

        const centerX =
            width * .53;

        const centerY =
            height * .46;

        const bodyWidth =
            width * .50;

        const bodyHeight =
            height * .28;

        const frontX =
            centerX +
            bodyWidth * .5;

        const backX =
            centerX -
            bodyWidth * .5;


        // Upper body
        addCurve(
            points,
            backX,
            centerY,

            centerX -
                bodyWidth * .08,

            centerY -
                bodyHeight * .72,

            frontX,

            centerY -
                bodyHeight * .05,

            90,
            "body"
        );


        // Lower body
        addCurve(
            points,

            frontX,

            centerY -
                bodyHeight * .05,

            centerX,

            centerY +
                bodyHeight * .72,

            backX,
            centerY,

            90,
            "body"
        );


        // ==================================
        // TAIL
        // ==================================

        const tailEndX =
            backX -
            width * .19;


        addLine(
            points,

            backX,
            centerY,

            tailEndX,

            centerY -
                height * .16,

            36,
            "tail"
        );


        addCurve(
            points,

            tailEndX,

            centerY -
                height * .16,

            tailEndX +
                width * .055,

            centerY,

            tailEndX,

            centerY +
                height * .16,

            44,
            "tail"
        );


        addLine(
            points,

            tailEndX,

            centerY +
                height * .16,

            backX,
            centerY,

            36,
            "tail"
        );


        // Tail spokes

        addLine(
            points,

            backX -
                width * .025,

            centerY,

            tailEndX,

            centerY -
                height * .13,

            18,
            "detail"
        );


        addLine(
            points,

            backX -
                width * .025,

            centerY,

            tailEndX,

            centerY +
                height * .13,

            18,
            "detail"
        );


        // ==================================
        // TOP FIN
        // ==================================

        const topFinX =
            centerX -
            bodyWidth * .08;


        addCurve(
            points,

            topFinX -
                width * .075,

            centerY -
                bodyHeight * .48,

            topFinX,

            centerY -
                bodyHeight * 1.15,

            topFinX +
                width * .11,

            centerY -
                bodyHeight * .45,

            36,
            "fin"
        );


        addLine(
            points,

            topFinX +
                width * .11,

            centerY -
                bodyHeight * .45,

            topFinX -
                width * .075,

            centerY -
                bodyHeight * .48,

            22,
            "fin"
        );


        // ==================================
        // BOTTOM FIN
        // ==================================

        const bottomFinX =
            centerX +
            bodyWidth * .03;


        addCurve(
            points,

            bottomFinX -
                width * .05,

            centerY +
                bodyHeight * .48,

            bottomFinX,

            centerY +
                bodyHeight * 1.02,

            bottomFinX +
                width * .095,

            centerY +
                bodyHeight * .43,

            30,
            "fin"
        );


        // ==================================
        // SIDE FIN
        // ==================================

        addCurve(
            points,

            centerX +
                width * .01,

            centerY +
                height * .015,

            centerX +
                width * .14,

            centerY +
                height * .09,

            centerX +
                width * .025,

            centerY +
                height * .135,

            34,
            "fin"
        );


        addLine(
            points,

            centerX +
                width * .025,

            centerY +
                height * .135,

            centerX +
                width * .01,

            centerY +
                height * .015,

            18,
            "fin"
        );


        // ==================================
        // EYE
        // ==================================

        const eyeX =
            frontX -
            width * .075;

        const eyeY =
            centerY -
            height * .045;


        addEllipse(
            points,

            eyeX,
            eyeY,

            11,
            11,

            22,

            "eye"
        );


        addEllipse(
            points,

            eyeX,
            eyeY,

            3.2,
            3.2,

            9,

            "eyeCore"
        );


        // ==================================
        // GILL
        // ==================================

        addCurve(
            points,

            frontX -
                width * .13,

            centerY -
                height * .075,

            frontX -
                width * .16,

            centerY,

            frontX -
                width * .13,

            centerY +
                height * .082,

            22,

            "detail"
        );


        // ==================================
        // MOUTH
        // ==================================

        addCurve(
            points,

            frontX -
                width * .03,

            centerY +
                height * .01,

            frontX +
                width * .008,

            centerY +
                height * .022,

            frontX -
                width * .015,

            centerY +
                height * .038,

            12,

            "detail"
        );


        // ==================================
        // INTERNAL STRIPES
        // ==================================

        for (
            let row = -2;
            row <= 2;
            row++
        ) {
            const y =
                centerY +
                row *
                height *
                .042;

            const yNorm =
                Math.abs(
                    (
                        y -
                        centerY
                    ) /
                    (
                        bodyHeight *
                        .5
                    )
                );

            const halfWidth =
                bodyWidth *
                .42 *
                Math.sqrt(
                    Math.max(
                        0,
                        1 -
                            yNorm *
                            yNorm
                    )
                );


            addLine(
                points,

                centerX -
                    halfWidth,

                y,

                centerX +
                    halfWidth *
                    .72,

                y,

                26,

                "inner"
            );
        }


        // ==================================
        // INTERIOR DOTS
        // ==================================

        for (
            let i = 0;
            i < 190;
            i++
        ) {
            let x;
            let y;

            let tries = 0;

            do {
                x =
                    centerX +
                    (
                        Math.random() -
                        .5
                    ) *
                    bodyWidth;

                y =
                    centerY +
                    (
                        Math.random() -
                        .5
                    ) *
                    bodyHeight;

                tries++;
            }
            while (
                !pointInsideFish(
                    x,
                    y,
                    centerX,
                    centerY,
                    bodyWidth,
                    bodyHeight
                ) &&
                tries < 30
            );


            addPoint(
                points,
                x,
                y,
                "fill"
            );
        }


        return points;
    }


    // ======================================
    // CREATE PARTICLES
    // ======================================

    function createParticles() {
        const targets =
            buildFish();

        particles =
            targets.map(
                (target, index) => ({
                    x:
                        Math.random() *
                        width,

                    y:
                        Math.random() *
                        height,

                    targetX:
                        target.x,

                    targetY:
                        target.y,

                    baseTargetX:
                        target.x,

                    baseTargetY:
                        target.y,

                    type:
                        target.type,

                    size:
                        target.type ===
                        "eyeCore"
                            ? 2.1
                            : Math.random() *
                                1.35 +
                                .65,

                    brightness:
                        Math.random(),

                    seed:
                        Math.random() *
                        Math.PI *
                        2,

                    speed:
                        Math.random() *
                            .0028 +
                        .0014,

                    index
                })
            );
    }


    // ======================================
    // BUBBLES
    // ======================================

    function createBubbles() {
        bubbles = [];

        const amount = 12;

        for (
            let i = 0;
            i < amount;
            i++
        ) {
            bubbles.push({
                x:
                    width *
                        .82 +
                    Math.random() *
                        width *
                        .12,

                y:
                    height *
                        .28 +
                    Math.random() *
                        height *
                        .32,

                size:
                    Math.random() *
                        2.8 +
                    1,

                speed:
                    Math.random() *
                        .25 +
                    .12,

                drift:
                    Math.random() *
                        Math.PI *
                        2
            });
        }
    }


    // ======================================
    // RESIZE CANVAS
    // ======================================

    function resizeFishCanvas() {
        const rect =
            fishCanvas.getBoundingClientRect();

        width =
            rect.width;

        height =
            rect.height;

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        fishCanvas.width =
            Math.floor(
                width *
                dpr
            );

        fishCanvas.height =
            Math.floor(
                height *
                dpr
            );

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        createParticles();
        createBubbles();
    }


    // ======================================
    // FISH MOUSE INTERACTION
    // ======================================

    fishCanvas.addEventListener(
        "mousemove",
        event => {
            const rect =
                fishCanvas.getBoundingClientRect();

            mouse.x =
                event.clientX -
                rect.left;

            mouse.y =
                event.clientY -
                rect.top;
        }
    );


    fishCanvas.addEventListener(
        "mouseleave",
        () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }
    );


    // ======================================
    // FISH ANIMATION
    // ======================================

    function animateFish(time) {
        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const swim =
            Math.sin(
                time *
                .00125
            );


        ctx.save();

        ctx.globalCompositeOperation =
            "lighter";


        particles.forEach(
            particle => {
                let targetX =
                    particle.baseTargetX;

                let targetY =
                    particle.baseTargetY;


                // Whole fish gently swims

                targetX +=
                    swim *
                    5;


                // Small floating movement

                targetY +=
                    Math.sin(
                        time *
                            particle.speed +
                        particle.seed
                    ) *
                    1.7;


                // Tail animation

                if (
                    particle.type ===
                    "tail"
                ) {
                    const tailStrength =
                        Math.max(
                            0,
                            (
                                width *
                                    .35 -
                                particle.baseTargetX
                            ) /
                                (
                                    width *
                                    .25
                                )
                        );

                    targetY +=
                        Math.sin(
                            time *
                                .006 +
                            particle.baseTargetX *
                                .03
                        ) *
                        10 *
                        Math.min(
                            1,
                            tailStrength
                        );
                }


                // Fin animation

                if (
                    particle.type ===
                    "fin"
                ) {
                    targetY +=
                        Math.sin(
                            time *
                                .0045 +
                            particle.seed
                        ) *
                        3.2;
                }


                // Interior shimmer

                if (
                    particle.type ===
                    "fill"
                ) {
                    targetX +=
                        Math.cos(
                            time *
                                .0018 +
                            particle.seed
                        ) *
                        1.6;

                    targetY +=
                        Math.sin(
                            time *
                                .002 +
                            particle.seed
                        ) *
                        1.6;
                }


                // ==================================
                // MOUSE REPULSION
                // ==================================

                const dx =
                    particle.x -
                    mouse.x;

                const dy =
                    particle.y -
                    mouse.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                const radius =
                    76;


                if (
                    distance <
                    radius
                ) {
                    const force =
                        (
                            radius -
                            distance
                        ) /
                        radius;

                    targetX +=
                        (
                            dx /
                            Math.max(
                                distance,
                                1
                            )
                        ) *
                        force *
                        28;

                    targetY +=
                        (
                            dy /
                            Math.max(
                                distance,
                                1
                            )
                        ) *
                        force *
                        28;
                }


                // ==================================
                // FORMATION
                // ==================================

                particle.x +=
                    (
                        targetX -
                        particle.x
                    ) *
                    .078;

                particle.y +=
                    (
                        targetY -
                        particle.y
                    ) *
                    .078;


                // ==================================
                // PARTICLE COLORS
                // ==================================

                if (
                    particle.type ===
                    "eyeCore"
                ) {
                    ctx.fillStyle =
                        "rgba(255,255,255,.98)";
                }
                else if (
                    particle.type ===
                    "eye"
                ) {
                    ctx.fillStyle =
                        "rgba(210,202,255,.92)";
                }
                else if (
                    particle.type ===
                    "detail"
                ) {
                    ctx.fillStyle =
                        "rgba(220,215,240,.72)";
                }
                else {
                    const alpha =
                        .34 +
                        particle.brightness *
                        .5;

                    if (
                        particle.brightness >
                        .91
                    ) {
                        ctx.fillStyle =
                            `rgba(245,243,255,${alpha})`;
                    }
                    else {
                        ctx.fillStyle =
                            `rgba(169,150,255,${alpha})`;
                    }
                }


                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI *
                        2
                );

                ctx.fill();
            }
        );


        // ==================================
        // BUBBLES
        // ==================================

        bubbles.forEach(
            bubble => {
                bubble.y -=
                    bubble.speed;

                bubble.x +=
                    Math.sin(
                        time *
                            .0015 +
                        bubble.drift
                    ) *
                    .12;


                if (
                    bubble.y <
                    height *
                    .12
                ) {
                    bubble.y =
                        height *
                            .45 +
                        Math.random() *
                            height *
                            .18;

                    bubble.x =
                        width *
                            .81 +
                        Math.random() *
                            width *
                            .12;
                }


                ctx.strokeStyle =
                    "rgba(169,150,255,.24)";

                ctx.lineWidth =
                    .7;

                ctx.beginPath();

                ctx.arc(
                    bubble.x,
                    bubble.y,
                    bubble.size,
                    0,
                    Math.PI *
                        2
                );

                ctx.stroke();
            }
        );


        ctx.restore();


        requestAnimationFrame(
            animateFish
        );
    }


    resizeFishCanvas();


    window.addEventListener(
        "resize",
        resizeFishCanvas
    );


    requestAnimationFrame(
        animateFish
    );
}


// ==========================================
// VIDEO PORTFOLIO
// ==========================================

const videoProjects =
    document.querySelectorAll(".video-project");

const previewVideos =
    document.querySelectorAll("#work .project-video");

const videoModal =
    document.getElementById("videoModal");

const expandedVideo =
    document.getElementById("expandedVideo");

const modalClose =
    document.getElementById("modalClose");


// ==========================================
// AUTOPLAY WORK VIDEOS
// ==========================================

previewVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playPreview = () => {
        video.play().catch(() => {
            // Browser blocked autoplay.
        });
    };

    if (video.readyState >= 2) {
        playPreview();
    } else {
        video.addEventListener(
            "loadeddata",
            playPreview,
            {
                once: true
            }
        );
    }
});


// ==========================================
// PAUSE VIDEOS OFF SCREEN
// ==========================================

if ("IntersectionObserver" in window) {
    const previewObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const video =
                        entry.target;

                    if (
                        entry.isIntersecting
                    ) {
                        video
                            .play()
                            .catch(() => {});
                    }
                    else {
                        video.pause();
                    }
                });
            },
            {
                rootMargin:
                    "150px 0px",

                threshold:
                    0.01
            }
        );


    previewVideos.forEach(video => {
        previewObserver.observe(video);
    });
}


// ==========================================
// OPEN VIDEO BY CLICKING PREVIEW
// ==========================================

videoProjects.forEach(project => {
    const video =
        project.querySelector(
            ".project-video"
        );

    const playButton =
        project.querySelector(
            ".play-button"
        );

    if (!video) return;


    if (playButton) {
        playButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                openVideo(
                    video.currentSrc ||
                    video.src
                );
            }
        );
    }


    project.addEventListener(
        "click",
        () => {
            openVideo(
                video.currentSrc ||
                video.src
            );
        }
    );
});


// ==========================================
// PROJECT ARROW BUTTONS
// ==========================================

document
    .querySelectorAll(
        "#work .project-arrow"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                const card =
                    button.closest(
                        ".work-card, .project-card"
                    );

                if (!card) return;

                const video =
                    card.querySelector(
                        ".project-video"
                    );

                if (!video) return;

                openVideo(
                    video.currentSrc ||
                    video.src
                );
            }
        );

    });


// ==========================================
// OPEN FULL VIDEO MODAL
// ==========================================

function openVideo(src) {
    if (
        !videoModal ||
        !expandedVideo
    ) {
        return;
    }


    expandedVideo.pause();

    expandedVideo.src =
        src;

    expandedVideo.currentTime =
        0;

    expandedVideo.muted =
        false;

    expandedVideo.controls =
        true;

    expandedVideo.playsInline =
        true;


    videoModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    expandedVideo
        .play()
        .catch(() => {});
}


// ==========================================
// CLOSE FULL VIDEO MODAL
// ==========================================

function closeVideo() {
    if (
        !videoModal ||
        !expandedVideo
    ) {
        return;
    }


    videoModal.classList.remove(
        "active"
    );


    expandedVideo.pause();

    expandedVideo.removeAttribute(
        "src"
    );

    expandedVideo.load();


    document.body.style.overflow =
        "";


    previewVideos.forEach(video => {

        const rect =
            video.getBoundingClientRect();


        const isVisible =
            rect.bottom > 0 &&
            rect.top <
                window.innerHeight;


        if (isVisible) {
            video
                .play()
                .catch(() => {});
        }

    });
}


// ==========================================
// CLOSE BUTTON
// ==========================================

if (modalClose) {
    modalClose.addEventListener(
        "click",
        closeVideo
    );
}


// ==========================================
// CLICK OUTSIDE VIDEO
// ==========================================

if (videoModal) {
    videoModal.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                    videoModal ||
                event.target.classList.contains(
                    "modal-backdrop"
                )
            ) {
                closeVideo();
            }
        }
    );
}


// ==========================================
// ESCAPE TO CLOSE
// ==========================================

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
                "Escape" &&
            videoModal?.classList.contains(
                "active"
            )
        ) {
            closeVideo();
        }
    }
);


// ==========================================
// WORK SECTION
// VIEW MORE / SHOW LESS
// ==========================================

const workToggle =
    document.getElementById(
        "workToggle"
    );

const workMore =
    document.getElementById(
        "workMore"
    );

const workToggleText =
    document.getElementById(
        "workToggleText"
    );


if (
    workToggle &&
    workMore &&
    workToggleText
) {
    workToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                workMore.classList.toggle(
                    "open"
                );


            workToggle.classList.toggle(
                "active",
                isOpen
            );


            workToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            workToggleText.textContent =
                isOpen
                    ? "Show less"
                    : "View more work";


            if (isOpen) {
                requestAnimationFrame(
                    () => {
                        workMore
                            .querySelectorAll(
                                ".project-video"
                            )
                            .forEach(video => {
                                video
                                    .play()
                                    .catch(
                                        () => {}
                                    );
                            });
                    }
                );
            }

        }
    );
}


// ==========================================
// CUSTOM CROSSHAIR CURSOR
// ==========================================

const cursorDot =
    document.querySelector(
        ".cursor-dot"
    );

const cursorRing =
    document.querySelector(
        ".cursor-ring"
    );


if (
    cursorDot &&
    cursorRing
) {
    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let ringX =
        mouseX;

    let ringY =
        mouseY;


    document.addEventListener(
        "mousemove",
        event => {
            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            cursorDot.style.left =
                `${mouseX}px`;

            cursorDot.style.top =
                `${mouseY}px`;
        }
    );


    function animateCursor() {
        ringX +=
            (
                mouseX -
                ringX
            ) *
            .22;

        ringY +=
            (
                mouseY -
                ringY
            ) *
            .22;


        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            animateCursor
        );
    }


    animateCursor();


    const interactiveSelector =
        [
            "a",
            "button",
            ".project-card",
            ".game-card",
            ".review",
            ".social-button",
            ".hero-profile-card",
            ".dot-character"
        ].join(",");


    document.addEventListener(
        "mouseover",
        event => {

            if (
                event.target.closest(
                    interactiveSelector
                )
            ) {
                document.body.classList.add(
                    "cursor-hover"
                );
            }

        }
    );


    document.addEventListener(
        "mouseout",
        event => {

            const fromInteractive =
                event.target.closest(
                    interactiveSelector
                );


            const toInteractive =
                event.relatedTarget
                    ?.closest?.(
                        interactiveSelector
                    );


            if (
                fromInteractive &&
                !toInteractive
            ) {
                document.body.classList.remove(
                    "cursor-hover"
                );
            }

        }
    );


    document.addEventListener(
        "mousedown",
        () => {
            document.body.classList.add(
                "cursor-clicking"
            );
        }
    );


    document.addEventListener(
        "mouseup",
        () => {
            document.body.classList.remove(
                "cursor-clicking"
            );
        }
    );


    window.addEventListener(
        "blur",
        () => {
            document.body.classList.remove(
                "cursor-clicking",
                "cursor-hover"
            );
        }
    );
}


// ==========================================
// ANIMATED COUNTERS
// ==========================================

const counters =
    document.querySelectorAll(
        ".counter"
    );


const counterObserver =
    new IntersectionObserver(
        (
            entries,
            observer
        ) => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }


                const counter =
                    entry.target;


                const target =
                    Number(
                        counter.dataset.target
                    );


                const suffix =
                    counter.dataset.suffix ||
                    "";


                const duration =
                    1400;


                const startTime =
                    performance.now();


                function updateCounter(
                    currentTime
                ) {
                    const elapsed =
                        currentTime -
                        startTime;


                    const progress =
                        Math.min(
                            elapsed /
                                duration,
                            1
                        );


                    const eased =
                        1 -
                        Math.pow(
                            1 -
                                progress,
                            3
                        );


                    const currentValue =
                        Math.floor(
                            target *
                            eased
                        );


                    counter.textContent =
                        currentValue +
                        suffix;


                    if (
                        progress <
                        1
                    ) {
                        requestAnimationFrame(
                            updateCounter
                        );
                    }
                    else {
                        counter.textContent =
                            target +
                            suffix;
                    }
                }


                requestAnimationFrame(
                    updateCounter
                );


                observer.unobserve(
                    counter
                );

            });

        },
        {
            threshold: 0.5
        }
    );


counters.forEach(counter => {
    counterObserver.observe(
        counter
    );
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


        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    navLinks.forEach(
                        item =>
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


        const updateActiveNav =
            () => {

                let current =
                    "";


                const scrollPosition =
                    window.scrollY +
                    200;


                sections.forEach(
                    section => {

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

                    }
                );


                navLinks.forEach(
                    link => {

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

                    }
                );

            };


        window.addEventListener(
            "scroll",
            updateActiveNav,
            {
                passive: true
            }
        );


        updateActiveNav();

    }
);


// ==========================================
// AVAILABILITY POPOVER
// ==========================================

const availabilityStatus =
    document.querySelector(
        ".hero-status"
    );


if (availabilityStatus) {

    availabilityStatus.setAttribute(
        "role",
        "button"
    );


    availabilityStatus.setAttribute(
        "aria-expanded",
        "false"
    );


    function setAvailabilityOpen(
        open
    ) {

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


            setAvailabilityOpen(
                !isOpen
            );

        }
    );


    availabilityStatus.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                    "Enter" ||
                event.key ===
                    " "
            ) {
                event.preventDefault();


                const isOpen =
                    availabilityStatus.classList.contains(
                        "availability-open"
                    );


                setAvailabilityOpen(
                    !isOpen
                );
            }

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !availabilityStatus.contains(
                    event.target
                )
            ) {
                setAvailabilityOpen(
                    false
                );
            }

        }
    );
}