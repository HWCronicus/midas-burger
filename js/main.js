const header = document.querySelector(".top-bar");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const navToggle = document.querySelector(".nav-toggle");

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

// Shopping cart scaffold
document.querySelector(".cart-button").addEventListener("click", () => {
  alert(
    "Shopping cart scaffold: connect this button to your cart drawer or checkout flow.",
  );
});
