let checkoutStage = "review";

function clampQuantity(value) {
  return Math.max(1, Math.floor(Number(value) || 1));
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhone(value) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatCardNumber(value) {
  const digits = digitsOnly(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatSecurityCode(value) {
  return digitsOnly(value).slice(0, 4);
}

function formatState(value) {
  return String(value || "")
    .replace(/[^a-z]/gi, "")
    .toUpperCase()
    .slice(0, 2);
}

function formatZipCode(value) {
  return digitsOnly(value).slice(0, 5);
}

function formatExpDate(value) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatPickupTime() {
  const minutesAhead = 45 + Math.floor(Math.random() * 16);
  const pickupDate = new Date(Date.now() + minutesAhead * 60 * 1000);
  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(pickupDate);
  return `${timeText} (${minutesAhead} minutes)`;
}

function formatTotalPrice(item) {
  const amount = item.price * item.quantity;
  return window.CartAPI.formatToCurrency(amount);
}

function renderReviewRows(items) {
  return items
    .map((item) => {
      const totalPrice = formatTotalPrice(item);

      return `
        <article class="checkout-row" data-item-id="${item.itemId}">
          <object class="checkout-thumb" data="${item.image}" aria-label="${item.name}" type="image/jpg">
            <img class="checkout-thumb" src="${generatePlaceholderImageUrl(item.name)}" alt="${item.name}" loading="lazy" />
          </object>
          <div class="checkout-item-details">
            <div class="checkout-name">${item.name}</div>
            <div class="checkout-item-controls">
              <input class="checkout-item-quantity" type="number" min="1" step="1" value="${item.quantity}" aria-label="Quantity for ${item.name}" />
              <button class="checkout-item-remove" type="button" data-item-id="${item.itemId}" aria-label="Remove ${item.name} from cart">Remove</button>
            </div>
          </div>
          <div class="checkout-price">${totalPrice}</div>
        </article>
      `;
    })
    .join("");
}

function renderSummaryRows(items) {
  return items
    .map((item) => {
      const totalPrice = formatTotalPrice(item);

      return `
        <article class="checkout-row checkout-row-static">
          <object class="checkout-thumb" data="${item.image}" aria-label="${item.name}" type="image/jpg">
            <img class="checkout-thumb" src="${generatePlaceholderImageUrl(item.name)}" alt="${item.name}" loading="lazy" />
          </object>
          <div class="checkout-item-details">
            <div class="checkout-name">${item.name}</div>
            <div class="checkout-qty">Qty: ${item.quantity}</div>
          </div>
          <div class="checkout-price">${totalPrice}</div>
        </article>
      `;
    })
    .join("");
}

function renderCheckoutReview(root, items) {
  const rows = renderReviewRows(items);
  root.innerHTML = `
    ${rows}
    <div class="checkout-total">Total: ${window.CartAPI.getTotalPrice()}</div>
    <div class="checkout-review-actions">
      <button class="checkout-confirm-button" type="button">Checkout</button>
    </div>
  `;
}

function renderCheckoutForm(root, items) {
  const rows = renderSummaryRows(items);
  root.innerHTML = `
    <div class="checkout-layout">
      <section class="checkout-review-panel" aria-label="Order summary">
        <h2 class="checkout-panel-title">Cart Review</h2>
        <div class="checkout-items">${rows}</div>
        <div class="checkout-total">Total: ${window.CartAPI.getTotalPrice()}</div>
      </section>

      <section class="checkout-form-panel" aria-label="Checkout form">
        <h2 class="checkout-panel-title">Checkout Details</h2>
        <form id="checkout-form" class="checkout-form" novalidate>
          <label class="checkout-field">
            <span>First Name</span>
            <input name="firstName" type="text" autocomplete="given-name" placeholder="First Name" required />
          </label>
          <label class="checkout-field">
            <span>Last Name</span>
            <input name="lastName" type="text" autocomplete="family-name" placeholder="Last Name" required />
          </label>
          <label class="checkout-field">
            <span>Phone Number</span>
            <input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(123) 456-7890" maxlength="14" pattern="\\(\\d{3}\\) \\d{3}-\\d{4}" required />
          </label>
          <label class="checkout-field">
            <span>Address</span>
            <input name="address" type="text" autocomplete="street-address" placeholder="123 Main St" required />
          </label>
          <div class="checkout-field-row checkout-field-row-triple">
            <label class="checkout-field">
              <span>City</span>
              <input name="city" type="text" autocomplete="address-level2" placeholder="Jacksonville" required />
            </label>
            <label class="checkout-field">
              <span>State</span>
              <input name="state" type="text" autocomplete="address-level1" maxlength="2" placeholder="FL" required />
            </label>
            <label class="checkout-field">
              <span>Zip Code</span>
              <input name="zipCode" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="5" pattern="\\d{5}" placeholder="32207" required />
            </label>
          </div>
          <label class="checkout-field">
            <span>Credit Card Number</span>
            <input name="cardNumber" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="XXXX XXXX XXXX XXXX" required />
          </label>
          <div class="checkout-field-row">
            <label class="checkout-field">
              <span>Security Code</span>
              <input name="securityCode" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="XXX" maxlength="4" pattern="\\d{3,4}" required />
            </label>
            <label class="checkout-field">
              <span>Exp Date</span>
              <input name="expDate" type="text" inputmode="numeric" maxlength="5" placeholder="MM/YY" pattern="(0[1-9]|1[0-2])/[0-9]{2}" autocomplete="cc-exp" required />
            </label>
          </div>
          <div class="checkout-form-actions">
            <button class="checkout-clear-button" type="reset">Clear Form</button>
            <button class="checkout-submit-button" type="submit">Submit Order</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function showOrderSuccessPopup() {
  const pickupTime = formatPickupTime();
  const existingPopup = document.querySelector(".checkout-success-overlay");
  if (existingPopup) {
    existingPopup.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "checkout-success-overlay";
  overlay.innerHTML = `
    <div class="checkout-success-popup" role="dialog" aria-modal="true" aria-label="Order created">
      <h3>Order Created</h3>
      <p>Your order is confirmed.</p>
      <p>Pickup time: <strong>${pickupTime}</strong></p>
      <button class="checkout-popup-close" type="button">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (event) => {
    if (
      !(event.target instanceof HTMLElement) ||
      event.target === overlay ||
      event.target.closest(".checkout-popup-close")
    ) {
      overlay.remove();
    }
  });
}

function renderCheckout() {
  const root = document.getElementById("checkout-items");
  if (!root || !window.CartAPI) {
    return;
  }

  const heading = document.querySelector(".checkout-content h1");

  const items = window.CartAPI.getItems();
  if (!items.length) {
    checkoutStage = "review";
    if (heading) {
      heading.textContent = "Review Your Cart";
    }
    root.innerHTML = `<p class="checkout-empty">Your cart is empty.</p>`;
    return;
  }

  if (checkoutStage === "details") {
    if (heading) {
      heading.textContent = "Complete Your Order";
    }
    renderCheckoutForm(root, items);
  } else {
    if (heading) {
      heading.textContent = "Review Your Cart";
    }
    renderCheckoutReview(root, items);
  }
}

function onCheckoutButtonClick(event) {
  const root = document.getElementById("checkout-items");
  if (!root || !window.CartAPI) {
    return;
  }

  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const startCheckoutButton = event.target.closest(".checkout-confirm-button");
  if (startCheckoutButton) {
    event.preventDefault();
    checkoutStage = "details";
    renderCheckout();
    return;
  }
}

function onRemoveButtonClick(event) {
  const root = document.getElementById("checkout-items");
  if (!root || !window.CartAPI) {
    return;
  }

  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const removeButton = event.target.closest(".checkout-item-remove");
  if (removeButton) {
    event.preventDefault();
    const itemId = removeButton.getAttribute("data-item-id") || "";
    if (itemId) {
      window.CartAPI.removeItem(itemId);
    }
  }
}

function onCheckoutItemsChange(event) {
  if (!window.CartAPI) {
    return;
  }

  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (!event.target.matches(".checkout-item-quantity")) {
    return;
  }

  const row = event.target.closest(".checkout-row");
  const itemId = row?.getAttribute("data-item-id") || "";
  if (!itemId) {
    return;
  }

  const quantity = clampQuantity(event.target.value);
  event.target.value = String(quantity);
  window.CartAPI.updateItem(itemId, { quantity });
}

function onCheckoutFormInput(event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (event.target.name === "phone") {
    event.target.value = formatPhone(event.target.value);
    return;
  }

  if (event.target.name === "cardNumber") {
    event.target.value = formatCardNumber(event.target.value);
    return;
  }

  if (event.target.name === "securityCode") {
    event.target.value = formatSecurityCode(event.target.value);
    return;
  }

  if (event.target.name === "state") {
    event.target.value = formatState(event.target.value);
    return;
  }

  if (event.target.name === "zipCode") {
    event.target.value = formatZipCode(event.target.value);
    return;
  }

  if (event.target.name === "expDate") {
    event.target.value = formatExpDate(event.target.value);
  }
}

function onCheckoutFormSubmit(event) {
  if (
    !(event.target instanceof HTMLFormElement) &&
    event.target.id !== "checkout-form"
  ) {
    return;
  }

  event.preventDefault();

  if (!event.target.checkValidity()) {
    event.target.reportValidity();
    return;
  }

  event.target.reset();
  window.CartAPI.clearCart();
  showOrderSuccessPopup();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  const root = document.getElementById("checkout-items");
  if (!root) {
    return;
  }

  root.addEventListener("click", onCheckoutButtonClick);
  root.addEventListener("click", onRemoveButtonClick);
  root.addEventListener("change", onCheckoutItemsChange);
  root.addEventListener("input", onCheckoutFormInput);
  root.addEventListener("submit", onCheckoutFormSubmit);
});

window.addEventListener("cart:updated", renderCheckout);
