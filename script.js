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




// Create particles


const particles = document.getElementById("particles");

const fragment = document.createDocumentFragment();

for(let i = 0; i < 80; i++){

    let particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left = Math.random() * 100 + "%";

    particle.style.animationDuration =
        (5 + Math.random() * 10) + "s";

    particle.style.animationDelay =
        Math.random() * 5 + "s";

    fragment.appendChild(particle);
}

particles.appendChild(fragment);
