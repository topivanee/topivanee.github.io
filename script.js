const buttons = document.querySelectorAll("nav a");


buttons.forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelector(
btn.getAttribute("href")
)
.scrollIntoView({
behavior:"smooth"
});

});

});
