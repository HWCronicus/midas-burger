async function fetchMenuData() {
  const data = await fetch("./data/menu.json").then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load menu data (${response.url})`);
    }
    return response.json();
  });

  return data;
}

function createMenuItemCard(item) {
  return `
    <div class="menu-card" data-item-id="${item.itemId}">
      <img class="menu-card-image" src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="menu-card-body">
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-description">${item.description}</p>
        <div class="menu-card-row">
          <span class="menu-card-price">$${Number(item.price).toFixed(2)}</span>
          <input
            class="menu-card-quantity"
            type="number"
            min="1"
            step="1"
            value="1"
            aria-label="Quantity for ${item.name}"
          />
          <button class="add-to-cart" type="button">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function buildSections(title, items) {
  const menuItemCards = items.map(createMenuItemCard).join("");

  return `
    <section class="menu-section" id="menu-${title.toLowerCase()}">
      <h2 class="menu-section-title">${title}</h2>
      <div class="menu-grid">${menuItemCards}</div>
    </section>
  `;
}

// Disable cart actions for now until the cart functionality is implemented
function addToCartButton(menuContent) {
  menuContent.addEventListener("click", (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.matches(".add-to-cart")
    ) {
      event.preventDefault();
    }
  });
}

async function renderMenu() {
  const menuContent = document.querySelector(".menu-content");
  if (!menuContent) {
    return;
  }

  addToCartButton(menuContent);

  try {
    const menuData = await fetchMenuData();
    const menuMarkup = menuData
      .map(({ title, items }) => buildSections(title, items))
      .join("");

    menuContent.insertAdjacentHTML("beforeend", menuMarkup);
  } catch (error) {
    menuContent.innerHTML = `
      <section class="menu-section">
        <h2 class="menu-section-title">Menu Unavailable</h2>
        <p class="menu-card-description">Could not load the menu data right now. Please try again later.</p>
      </section>
    `;
  }
}

document.addEventListener("DOMContentLoaded", renderMenu);
