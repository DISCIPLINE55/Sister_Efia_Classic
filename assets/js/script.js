document.addEventListener("DOMContentLoaded", function () {
    console.log("Website Loaded Successfully!");

    document.getElementById('search-btn').addEventListener('click', function() {
        let searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            alert("Searching for: " + searchTerm);
            // Redirect to search results page (optional)
            // window.location.href = `search.html?query=${searchTerm}`;
        }
    });
    
    // ☰ Mobile Menu Toggle
    function toggleMenu() {
        document.querySelector(".nav-links").classList.toggle("show");
    }

    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }

    // 🔵 Highlight Active Nav Link
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // 🛒 Shopping Cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartModal = document.getElementById("cart-modal");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    // ✅ Add to Cart
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
            showAlert(`${name} added to cart!`);
        });
    });

    // 🔄 Update Cart
    function updateCart() {
        if (!cartItems || !cartTotal || !cartCount) return;

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

    // 💾 Save Cart
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ➖➕ Change Quantity
    function changeQuantity(index, amount) {
        if (cart[index].quantity + amount > 0) {
            cart[index].quantity += amount;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCart();
    }

    // ❌ Remove Item
    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCart();
    }

    // 🛍️ Open & Close Cart
    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer && cartModal) {
        cartContainer.addEventListener("click", function () {
            cartModal.style.display = "block";
        });

        const closeCart = document.getElementById("close-cart");
        if (closeCart) {
            closeCart.addEventListener("click", function () {
                cartModal.style.display = "none";
            });
        }
    }

    updateCart();

    // ✅ Checkout
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (cart.length === 0) {
                showAlert("Your cart is empty!");
                return;
            }
            window.location.href = "checkout.html";
        });
    }

    // ⚡ Buy Now
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

    // 🔍 Search Products
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.addEventListener("keyup", function () {
            let searchQuery = this.value.toLowerCase();
            let products = document.querySelectorAll(".product");

            products.forEach(product => {
                let productName = product.querySelector("h3").textContent.toLowerCase();
                product.style.display = productName.includes(searchQuery) ? "block" : "none";
            });
        });
    }

    // 📂 Filter Products
    window.filterCategory = function (category) {
        let products = document.querySelectorAll(".product");

        products.forEach(product => {
            product.style.display = category === "all" || product.classList.contains(category) ? "block" : "none";
        });
    };

    // ✅ Custom Alert Modal
    function showAlert(message) {
        let alertBox = document.getElementById("custom-alert");
        let alertMessage = document.getElementById("alert-message");

        if (!alertBox || !alertMessage) return;

        alertMessage.textContent = message;
        alertBox.style.display = "block";

        document.querySelector(".close-alert").onclick = function () {
            alertBox.style.display = "none";
        };

        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    }
});



document.querySelector(".contact-form").addEventListener("submit", function(e) {
    let email = document.querySelector("#email").value;
    let message = document.querySelector("#message").value;
    let errorMsg = "";

    if (!email.includes("@")) {
        errorMsg += "Invalid email address. ";
    }

    if (message.length < 10) {
        errorMsg += "Message must be at least 10 characters long.";
    }

    if (errorMsg) {
        alert(errorMsg);
        e.preventDefault();
    }
});


window.onscroll = function() {
    let button = document.getElementById("scrollTopBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



document.getElementById("newsletterForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents page refresh

    let email = document.getElementById("emailInput").value;
    let message = document.getElementById("message");

    if (email) {
        // Store in localStorage (simulating backend)
        let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem("subscribers", JSON.stringify(subscribers));

            message.textContent = "Thank you for subscribing!";
            message.style.color = "#fff";
            message.style.background = "#4CAF50"; // Green success message
            message.style.padding = "10px";
            message.style.borderRadius = "5px";
        } else {
            message.textContent = "You are already subscribed!";
            message.style.color = "#ffeb3b"; // Yellow for duplicate
        }

        document.getElementById("emailInput").value = ""; // Clear input field
    } else {
        message.textContent = "Please enter a valid email!";
        message.style.color = "red";
    }
});
