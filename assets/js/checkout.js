document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let checkoutItems = document.getElementById("checkout-items");
    let total = 0;

    // Display Cart Items on Checkout Page
    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        checkoutItems.appendChild(li);
        total += item.price * item.quantity;
    });

    document.getElementById("checkout-total").textContent = total.toFixed(2);

    // Handle Form Submission
    document.getElementById("checkout-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const payButton = document.querySelector("button[type='submit']");
        showLoading(payButton);

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const totalAmount = document.getElementById("checkout-total").innerText;
        const paymentMethod = document.getElementById("payment-method").value;

        if (paymentMethod === "momo") {
            processMoMoPayment(name, email, address, totalAmount, payButton);
        } else if (paymentMethod === "paypal") {
            return;
        } else if (paymentMethod === "stripe") {
            handleStripePayment(totalAmount, payButton);
        } else {
            showMessage("Invalid payment method selected.", "error");
            resetButton(payButton);
        }
    });
});

/* ✅ Show Loading Spinner */
function showLoading(button) {
    button.classList.add("loading");
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span> Processing...`;
}

/* ✅ Reset Button */
function resetButton(button) {
    button.classList.remove("loading");
    button.disabled = false;
    button.innerHTML = "Pay Now";
}

/* ✅ Display Styled Message */
function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    messageBox.textContent = message;
    messageBox.className = `message ${type}`; // Apply class based on type (success or error)
    messageBox.style.display = "block"; // Show message

    setTimeout(() => {
        messageBox.style.display = "none"; // Hide after 5 seconds
    }, 5000);
}

/* ✅ Clear Cart & Redirect */
function clearCartAndRedirect() {
    localStorage.removeItem("cart");
    showMessage("Payment successful! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "thank-you.html";
    }, 2000);
}

/* ✅ Fixed MTN MoMo Payment */
async function processMoMoPayment(name, email, address, amount, button) {
    try {
        const response = await fetch("https://your-backend.com/api/mtn-momo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, address, amount })
        });

        if (!response.ok) throw new Error("Server error, please try again!");

        const data = await response.json();
        if (data.status === "success") {
            showMessage("Payment successful via MTN MoMo!", "success");
            clearCartAndRedirect();
        } else {
            throw new Error("MoMo payment failed! Please try again.");
        }
    } catch (error) {
        console.error("MoMo payment error:", error);
        showMessage(error.message, "error");
        resetButton(button);
    }
}

/* ✅ Fixed PayPal Integration */
paypal.Buttons({
    createOrder: (data, actions) => {
        const totalAmount = parseFloat(document.getElementById("checkout-total").innerText.replace(/,/g, '')); // ✅ Fix: Parse to number
        return actions.order.create({
            purchase_units: [{
                amount: { value: totalAmount.toFixed(2) } // ✅ Ensure valid format
            }]
        });
    },
    onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
            showMessage(`Transaction completed by ${details.payer.name.given_name}!`, "success"); // ✅ Fix: Proper backticks
            resetButton(document.querySelector("button[type='submit']"));
            clearCartAndRedirect();
        });
    },
    onError: (err) => {
        showMessage("PayPal payment failed! Please try again.", "error");
        console.error("PayPal Error:", err);
        resetButton(document.querySelector("button[type='submit']"));
    }
}).render("#paypal-button-container");

/* ✅ Fixed Stripe Payment */
async function handleStripePayment(amount, button) {
    try {
        const response = await fetch("https://your-backend.com/api/stripe-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) throw new Error("Server error, please try again!");

        const data = await response.json();
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            throw new Error("Invalid response from server.");
        }
    } catch (error) {
        console.error("Stripe payment error:", error);
        showMessage(error.message, "error");
        resetButton(button);
    }
}
