const header = document.querySelector(".top-bar");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const navToggle = document.querySelector(".nav-hamburger-toggle");
const cartButton = document.querySelector(".cart-button");

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

function buildImageMarkup(className, src, altText) {
  const fallbackSrc = generatePlaceholderImageUrl(altText);
  return `<img class="${className}" src="${src}" alt="${altText}" loading="lazy" data-fallback-src="${fallbackSrc}" onerror="handleImageFallback(event)" />`;
}

function generatePlaceholderImageUrl(itemName) {
  const encodedItemName = encodeURIComponent(itemName);
  return `https://placehold.co/800x500/1f1f1f/e2c46f?text=${encodedItemName}`;
}

function handleImageFallback(event) {
  const image = event.currentTarget;
  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  const fallbackSrc = image.getAttribute("data-fallback-src");
  if (!fallbackSrc || image.src === fallbackSrc) {
    return;
  }

  image.src = fallbackSrc;
}

window.handleImageFallback = handleImageFallback;
