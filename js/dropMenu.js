// copy this code to the other js files to have the nave bar woork on all pages

const menuBtn = document.getElementById("menuBtn");
const menu = document.querySelector(".dropdown-menu");

menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("show");
});


