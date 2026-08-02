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