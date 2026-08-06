let menuData = null;

async function fetchMenuData() {
  menuData = await fetch("./data/menu.json").then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load menu data (${response.url})`);
    }
    return response.json();
  });
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

function createMenuItemCard(item) {
  return `
    <div class="menu-card" item-id="${item.itemId}">
      <object class="menu-card-image" data="${item.image}" alt="${item.name}" loading="lazy" type="image/jpg">
        <img class="menu-card-image" src="https://placehold.co/800x500/1f1f1f/e2c46f?text=${item.name.split(` `).join(`+`)}" alt="${item.name}" loading="lazy"/>
      </object>
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

function addToCartButton(menuContent) {
  menuContent.addEventListener("click", (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.matches(".add-to-cart")
    ) {
      event.preventDefault();

      const card = event.target.closest(".menu-card");
      if (!card || !window.CartAPI) {
        return;
      }

      const itemId = card.getAttribute("item-id") || "";
      const item = menuData
        .map((section) => section.items)
        .flat()
        .find((item) => item.itemId === itemId);

      const name = item.name;
      const image = item.image;
      const price = item.price || 0;

      const quantityValue =
        card.querySelector(".menu-card-quantity")?.value || "1";
      const quantity = Math.max(0, Math.floor(Number(quantityValue) || 0));
      const existingItem = window.CartAPI.getItems().find(
        (item) => item.itemId === itemId,
      );

      if (existingItem) {
        if (quantity === 0) {
          window.CartAPI.removeItem(itemId);
        } else {
          window.CartAPI.updateItem(itemId, { quantity });
        }
      } else {
        window.CartAPI.addItem({
          itemId,
          name,
          image,
          price,
          quantity,
        });
      }
    }
  });
}

function syncMenuFromCart(menuContent) {
  if (!window.CartAPI) {
    return;
  }

  const cartItems = window.CartAPI.getItems();
  const quantitiesById = new Map(
    cartItems.map((item) => [item.itemId, item.quantity]),
  );

  menuContent.querySelectorAll(".menu-card").forEach((card) => {
    const itemId = card.getAttribute("item-id") || "";
    const quantityInput = card.querySelector(".menu-card-quantity");
    const actionButton = card.querySelector(".add-to-cart");

    if (!(quantityInput instanceof HTMLInputElement)) {
      return;
    }

    const existingQuantity = quantitiesById.get(itemId);
    const quantity = existingQuantity || 1;
    quantityInput.value = String(quantity);
    quantityInput.min = existingQuantity ? "0" : "1";

    if (actionButton instanceof HTMLButtonElement) {
      actionButton.textContent = existingQuantity
        ? "Update Cart"
        : "Add to Cart";
    }
  });
}

async function renderMenu() {
  const menuContent = document.querySelector(".menu-content");
  if (!menuContent) {
    return;
  }

  try {
    await fetchMenuData();
    const menuMarkup = menuData
      .map(({ title, items }) => buildSections(title, items))
      .join("");
    addToCartButton(menuContent);
    menuContent.insertAdjacentHTML("beforeend", menuMarkup);
    syncMenuFromCart(menuContent);
    window.addEventListener("cart:updated", () => {
      syncMenuFromCart(menuContent);
    });
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
