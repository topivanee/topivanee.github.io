"use strict";

// ==========================================
// GLOBAL SETTINGS
// ==========================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("visible"));
} else {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// ==========================================
// TOAST + DISCORD
// ==========================================

const toast = document.getElementById("toast");
const discordButton = document.getElementById("discordButton");
const discordUsername = "topivanee";

let toastTimeout = 0;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

if (discordButton) {
    discordButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(discordUsername);

            showToast("Discord username copied!");
        } catch {
            showToast(`Discord: ${discordUsername}`);
        }
    });
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
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });

        if (location.hash !== targetID) {
            history.pushState(
                null,
                "",
                targetID
            );
        }
    });
});

// ==========================================
// PROJECT CARD TILT
// ==========================================

if (
    hasFinePointer &&
    !prefersReducedMotion
) {
    document
        .querySelectorAll(".project-card")
        .forEach(card => {
            card.addEventListener(
                "pointermove",
                event => {
                    if (window.innerWidth < 850) return;

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const rotateX =
                        (
                            (
                                y -
                                rect.height / 2
                            ) /
                            (
                                rect.height / 2
                            )
                        ) *
                        -2;

                    const rotateY =
                        (
                            (
                                x -
                                rect.width / 2
                            ) /
                            (
                                rect.width / 2
                            )
                        ) *
                        2;

                    card.style.transform =
                        `perspective(900px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-4px)`;
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {
                    card.style.transform =
                        "";
                }
            );
        });
}

// ==========================================
// GLOBAL MOUSE GLOW
// ==========================================

const hero =
    document.querySelector(".hero");

const heroMouseGlow =
    document.getElementById(
        "heroMouseGlow"
    );

if (
    heroMouseGlow &&
    hasFinePointer &&
    !prefersReducedMotion
) {
    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let glowX =
        mouseX;

    let glowY =
        mouseY;

    let glowFrame =
        0;

    document.addEventListener(
        "pointermove",
        event => {
            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            if (!glowFrame) {
                glowFrame =
                    requestAnimationFrame(
                        animateMouseGlow
                    );
            }
        },
        {
            passive: true
        }
    );

    function animateMouseGlow() {
        glowX +=
            (
                mouseX -
                glowX
            ) *
            0.08;

        glowY +=
            (
                mouseY -
                glowY
            ) *
            0.08;

        heroMouseGlow.style.setProperty(
            "--glow-x",
            `${glowX}px`
        );

        heroMouseGlow.style.setProperty(
            "--glow-y",
            `${glowY}px`
        );

        const moving =
            Math.abs(
                mouseX -
                glowX
            ) >
                0.2 ||
            Math.abs(
                mouseY -
                glowY
            ) >
                0.2;

        glowFrame =
            moving
                ? requestAnimationFrame(
                    animateMouseGlow
                )
                : 0;
    }
}

// ==========================================
// HERO PORTRAIT / ORBIT MOTION
// ==========================================

const heroOrbitStage =
    document.getElementById(
        "heroOrbitStage"
    );

const heroProfileCard =
    document.getElementById(
        "heroProfileCard"
    );

if (
    hero &&
    heroOrbitStage &&
    heroProfileCard &&
    hasFinePointer &&
    !prefersReducedMotion
) {
    let targetRotateX = 0;
    let targetRotateY = 0;

    let currentRotateX = 0;
    let currentRotateY = 0;

    let targetStageX = 0;
    let targetStageY = 0;

    let currentStageX = 0;
    let currentStageY = 0;

    let portraitFrame = 0;

    function wakePortrait() {
        if (!portraitFrame) {
            portraitFrame =
                requestAnimationFrame(
                    animateHeroPortrait
                );
        }
    }

    hero.addEventListener(
        "pointermove",
        event => {
            if (window.innerWidth < 851) {
                return;
            }

            const rect =
                hero.getBoundingClientRect();

            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                    rect.width -
                0.5;

            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                    rect.height -
                0.5;

            targetRotateY =
                x *
                7;

            targetRotateX =
                y *
                -6;

            targetStageX =
                x *
                9;

            targetStageY =
                y *
                7;

            wakePortrait();
        },
        {
            passive: true
        }
    );

    hero.addEventListener(
        "pointerleave",
        () => {
            targetRotateX =
                0;

            targetRotateY =
                0;

            targetStageX =
                0;

            targetStageY =
                0;

            wakePortrait();
        }
    );

    function animateHeroPortrait() {
        currentRotateX +=
            (
                targetRotateX -
                currentRotateX
            ) *
            0.08;

        currentRotateY +=
            (
                targetRotateY -
                currentRotateY
            ) *
            0.08;

        currentStageX +=
            (
                targetStageX -
                currentStageX
            ) *
            0.06;

        currentStageY +=
            (
                targetStageY -
                currentStageY
            ) *
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

        const settled =
            Math.abs(
                targetRotateX -
                currentRotateX
            ) <
                0.02 &&
            Math.abs(
                targetRotateY -
                currentRotateY
            ) <
                0.02 &&
            Math.abs(
                targetStageX -
                currentStageX
            ) <
                0.02 &&
            Math.abs(
                targetStageY -
                currentStageY
            ) <
                0.02;

        portraitFrame =
            settled
                ? 0
                : requestAnimationFrame(
                    animateHeroPortrait
                );
    }
}

// ==========================================
// PARTICLE FISH
// ==========================================

const fishCanvas =
    document.getElementById(
        "dotCharacter"
    );

if (
    fishCanvas &&
    hasFinePointer &&
    window.innerWidth >
        1050
) {
    const ctx =
        fishCanvas.getContext(
            "2d"
        );

    const mouse = {
        x: -9999,
        y: -9999
    };

    let width = 0;
    let height = 0;
    let dpr = 1;

    let particles = [];
    let bubbles = [];

    let fishFrame = 0;
    let fishInView = true;
    let resizeFrame = 0;

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
                    (
                        x2 -
                        x1
                    ) *
                        t,
                y1 +
                    (
                        y2 -
                        y1
                    ) *
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
                1 -
                t;

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
        rx,
        ry,
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
                    Math.cos(
                        angle
                    ) *
                        rx,
                cy +
                    Math.sin(
                        angle
                    ) *
                        ry,
                type
            );
        }
    }

    function insideEllipse(
        x,
        y,
        cx,
        cy,
        rx,
        ry
    ) {
        const nx =
            (
                x -
                cx
            ) /
            rx;

        const ny =
            (
                y -
                cy
            ) /
            ry;

        return (
            nx *
                nx +
            ny *
                ny
        ) <=
            1;
    }

    function buildFishTargets() {
        const points = [];

        const cx =
            width *
            0.54;

        const cy =
            height *
            0.47;

        const rx =
            width *
            0.245;

        const ry =
            height *
            0.14;

        const frontX =
            cx +
            rx;

        const backX =
            cx -
            rx;

        const tailX =
            backX -
            width *
                0.18;

        // MAIN BODY

        addCurve(
            points,

            backX,
            cy,

            cx -
                rx *
                    0.15,

            cy -
                ry *
                    1.45,

            frontX,

            cy -
                ry *
                    0.08,

            100,

            "body"
        );

        addCurve(
            points,

            frontX,

            cy -
                ry *
                    0.08,

            cx,

            cy +
                ry *
                    1.45,

            backX,

            cy,

            100,

            "body"
        );

        // TAIL

        addLine(
            points,

            backX,
            cy,

            tailX,

            cy -
                height *
                    0.16,

            42,

            "tail"
        );

        addCurve(
            points,

            tailX,

            cy -
                height *
                    0.16,

            tailX +
                width *
                    0.055,

            cy,

            tailX,

            cy +
                height *
                    0.16,

            48,

            "tail"
        );

        addLine(
            points,

            tailX,

            cy +
                height *
                    0.16,

            backX,
            cy,

            42,

            "tail"
        );

        // TAIL DETAILS

        addLine(
            points,

            backX -
                width *
                    0.02,

            cy,

            tailX,

            cy -
                height *
                    0.12,

            20,

            "detail"
        );

        addLine(
            points,

            backX -
                width *
                    0.02,

            cy,

            tailX,

            cy +
                height *
                    0.12,

            20,

            "detail"
        );

        // TOP FIN

        addCurve(
            points,

            cx -
                width *
                    0.11,

            cy -
                ry *
                    0.78,

            cx -
                width *
                    0.02,

            cy -
                height *
                    0.2,

            cx +
                width *
                    0.07,

            cy -
                ry *
                    0.75,

            38,

            "fin"
        );

        // BOTTOM FIN

        addCurve(
            points,

            cx -
                width *
                    0.04,

            cy +
                ry *
                    0.8,

            cx +
                width *
                    0.01,

            cy +
                height *
                    0.19,

            cx +
                width *
                    0.09,

            cy +
                ry *
                    0.72,

            34,

            "fin"
        );

        // SIDE FIN

        addCurve(
            points,

            cx,

            cy +
                height *
                    0.01,

            cx +
                width *
                    0.14,

            cy +
                height *
                    0.09,

            cx +
                width *
                    0.03,

            cy +
                height *
                    0.135,

            34,

            "fin"
        );

        addLine(
            points,

            cx +
                width *
                    0.03,

            cy +
                height *
                    0.135,

            cx,

            cy +
                height *
                    0.01,

            18,

            "fin"
        );

        // EYE

        const eyeX =
            frontX -
            width *
                0.075;

        const eyeY =
            cy -
            height *
                0.045;

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

        // GILL

        addCurve(
            points,

            frontX -
                width *
                    0.13,

            cy -
                height *
                    0.075,

            frontX -
                width *
                    0.16,

            cy,

            frontX -
                width *
                    0.13,

            cy +
                height *
                    0.082,

            22,

            "detail"
        );

        // MOUTH

        addCurve(
            points,

            frontX -
                width *
                    0.03,

            cy +
                height *
                    0.01,

            frontX +
                width *
                    0.008,

            cy +
                height *
                    0.022,

            frontX -
                width *
                    0.015,

            cy +
                height *
                    0.038,

            12,

            "detail"
        );

        // INTERNAL LINES

        for (
            let row = -2;
            row <= 2;
            row++
        ) {
            const y =
                cy +
                row *
                    height *
                    0.042;

            const yNorm =
                Math.abs(
                    (
                        y -
                        cy
                    ) /
                        ry
                );

            const halfWidth =
                rx *
                0.86 *
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

                cx -
                    halfWidth,

                y,

                cx +
                    halfWidth *
                        0.72,

                y,

                26,

                "inner"
            );
        }

        // INTERIOR PARTICLES

        for (
            let i = 0;
            i < 190;
            i++
        ) {
            let x =
                cx;

            let y =
                cy;

            for (
                let tries = 0;
                tries < 30;
                tries++
            ) {
                x =
                    cx +
                    (
                        Math.random() -
                        0.5
                    ) *
                        rx *
                        2;

                y =
                    cy +
                    (
                        Math.random() -
                        0.5
                    ) *
                        ry *
                        2;

                if (
                    insideEllipse(
                        x,
                        y,
                        cx,
                        cy,
                        rx,
                        ry
                    )
                ) {
                    break;
                }
            }

            addPoint(
                points,
                x,
                y,
                "fill"
            );
        }

        return points;
    }

    function createParticles() {
        particles =
            buildFishTargets()
                .map(
                    target => ({
                        x:
                            prefersReducedMotion
                                ? target.x
                                : Math.random() *
                                    width,

                        y:
                            prefersReducedMotion
                                ? target.y
                                : Math.random() *
                                    height,

                        baseX:
                            target.x,

                        baseY:
                            target.y,

                        type:
                            target.type,

                        size:
                            target.type ===
                            "eyeCore"
                                ? 2.1
                                : Math.random() *
                                    1.35 +
                                    0.65,

                        brightness:
                            Math.random(),

                        seed:
                            Math.random() *
                            Math.PI *
                            2,

                        speed:
                            Math.random() *
                                0.0028 +
                            0.0014
                    })
                );
    }

    function createBubbles() {
        bubbles =
            Array.from(
                {
                    length: 12
                },
                () => ({
                    x:
                        width *
                            0.82 +
                        Math.random() *
                            width *
                            0.12,

                    y:
                        height *
                            0.28 +
                        Math.random() *
                            height *
                            0.32,

                    size:
                        Math.random() *
                            2.8 +
                        1,

                    speed:
                        Math.random() *
                            0.25 +
                        0.12,

                    drift:
                        Math.random() *
                        Math.PI *
                        2
                })
            );
    }

    function resizeFishCanvas() {
        const rect =
            fishCanvas
                .getBoundingClientRect();

        width =
            rect.width;

        height =
            rect.height;

        if (
            !width ||
            !height
        ) {
            return;
        }

        dpr =
            Math.min(
                window.devicePixelRatio ||
                    1,
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

    fishCanvas.addEventListener(
        "pointermove",
        event => {
            const rect =
                fishCanvas
                    .getBoundingClientRect();

            mouse.x =
                event.clientX -
                rect.left;

            mouse.y =
                event.clientY -
                rect.top;
        },
        {
            passive: true
        }
    );

    fishCanvas.addEventListener(
        "pointerleave",
        () => {
            mouse.x =
                -9999;

            mouse.y =
                -9999;
        }
    );

    function getParticleColor(
        particle
    ) {
        if (
            particle.type ===
            "eyeCore"
        ) {
            return "rgba(255,255,255,.98)";
        }

        if (
            particle.type ===
            "eye"
        ) {
            return "rgba(210,202,255,.92)";
        }

        if (
            particle.type ===
            "detail"
        ) {
            return "rgba(220,215,240,.72)";
        }

        const alpha =
            0.34 +
            particle.brightness *
                0.5;

        return (
            particle.brightness >
            0.91
        )
            ? `rgba(245,243,255,${alpha})`
            : `rgba(169,150,255,${alpha})`;
    }

    function drawFish(time) {
        if (
            !width ||
            !height
        ) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.save();

        ctx.globalCompositeOperation =
            "lighter";

        const swim =
            Math.sin(
                time *
                0.00125
            );

        particles.forEach(
            particle => {
                let targetX =
                    particle.baseX +
                    swim *
                        5;

                let targetY =
                    particle.baseY +
                    Math.sin(
                        time *
                            particle.speed +
                        particle.seed
                    ) *
                        1.7;

                if (
                    particle.type ===
                    "tail"
                ) {
                    const tailStrength =
                        Math.max(
                            0,
                            (
                                width *
                                    0.35 -
                                particle.baseX
                            ) /
                                (
                                    width *
                                    0.25
                                )
                        );

                    targetY +=
                        Math.sin(
                            time *
                                0.006 +
                            particle.baseX *
                                0.03
                        ) *
                        10 *
                        Math.min(
                            1,
                            tailStrength
                        );
                }

                if (
                    particle.type ===
                    "fin"
                ) {
                    targetY +=
                        Math.sin(
                            time *
                                0.0045 +
                            particle.seed
                        ) *
                        3.2;
                }

                if (
                    particle.type ===
                    "fill"
                ) {
                    targetX +=
                        Math.cos(
                            time *
                                0.0018 +
                            particle.seed
                        ) *
                        1.6;

                    targetY +=
                        Math.sin(
                            time *
                                0.002 +
                            particle.seed
                        ) *
                        1.6;
                }

                if (
                    !prefersReducedMotion
                ) {
                    const dx =
                        particle.x -
                        mouse.x;

                    const dy =
                        particle.y -
                        mouse.y;

                    const distance =
                        Math.hypot(
                            dx,
                            dy
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

                        const safeDistance =
                            Math.max(
                                distance,
                                1
                            );

                        targetX +=
                            (
                                dx /
                                safeDistance
                            ) *
                            force *
                            28;

                        targetY +=
                            (
                                dy /
                                safeDistance
                            ) *
                            force *
                            28;
                    }

                    particle.x +=
                        (
                            targetX -
                            particle.x
                        ) *
                        0.078;

                    particle.y +=
                        (
                            targetY -
                            particle.y
                        ) *
                        0.078;
                } else {
                    particle.x =
                        targetX;

                    particle.y =
                        targetY;
                }

                ctx.fillStyle =
                    getParticleColor(
                        particle
                    );

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

        bubbles.forEach(
            bubble => {
                if (
                    !prefersReducedMotion
                ) {
                    bubble.y -=
                        bubble.speed;

                    bubble.x +=
                        Math.sin(
                            time *
                                0.0015 +
                            bubble.drift
                        ) *
                        0.12;

                    if (
                        bubble.y <
                        height *
                            0.12
                    ) {
                        bubble.y =
                            height *
                                0.45 +
                            Math.random() *
                                height *
                                0.18;

                        bubble.x =
                            width *
                                0.81 +
                            Math.random() *
                                width *
                                0.12;
                    }
                }

                ctx.strokeStyle =
                    "rgba(169,150,255,.24)";

                ctx.lineWidth =
                    0.7;

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
    }

    function animateFish(time) {
        fishFrame =
            0;

        drawFish(
            time
        );

        if (
            !prefersReducedMotion &&
            fishInView
        ) {
            fishFrame =
                requestAnimationFrame(
                    animateFish
                );
        }
    }

    function startFish() {
        if (
            prefersReducedMotion
        ) {
            drawFish(
                0
            );

            return;
        }

        if (
            !fishFrame &&
            fishInView
        ) {
            fishFrame =
                requestAnimationFrame(
                    animateFish
                );
        }
    }

    function stopFish() {
        if (!fishFrame) {
            return;
        }

        cancelAnimationFrame(
            fishFrame
        );

        fishFrame =
            0;
    }

    resizeFishCanvas();
    startFish();

    window.addEventListener(
        "resize",
        () => {
            cancelAnimationFrame(
                resizeFrame
            );

            resizeFrame =
                requestAnimationFrame(
                    () => {
                        resizeFishCanvas();
                        startFish();
                    }
                );
        },
        {
            passive: true
        }
    );

    if (
        "IntersectionObserver" in
            window &&
        !prefersReducedMotion
    ) {
        const fishObserver =
            new IntersectionObserver(
                entries => {
                    fishInView =
                        entries[0]
                            ?.isIntersecting ??
                        true;

                    if (
                        fishInView
                    ) {
                        startFish();
                    } else {
                        stopFish();
                    }
                },
                {
                    rootMargin:
                        "180px 0px",

                    threshold:
                        0.01
                }
            );

        fishObserver.observe(
            fishCanvas
        );
    }
}

// ==========================================
// VIDEO PORTFOLIO + MODAL
// ==========================================

const videoProjects =
    document.querySelectorAll(
        ".video-project"
    );

const previewVideos =
    document.querySelectorAll(
        "#work .project-video"
    );

const videoModal =
    document.getElementById(
        "videoModal"
    );

const expandedVideo =
    document.getElementById(
        "expandedVideo"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

let lastModalTrigger =
    null;

function isPreviewAllowed(
    video
) {
    const hiddenGroup =
        video.closest(
            ".work-more"
        );

    return (
        !hiddenGroup ||
        hiddenGroup.classList.contains(
            "open"
        )
    );
}

function playPreview(
    video
) {
    if (
        !video ||
        !isPreviewAllowed(
            video
        ) ||
        videoModal
            ?.classList
            .contains(
                "active"
            )
    ) {
        return;
    }

    video.muted =
        true;

    video.defaultMuted =
        true;

    video.loop =
        true;

    video.playsInline =
        true;

    video
        .play()
        .catch(() => {});
}

function pauseAllPreviews() {
    previewVideos.forEach(
        video => {
            video.pause();
        }
    );
}

if (
    "IntersectionObserver" in
    window
) {
    const previewObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        const video =
                            entry.target;

                        if (
                            entry.isIntersecting &&
                            isPreviewAllowed(
                                video
                            )
                        ) {
                            playPreview(
                                video
                            );
                        } else {
                            video.pause();
                        }
                    }
                );
            },
            {
                rootMargin:
                    "120px 0px",

                threshold:
                    0.05
            }
        );

    previewVideos.forEach(
        video => {
            previewObserver.observe(
                video
            );
        }
    );
} else {
    previewVideos.forEach(
        playPreview
    );
}

function openVideo(
    src,
    trigger = null
) {
    if (
        !videoModal ||
        !expandedVideo ||
        !src
    ) {
        return;
    }

    lastModalTrigger =
        trigger instanceof
        HTMLElement
            ? trigger
            : document.activeElement;

    pauseAllPreviews();

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

    videoModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    modalClose?.focus({
        preventScroll: true
    });

    expandedVideo
        .play()
        .catch(() => {});
}

function resumeVisiblePreviews() {
    previewVideos.forEach(
        video => {
            const rect =
                video
                    .getBoundingClientRect();

            const visible =
                rect.bottom >
                    0 &&
                rect.top <
                    window.innerHeight;

            if (
                visible &&
                isPreviewAllowed(
                    video
                )
            ) {
                playPreview(
                    video
                );
            }
        }
    );
}

function closeVideo() {
    if (
        !videoModal ||
        !expandedVideo ||
        !videoModal
            .classList
            .contains(
                "active"
            )
    ) {
        return;
    }

    videoModal.classList.remove(
        "active"
    );

    videoModal.setAttribute(
        "aria-hidden",
        "true"
    );

    expandedVideo.pause();

    expandedVideo.removeAttribute(
        "src"
    );

    expandedVideo.load();

    document.body.style.overflow =
        "";

    if (
        lastModalTrigger instanceof
        HTMLElement
    ) {
        lastModalTrigger.focus({
            preventScroll: true
        });
    }

    resumeVisiblePreviews();
}

videoProjects.forEach(
    project => {
        const video =
            project.querySelector(
                ".project-video"
            );

        const playButton =
            project.querySelector(
                ".play-button"
            );

        if (
            !video ||
            !playButton
        ) {
            return;
        }

        playButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                openVideo(
                    video.currentSrc ||
                        video.src,
                    playButton
                );
            }
        );

        project.addEventListener(
            "click",
            event => {
                if (
                    event.target.closest(
                        "button, a"
                    )
                ) {
                    return;
                }

                openVideo(
                    video.currentSrc ||
                        video.src,
                    playButton
                );
            }
        );
    }
);

