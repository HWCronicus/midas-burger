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
  const reviewTotal = document.getElementById("checkout-review-total");
  const reviewActions = document.getElementById("checkout-review-actions");
  const reviewStage = document.getElementById("checkout-review-stage");
  const detailsStage = document.getElementById("checkout-details-stage");
  const emptyState = document.getElementById("checkout-empty");

  root.innerHTML = rows;

  if (reviewTotal) {
    reviewTotal.textContent = `Total: ${window.CartAPI.getTotalPrice()}`;
    reviewTotal.hidden = false;
  }

  if (reviewActions) {
    reviewActions.hidden = false;
  }

  if (reviewStage) {
    reviewStage.hidden = false;
  }

  if (detailsStage) {
    detailsStage.hidden = true;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }
}

function renderCheckoutForm(root, items) {
  const rows = renderSummaryRows(items);
  const summaryRoot = document.getElementById("checkout-summary-items");
  const summaryTotal = document.getElementById("checkout-summary-total");
  const reviewStage = document.getElementById("checkout-review-stage");
  const detailsStage = document.getElementById("checkout-details-stage");
  const emptyState = document.getElementById("checkout-empty");

  root.innerHTML = "";

  if (summaryRoot) {
    summaryRoot.innerHTML = rows;
  }

  if (summaryTotal) {
    summaryTotal.textContent = `Total: ${window.CartAPI.getTotalPrice()}`;
  }

  if (reviewStage) {
    reviewStage.hidden = true;
  }

  if (detailsStage) {
    detailsStage.hidden = false;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }
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
  const reviewStage = document.getElementById("checkout-review-stage");
  const reviewTotal = document.getElementById("checkout-review-total");
  const reviewActions = document.getElementById("checkout-review-actions");
  const detailsStage = document.getElementById("checkout-details-stage");
  const summaryRoot = document.getElementById("checkout-summary-items");
  const summaryTotal = document.getElementById("checkout-summary-total");
  const emptyState = document.getElementById("checkout-empty");

  const items = window.CartAPI.getItems();
  if (!items.length) {
    checkoutStage = "review";
    if (heading) {
      heading.textContent = "Review Your Cart";
    }

    root.innerHTML = "";

    if (summaryRoot) {
      summaryRoot.innerHTML = "";
    }

    if (summaryTotal) {
      summaryTotal.textContent = "";
    }

    if (reviewTotal) {
      reviewTotal.hidden = true;
      reviewTotal.textContent = "";
    }

    if (reviewActions) {
      reviewActions.hidden = true;
    }

    if (reviewStage) {
      reviewStage.hidden = true;
    }

    if (detailsStage) {
      detailsStage.hidden = true;
    }

    if (emptyState) {
      emptyState.hidden = false;
    }

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
  const checkoutContent = document.querySelector(".checkout-content");
  if (!checkoutContent) {
    return;
  }

  checkoutContent.addEventListener("click", onCheckoutButtonClick);
  checkoutContent.addEventListener("click", onRemoveButtonClick);
  checkoutContent.addEventListener("change", onCheckoutItemsChange);
  checkoutContent.addEventListener("input", onCheckoutFormInput);
  checkoutContent.addEventListener("submit", onCheckoutFormSubmit);
});

window.addEventListener("cart:updated", renderCheckout);
