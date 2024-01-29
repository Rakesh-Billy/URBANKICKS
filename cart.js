       // Load cart items from localStorage on page load
       document.addEventListener("DOMContentLoaded", function() {
        loadCartItems();
    });

    function addToCart() {
        var selectedSize = document.getElementById("size").value;

        if (selectedSize !== "") {
            // Check if the size is already in the cart
            var existingCartItem = getCartItem(selectedSize);

            if (existingCartItem) {
                // If the size is already in the cart, increment the count
                existingCartItem.count++;
            } else {
                // If the size is not in the cart, add it with count 1
                var cartItem = { size: selectedSize, count: 1 };
                cartItems.push(cartItem);
            }

            // Display the updated cart items
            displayCartItems();

            // Save cart items to localStorage
            saveCartItems();

            // Display an alert message
            alert("Item added to cart!");
        } else {
            alert("Please select a size before adding to cart.");
        }
    }

    function displayCartItems() {
        var cartItemsElement = document.getElementById("cartItems");
        var emptyCartMessage = document.getElementById("emptyCartMessage");
        cartItemsElement.innerHTML = ""; // Clear previous items

        // Display each item in the cart
        cartItems.forEach(function(cartItem) {
            var listItem = document.createElement("li");

            // Create a div for the cart item
            var cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cartItemLink";

            // Create a hyperlink for the cart item
            var itemLink = document.createElement("a");
            itemLink.textContent = "Size " + cartItem.size + " (Count: " + cartItem.count + ")";
            itemLink.onclick = function() {
                // Navigate to the cart page when clicking on the cart item
                goToCartPage();
            };

            // Create "+" and "-" buttons for quantity control
            var plusButton = createQuantityButton("+", function() {
                cartItem.count++;
                displayCartItems();
                saveCartItems();
            });

            var minusButton = createQuantityButton("-", function() {
                if (cartItem.count > 1) {
                    cartItem.count--;
                } else {
                    // If the count is 1 or less, remove the item from the cart
                    removeCartItem(cartItem.size);
                }

                displayCartItems();
                saveCartItems();
            });

            // Append elements to the cart item div
            cartItemDiv.appendChild(itemLink);
            cartItemDiv.appendChild(plusButton);
            cartItemDiv.appendChild(minusButton);

            listItem.appendChild(cartItemDiv);
            cartItemsElement.appendChild(listItem);
        });

        // Display the empty cart message if the cart is empty
        if (cartItems.length === 0) {
            emptyCartMessage.textContent = "Your Cart is Empty";
        } else {
            emptyCartMessage.textContent = "";
        }
    }

    function saveCartItems() {
        // Save the updated cart items to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function loadCartItems() {
        // Get the cart items from localStorage
        var storedCartItems = localStorage.getItem("cartItems");

        if (storedCartItems) {
            // Parse the stored data
            cartItems = JSON.parse(storedCartItems);
        }

        // Display the cart items on page load
        displayCartItems();
    }

    function goToCartPage() {
        // In a real scenario, you would navigate to the actual cart page
        // For simplicity, we'll just show an alert here
        alert("Redirecting to Cart Page");
    }

    function getCartItem(size) {
        // Find the cart item with the specified size
        return cartItems.find(function(cartItem) {
            return cartItem.size === size;
        });
    }

    function removeCartItem(size) {
        // Remove the cart item with the specified size
        cartItems = cartItems.filter(function(cartItem) {
            return cartItem.size !== size;
        });
    }

    function getCartItems() {
        // Get the existing cart items from localStorage
        var storedCartItems = localStorage.getItem("cartItems");

        // Parse the stored data or initialize an empty array if null
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    }

    function createQuantityButton(text, clickHandler) {
        var button = document.createElement("button");
        button.textContent = text;
        button.className = "quantityControl";
        button.onclick = clickHandler;
        return button;
    }

    // Initialize cart items
    var cartItems = [];