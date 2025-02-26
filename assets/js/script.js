document.addEventListener("DOMContentLoaded", function () {
    console.log("Website Loaded Successfully!");

    function toggleMenu() {
        document.querySelector(".nav-links").classList.toggle("show");
    }

    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }

    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartModal = document.getElementById("cart-modal");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.closest(".product");
            const name = product.querySelector("h3").textContent;
            const priceText = product.querySelector(".price").textContent;
            const price = parseFloat(priceText.replace("$", ""));
            const image = product.querySelector("img").src;

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1, image });
            }

            saveCart();
            updateCart();
            showAlert(`${name} added to cart!`);  // ✅ Replace alert() with showAlert()
        });
    });

    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;
        let itemCount = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            let li = document.createElement("li");
            li.classList.add("cart-item");
            li.innerHTML = `
                <div class="cart-item-content">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div>
                        <p>${item.name} x ${item.quantity}</p>
                        <p><strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
                        <button class="minus-btn" data-index="${index}">-</button>
                        <button class="plus-btn" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = itemCount;

        // Attach event listeners dynamically
        document.querySelectorAll(".minus-btn").forEach(button => {
            button.addEventListener("click", function () {
                changeQuantity(parseInt(this.dataset.index), -1);
            });
        });

        document.querySelectorAll(".plus-btn").forEach(button => {
            button.addEventListener("click", function () {
                changeQuantity(parseInt(this.dataset.index), 1);
            });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                removeItem(parseInt(this.dataset.index));
            });
        });
    }

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function changeQuantity(index, amount) {
        if (cart[index].quantity + amount > 0) {
            cart[index].quantity += amount;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCart();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCart();
    }

    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer) {
        cartContainer.addEventListener("click", function () {
            cartModal.style.display = "block";
        });
    }

    const closeCart = document.getElementById("close-cart");
    if (closeCart) {
        closeCart.addEventListener("click", function () {
            cartModal.style.display = "none";
        });
    }

    updateCart();

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (cart.length === 0) {
                showAlert("Your cart is empty!");  // ✅ Replaced alert() with showAlert()
                return;
            }
            window.location.href = "checkout.html";
        });
    }

    document.querySelectorAll(".buy-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const product = this.closest(".product");
            const name = product.querySelector("h3").textContent;
            const priceText = product.querySelector(".price").textContent;
            const price = parseFloat(priceText.replace("$", ""));
            const image = product.querySelector("img").src;

            let cart = [{ name, price, quantity: 1, image }];
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "checkout.html";
        });
    });

    // 🔎 Search
    document.getElementById("search-bar").addEventListener("keyup", function () {
        let searchQuery = this.value.toLowerCase();
        let products = document.querySelectorAll(".product");

        products.forEach(product => {
            let productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(searchQuery) ? "block" : "none";
        });
    });

    // 📂 Filter
    window.filterCategory = function (category) {
        let products = document.querySelectorAll(".product");

        products.forEach(product => {
            product.style.display = category === "all" || product.classList.contains(category) ? "block" : "none";
        });
    };

    // ✅ Custom Alert Modal Function
    function showAlert(message) {
        let alertBox = document.getElementById("custom-alert");
        let alertMessage = document.getElementById("alert-message");

        alertMessage.textContent = message;
        alertBox.style.display = "block";

        // Close alert on clicking 'X'
        document.querySelector(".close-alert").onclick = function () {
            alertBox.style.display = "none";
        };

        // Auto-hide after 3 seconds
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    }
});
