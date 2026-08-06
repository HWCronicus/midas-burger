const header = document.querySelector(".top-bar");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const navToggle = document.querySelector(".nav-hamburger-toggle");
const cartButton = document.querySelector(".cart-button");

const cartItems = [];

//Hamburger menu toggle
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
