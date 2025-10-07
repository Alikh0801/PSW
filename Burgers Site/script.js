import { products } from "./api.js";

let cart = {};
let cartOpen = false;
let currentPage = 1;
const perPage = 6;

const container = document.getElementById("product-container");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartToggle = document.getElementById("cart-toggle");
const cartCount = document.getElementById("cart-count");
const pagination = document.getElementById("pagination");

function renderProducts() {
    container.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visibleProducts = products.slice(start, end);

    visibleProducts.forEach((p) => {
        const card = document.createElement("div");
        card.className =
            "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col";

        card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="h-48 w-full object-cover">
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-lg font-semibold">${p.name}</h3>
        <p class="text-gray-500 text-sm flex-grow">${p.dsc}</p>
        <div class="flex justify-between items-center mt-3">
          <span class="text-xl font-bold text-blue-600">$${p.price}</span>
          <span class="text-yellow-500">⭐ ${p.rate}</span>
        </div>
        <button class="bg-blue-600 text-white w-full mt-3 py-2 rounded-xl hover:bg-blue-700 transition add-to-cart" data-id="${p.id}">
          Add to Cart
        </button>
      </div>
    `;
        container.appendChild(card);
    });

    attachAddToCartEvents();
    renderPagination();
}

function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(products.length / perPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 mx-1 rounded-lg border transition ${i === currentPage
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 hover:bg-blue-100"
            }`;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderProducts();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        pagination.appendChild(btn);
    }
}

function attachAddToCartEvents() {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const product = products.find((p) => p.id === id);
            if (cart[id]) cart[id].quantity++;
            else cart[id] = { ...product, quantity: 1 };
            renderCart();
        });
    });
}

function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    Object.values(cart).forEach((item) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        const div = document.createElement("div");
        div.className =
            "flex justify-between items-center border-b py-2 text-sm";
        div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p>$${item.price} × ${item.quantity}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 bg-gray-200 rounded decrease" data-id="${item.id}">-</button>
        <button class="px-2 py-1 bg-gray-200 rounded increase" data-id="${item.id}">+</button>
        <button class="text-red-500 delete" data-id="${item.id}">🗑️</button>
      </div>
    `;
        cartItems.appendChild(div);
    });

    if (itemCount === 0)
        cartItems.innerHTML = `<p class="text-gray-400 text-center py-4">Your cart is empty</p>`;

    cartCount.textContent = itemCount;
    document.getElementById("cart-total").textContent = "$" + total.toFixed(2);
    attachCartEvents();
}

function attachCartEvents() {
    document.querySelectorAll(".increase").forEach((btn) =>
        btn.addEventListener("click", () => {
            cart[btn.dataset.id].quantity++;
            renderCart();
        })
    );

    document.querySelectorAll(".decrease").forEach((btn) =>
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            if (cart[id].quantity > 1) cart[id].quantity--;
            else delete cart[id];
            renderCart();
        })
    );

    document.querySelectorAll(".delete").forEach((btn) =>
        btn.addEventListener("click", () => {
            delete cart[btn.dataset.id];
            renderCart();
        })
    );
}

cartToggle.addEventListener("click", () => {
    cartOpen = !cartOpen;
    cartPanel.classList.toggle("translate-x-0");
    cartPanel.classList.toggle("translate-x-full");
});


renderProducts();
renderCart();
