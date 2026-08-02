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
// =========================
// ANIMATED STATS
// =========================

const statNumbers = document.querySelectorAll(".stat-number");

const statsObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);

        let current = 0;

        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            current = Math.floor(target * easedProgress);

            counter.textContent = current ;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target ;
            }
        }

        requestAnimationFrame(updateCounter);

        observer.unobserve(counter);

    });

}, {
    threshold: 0.5
});


statNumbers.forEach(counter => {
    statsObserver.observe(counter);
});