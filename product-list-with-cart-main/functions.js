"use strict";

// Fetch product data from JSON file
const jsonFile = async function () {
  const res = await fetch("data.json");
  const file = await res.json();
  for (const data of file) {
    const order = `
            <div class="product">
              <picture>
                <source srcset="${
                  data["image"]["mobile"]
                }" media="(max-width: 670px)" />
                <img src="${data["image"]["desktop"]}" alt="product" />
              </picture>
              <p class="category">${data["category"]}</p>
              <p class="name">${data["name"]}</p>
              <p class="price">$${data["price"].toFixed(2)}</p>
              <button class="btn-add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="cart"/> Add to Cart
              </button>
            </div>
    `;
    productContainer.insertAdjacentHTML("beforeend", order);
  }
};
jsonFile();

// Add order to cart
const addOrder = function (button) {
  emptyCart.style.display = "none";

  const product = button.closest(".product");
  const orderName = product.querySelector(".name").textContent;
  const orderPrice = Number(
    product.querySelector(".price").textContent.slice(1)
  ).toFixed(2);
  const nameID = product
    .closest(".product")
    .querySelector(".name")
    .textContent.replaceAll(" ", "-")
    .toLowerCase();

  product.setAttribute("id", `${nameID}`);

  // To not add the same order again ---------------------------------
  if (cartOrderContainer.querySelector(`#${nameID}`)) return;

  button.innerHTML = `<button class="decrement">&#8722;</button><span class = "counter">1</span><button class="increment">+</button>`;

  const order = `
    <div class="order" id='${nameID}'>
      <div class="order-info">
        <p class="order-name">${orderName}</p>
        <p>
          <span class="order-counter">1x</span>
          <span class="order-price-each">@ $${orderPrice}</span>
          <span class="order-price">$${orderPrice}</span>
        </p>
      </div>
      <button class="btn-order-remove">⨯</button>
    </div>
`;
  cartOrderContainer.insertAdjacentHTML("beforeend", order);

  totalPrice = totalPrice + Number(orderPrice);
  if (!cartOrderContainer.nextElementSibling) {
    const confirmOrder = `
          <div class="order-confirm">
            <div class="order-total">
              <p class="order-total-label">Order Total</p>
              <p class="order-total-price">$${totalPrice.toFixed(2)}</p>
            </div>
            <div class="carbon-neutral">
              <img src="assets/images/icon-carbon-neutral.svg" alt="carbon-neutral"/>This is a
              <span>carbon-neutral</span> delivery
            </div>
            <button class="btn-confirm-order btn-order">Confirm Order</button>
          </div>
      `;
    cartOrderContainer.insertAdjacentHTML("afterend", confirmOrder);
  } else {
    cartOrderContainer.nextElementSibling.querySelector(
      ".order-total-price"
    ).textContent = `$${totalPrice.toFixed(2)}`;
  }
};

// Increment and decrement variables
const incDecVars = function (e) {
  const cartCounter = e.target.parentElement.querySelector("span");
  let counter = Number(cartCounter.textContent);

  const nameID = e.target
    .closest(".product")
    .querySelector(".name")
    .textContent.replaceAll(" ", "-")
    .toLowerCase();

  const order = cartOrderContainer.querySelector(`#${nameID}`);
  const priceEach = Number(
    order.querySelector(".order-price-each").textContent.slice(3)
  );

  return { cartCounter, counter, nameID, order, priceEach };
};

// Update total price in cart
const updateTotalPrice = function () {
  cartOrderContainer.nextElementSibling.querySelector(
    ".order-total-price"
  ).textContent = `$${totalPrice.toFixed(2)}`;
};

// Remove 1 order from cart
const removeOrder = function (order, nameID) {
  updateTotalPrice();
  order.remove();
  if (cartOrderContainer.childElementCount === 0) {
    cartOrderContainer.nextElementSibling.remove();
    emptyCart.style.display = "block";
  }
  defaultAddProductStyle(nameID);
};

// Update number of orders in cart
const updateCartNumber = function () {
  let counter = 0;
  const yourCart = document.querySelector(".cart h2");
  const orders = [...cartOrderContainer.querySelectorAll(".order")];
  for (const order of orders) {
    counter += parseInt(order.querySelector(".order-counter").textContent);
  }
  yourCart.textContent = `Your Cart (${counter})`;
};

// Click styles to add-to-cart
const clickedAddCartStyle = function (button) {
  button.classList.add("btn-add-to-cart-clicked");
  button.parentElement
    .querySelector("img")
    .style.setProperty("outline", "3px solid var(--Red");
};

// Reset everything in product
const defaultAddProductStyle = function (nameID) {
  const product = productContainer.querySelector(`#${nameID}`);
  const productBtn = product.querySelector(".btn-add-to-cart");

  product.querySelector("img").style.outline = "none";
  productBtn.classList.remove("btn-add-to-cart-clicked");
  productBtn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="cart"/> Add to Cart`;
};

// Adding orders to confirmed orders window
const createConfirmedOrders = function (orders) {
  for (let order of orders) {
    const nameID = order.id;
    const product = productContainer.querySelector(`#${nameID}`);
    const orderName = product.querySelector(".name").textContent;
    const orderPrice = Number(
      product.querySelector(".price").textContent.slice(1)
    );
    const img = product.querySelector("img").getAttribute("src");

    const counter = parseInt(order.querySelector(".order-counter").textContent);
    const confirmedOrder = `
          <div class="order">
            <img src="${img}" alt="product"/>
            <div class="order-info">
              <p class="order-name">${orderName}</p>
              <p>
                <span class="order-counter">${counter}x</span>
                <span class="order-price-each">@ $${orderPrice.toFixed(
                  2
                )}</span>
              </p>
            </div>
            <span class="order-price">$${(orderPrice * counter).toFixed(
              2
            )}</span>
          </div>
    `;
    orderConfirmed
      .querySelector(".orders-container")
      .insertAdjacentHTML("beforeend", confirmedOrder);
  }
};

// Close confirmed orders window
const closeConfirmedOrder = function () {
  overlay.classList.add("hidden");
  orderConfirmed.classList.add("hidden");
};