document
    .querySelectorAll(
        "#work .project-arrow"
    )
    .forEach(
        button => {
            button.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    const card =
                        button.closest(
                            ".work-card, .project-card"
                        );

                    const video =
                        card?.querySelector(
                            ".project-video"
                        );

                    if (
                        video
                    ) {
                        openVideo(
                            video.currentSrc ||
                                video.src,
                            button
                        );
                    }
                }
            );
        }
    );

modalClose?.addEventListener(
    "click",
    closeVideo
);

videoModal?.addEventListener(
    "click",
    event => {
        if (
            event.target ===
                videoModal ||
            event.target
                .classList
                .contains(
                    "modal-backdrop"
                )
        ) {
            closeVideo();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (
            !videoModal
                ?.classList
                .contains(
                    "active"
                )
        ) {
            return;
        }

        if (
            event.key ===
            "Escape"
        ) {
            closeVideo();
            return;
        }

        if (
            event.key !==
            "Tab"
        ) {
            return;
        }

        const focusable =
            videoModal
                .querySelectorAll(
                    'button, video[controls], [tabindex]:not([tabindex="-1"])'
                );

        if (
            !focusable.length
        ) {
            return;
        }

        const first =
            focusable[0];

        const last =
            focusable[
                focusable.length -
                1
            ];

        if (
            event.shiftKey &&
            document.activeElement ===
                first
        ) {
            event.preventDefault();

            last.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement ===
                last
        ) {
            event.preventDefault();

            first.focus();
        }
    }
);

// ==========================================
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
                workMore
                    .classList
                    .toggle(
                        "open"
                    );

            workToggle
                .classList
                .toggle(
                    "active",
                    isOpen
                );

            workToggle.setAttribute(
                "aria-expanded",
                String(
                    isOpen
                )
            );

            workMore.setAttribute(
                "aria-hidden",
                String(
                    !isOpen
                )
            );

            workToggleText.textContent =
                isOpen
                    ? "Show less"
                    : "View more work";

            const extraVideos =
                workMore
                    .querySelectorAll(
                        ".project-video"
                    );

            if (
                isOpen
            ) {
                requestAnimationFrame(
                    () => {
                        extraVideos.forEach(
                            playPreview
                        );
                    }
                );
            } else {
                extraVideos.forEach(
                    video => {
                        video.pause();
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
    cursorRing &&
    hasFinePointer &&
    !prefersReducedMotion
) {
    let mouseX =
        window.innerWidth /
        2;

    let mouseY =
        window.innerHeight /
        2;

    let ringX =
        mouseX;

    let ringY =
        mouseY;

    let cursorFrame =
        0;

    const interactiveSelector =
        [
            "a",
            "button",
            ".project-card",
            ".social-button",
            ".hero-profile-card",
            ".dot-character"
        ].join(
            ","
        );

    function animateCursor() {
        ringX +=
            (
                mouseX -
                ringX
            ) *
            0.22;

        ringY +=
            (
                mouseY -
                ringY
            ) *
            0.22;

        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;

        const moving =
            Math.abs(
                mouseX -
                ringX
            ) >
                0.1 ||
            Math.abs(
                mouseY -
                ringY
            ) >
                0.1;

        cursorFrame =
            moving
                ? requestAnimationFrame(
                    animateCursor
                )
                : 0;
    }

    document.addEventListener(
        "pointermove",
        event => {
            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            cursorDot.style.left =
                `${mouseX}px`;

            cursorDot.style.top =
                `${mouseY}px`;

            cursorDot.style.opacity =
                "1";

            cursorRing.style.opacity =
                "1";

            if (
                !cursorFrame
            ) {
                cursorFrame =
                    requestAnimationFrame(
                        animateCursor
                    );
            }
        },
        {
            passive: true
        }
    );

    document.addEventListener(
        "pointerover",
        event => {
            const interactive =
                Boolean(
                    event.target.closest(
                        interactiveSelector
                    )
                );

            document.body
                .classList
                .toggle(
                    "cursor-hover",
                    interactive
                );
        }
    );

    document.addEventListener(
        "pointerout",
        event => {
            const leaving =
                event.target.closest(
                    interactiveSelector
                );

            const entering =
                event.relatedTarget
                    ?.closest?.(
                        interactiveSelector
                    );

            if (
                leaving &&
                !entering
            ) {
                document.body
                    .classList
                    .remove(
                        "cursor-hover"
                    );
            }
        }
    );

    document.addEventListener(
        "pointerdown",
        () => {
            document.body
                .classList
                .add(
                    "cursor-clicking"
                );
        }
    );

    document.addEventListener(
        "pointerup",
        () => {
            document.body
                .classList
                .remove(
                    "cursor-clicking"
                );
        }
    );

    document.documentElement
        .addEventListener(
            "mouseleave",
            () => {
                cursorDot.style.opacity =
                    "0";

                cursorRing.style.opacity =
                    "0";

                document.body
                    .classList
                    .remove(
                        "cursor-clicking",
                        "cursor-hover"
                    );
            }
        );

    window.addEventListener(
        "blur",
        () => {
            document.body
                .classList
                .remove(
                    "cursor-clicking",
                    "cursor-hover"
                );
        }
    );
}

// ==========================================
// ABOUT STAT COUNTERS
// ==========================================

const statCounters =
    document.querySelectorAll(
        "#about .counter"
    );

function setCounterFinalValue(
    counter
) {
    const target =
        Number(
            counter.dataset.target ||
            0
        );

    const suffix =
        counter.dataset.suffix ||
        "";

    counter.textContent =
        `${target}${suffix}`;
}

function animateCounter(
    counter
) {
    if (
        counter.dataset.counted ===
        "true"
    ) {
        return;
    }

    counter.dataset.counted =
        "true";

    const target =
        Number(
            counter.dataset.target ||
            0
        );

    const suffix =
        counter.dataset.suffix ||
        "";

    const duration =
        1350;

    const startTime =
        performance.now();

    counter.textContent =
        `0${suffix}`;

    function updateCounter(
        now
    ) {
        const progress =
            Math.min(
                (
                    now -
                    startTime
                ) /
                    duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 -
                    progress,
                4
            );

        const value =
            Math.round(
                target *
                eased
            );

        counter.textContent =
            `${value}${suffix}`;

        if (
            progress <
            1
        ) {
            requestAnimationFrame(
                updateCounter
            );
        } else {
            setCounterFinalValue(
                counter
            );
        }
    }

    requestAnimationFrame(
        updateCounter
    );
}

if (
    statCounters.length
) {
    if (
        prefersReducedMotion ||
        !(
            "IntersectionObserver" in
            window
        )
    ) {
        statCounters.forEach(
            setCounterFinalValue
        );
    } else {
        const counterObserver =
            new IntersectionObserver(
                entries => {
                    entries.forEach(
                        entry => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            animateCounter(
                                entry.target
                            );

                            counterObserver.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold:
                        0.45,

                    rootMargin:
                        "0px 0px -5%"
                }
            );

        statCounters.forEach(
            counter => {
                counter.textContent =
                    `0${counter.dataset.suffix || ""}`;

                counterObserver.observe(
                    counter
                );
            }
        );
    }
}

// ==========================================
// ACTIVE NAV LINK
// ==========================================

const navLinks =
    [
        ...document.querySelectorAll(
            ".nav-link"
        )
    ];

const navSections =
    [
        ...document.querySelectorAll(
            "main section[id]"
        )
    ];

let navTicking =
    false;

function updateActiveNav() {
    navTicking =
        false;

    const scrollPosition =
        window.scrollY +
        Math.min(
            220,
            window.innerHeight *
                0.3
        );

    let current =
        navSections[0]?.id ||
        "home";

    navSections.forEach(
        section => {
            if (
                scrollPosition >=
                section.offsetTop
            ) {
                current =
                    section.id;
            }
        }
    );

    navLinks.forEach(
        link => {
            const active =
                link.getAttribute(
                    "href"
                ) ===
                `#${current}`;

            link.classList.toggle(
                "active",
                active
            );

            if (
                active
            ) {
                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute(
                    "aria-current"
                );
            }
        }
    );
}

window.addEventListener(
    "scroll",
    () => {
        if (
            navTicking
        ) {
            return;
        }

        navTicking =
            true;

        requestAnimationFrame(
            updateActiveNav
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    () => {
        if (
            !navTicking
        ) {
            requestAnimationFrame(
                updateActiveNav
            );
        }
    },
    {
        passive: true
    }
);

updateActiveNav();