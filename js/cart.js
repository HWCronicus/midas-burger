window.CartAPI = {
  addItem: addItemToCart,
  updateItem: updateItemInCart,
  removeItem: removeItemFromCart,
  getItems: getCartItems,
  getTotalPrice: () => formatToCurrency(getCartTotals().totalPrice),
  clearCart: clearCart,
  formatToCurrency: formatToCurrency,
};

const CART_STORAGE = "midas_burger_cart_data";

let cartState = [];
let cartTriggerButton = null;
let cartMenu = null;

function formatToCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function loadCartData() {
  try {
    const rawCartData = localStorage.getItem(CART_STORAGE);
    if (!rawCartData) {
      return [];
    }

    const parsedCartData = JSON.parse(rawCartData);
    if (!Array.isArray(parsedCartData)) {
      return [];
    }
    return parsedCartData;
  } catch (error) {
    return [];
  }
}

function saveCartData() {
  localStorage.setItem(CART_STORAGE, JSON.stringify(cartState));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

function getCartItems() {
  return cartState.map((item) => ({ ...item }));
}

function getCartTotals() {
  return cartState.reduce(
    (totals, item) => {
      totals.itemCount += item.quantity;
      totals.totalPrice += item.price * item.quantity;
      return totals;
    },
    { itemCount: 0, totalPrice: 0 },
  );
}

function updateCartCount() {
  const { itemCount } = getCartTotals();
  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = String(itemCount);
  });
}

function addItemToCart(item) {
  const existing = cartState.find((entry) => entry.itemId === item.itemId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartState.push(item);
  }

  saveCartData();
  updateCartCount();
  renderCart();
  openCart();
}

function clearCart() {
  cartState = [];
  saveCartData();
  updateCartCount();
  renderCart();
}

function updateItemInCart(itemId, updates) {
  const existing = cartState.find((entry) => entry.itemId === itemId);
  if (existing) {
    Object.assign(existing, updates);
    saveCartData();
    updateCartCount();
    renderCart();
  }
}

function removeItemFromCart(itemId) {
  cartState = cartState.filter((entry) => entry.itemId !== itemId);
  saveCartData();
  updateCartCount();
  renderCart();
}

function closeCart() {
  if (!cartMenu || !cartTriggerButton) {
    return;
  }

  cartMenu.classList.remove("is-open");
  cartTriggerButton.setAttribute("aria-expanded", "false");
}

function openCart() {
  if (!cartMenu || !cartTriggerButton) {
    return;
  }

  cartMenu.classList.add("is-open");
  cartTriggerButton.setAttribute("aria-expanded", "true");
}

function toggleCart() {
  if (!cartMenu || !cartTriggerButton) {
    return;
  }

  const isOpen = cartMenu.classList.contains("is-open");
  if (isOpen) {
    closeCart();
  } else {
    openCart();
  }
}

function configureCartMenu() {
  cartTriggerButton = document.querySelector(".cart-button");
  if (!cartTriggerButton) {
    return;
  }

  const topBarContents = cartTriggerButton.closest(".top-bar-contents");

  cartMenu = topBarContents.querySelector(".cart");
  if (!cartMenu) {
    cartMenu = document.createElement("div");
    cartMenu.className = "cart";
    topBarContents.appendChild(cartMenu);
  }

  cartTriggerButton.setAttribute("aria-expanded", "false");
  cartTriggerButton.setAttribute("aria-haspopup", "true");

  cartTriggerButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleCart();
  });

  cartMenu.addEventListener("click", (event) => {
    event.stopPropagation();

    const clearCartButton = event.target.closest(".cart-clear-button");
    if (
      clearCartButton instanceof HTMLElement &&
      !clearCartButton.classList.contains("is-disabled")
    ) {
      event.preventDefault();
      clearCart();
      return;
    }

    const removeItemButton = event.target.closest(".cart-item-remove");
    if (removeItemButton instanceof HTMLElement) {
      event.preventDefault();
      const itemId = removeItemButton.getAttribute("item-id") || "";
      if (itemId) {
        removeItemFromCart(itemId);
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!cartMenu || !cartTriggerButton) {
      return;
    }

    const target = event.target;
    if (cartMenu.contains(target) || cartTriggerButton.contains(target)) {
      return;
    }

    closeCart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });
}

function renderCart() {
  if (!cartMenu) {
    return;
  }

  const { totalPrice } = getCartTotals();

  if (cartState.length === 0) {
    cartMenu.innerHTML = `
      <div class="cart-empty">Your cart is empty.</div>
      <div class="cart-footer">
        <span class="cart-total">Total: ${formatToCurrency(0)}</span>
        <div class="cart-actions">
          <button class="cart-clear-button is-disabled" type="button" disabled>Clear Cart</button>
          <a class="cart-checkout-button is-disabled" href="./checkout.html" aria-disabled="true">Checkout</a>
        </div>
      </div>
    `;
    return;
  }

  const rowsMarkup = cartState
    .map((item) => {
      const combinedPrice = item.price * item.quantity;
      return `
        <li class="cart-item">
          <object class="cart-thumb" data="${item.image}" alt="${item.name}" loading="lazy" type="image/jpg">
            <img class="cart-thumb" src="${generatePlaceholderImageUrl(item.name)}" alt="${item.name}" loading="lazy"/>
            </object>
          <div class="cart-item-details">
            <span class="cart-item-name">${item.name}</span>
            <input class="cart-item-quantity" type="number" min="1" step="1" value="${item.quantity}" aria-label="Quantity for ${item.name}" onChange="updateItemInCart('${item.itemId}', { quantity: Number(this.value) })" />
            <button class="cart-item-remove" type="button" item-id="${item.itemId}" aria-label="Remove ${item.name} from cart">Remove</button>
          </div>
          <span class="cart-item-total">${formatToCurrency(combinedPrice)}</span>
        </li>
      `;
    })
    .join("");

  cartMenu.innerHTML = `
    <ul class="cart-list">${rowsMarkup}</ul>
    <div class="cart-footer">
      <span class="cart-total">Total: ${formatToCurrency(totalPrice)}</span>
      <div class="cart-actions">
        <button class="cart-clear-button" type="button">Clear Cart</button>
        <a class="cart-checkout-button" href="./checkout.html">Checkout</a>
      </div>
    </div>
  `;
}

function initializeCart() {
  cartState = loadCartData();
  configureCartMenu();
  updateCartCount();
  renderCart();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCart);
} else {
  initializeCart();
}
