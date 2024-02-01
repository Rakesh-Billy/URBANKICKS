document.addEventListener("DOMContentLoaded", function () {
  // Fetch the cart items and display them
  let cartItemsContainer = document.getElementById("cartItems");
  let cart = getCartFromLocalStorage();

  // Display each item in the cart
  cart.forEach((cartItem) => {
    let li = createCartItemElement(cartItem);
    cartItemsContainer.appendChild(li);
  });

  // Update the cart count
  updateCartCount();

  // Update the total price
  updateTotalPrice();

  // Add event listener directly to the button
  let addToCartBtn = document.getElementById("addToCartBtn");
  addToCartBtn.addEventListener("click", function (event) {
    selectSizeAndAddToCart(event);
  });
});

function selectSize(event, size) {
  // Remove active class from all buttons
  let sizeButtons = document.querySelectorAll(".size_btns button");
  sizeButtons.forEach((button) => button.classList.remove("active"));

  // Add active class to the clicked button
  let clickedButton = document.getElementById(`size${size}`);
  clickedButton.classList.add("active");

  // Prevent form submission
  event.preventDefault();
}

function selectSizeAndAddToCart(event) {
  event.preventDefault();

  let productId = new URLSearchParams(window.location.search).get("id");
  let selectedProduct = products.find((product) => product.id == productId);

  // Check if the product ID is greater than 12
  if (selectedProduct && selectedProduct.id > 12) {
    // If the product ID is greater than 12, directly add to the cart without size selection
    addToCart(productId);
  } else {
    // Otherwise, proceed with size selection
    let selectedSizeBtn = document.querySelector(".size_btns button.active");

    if (!selectedSizeBtn) {
      alert("Please select a size before adding to the cart.");
      return;
    }

    let selectedSizeValue = selectedSizeBtn.innerText;

    // Call the addToCart function with size information
    addToCart(productId, selectedSizeValue);
  }
}

function addToCart(productId, selectedSize ) {
  let selectedProduct = products.find((product) => product.id == productId);



  // Convert the price to a numeric value
  let productPrice = parseFloat(
    selectedProduct.price.replace("₹", "").replace(",", "").trim()
  );

  // Check if the item with the same id and size is already in the cart
  let cart = getCartFromLocalStorage();
  let existingCartItem = cart.find(
    (item) => item.id == productId && item.size == selectedSize
  );

  if (existingCartItem) {
    // If item exists, increment its count
    existingCartItem.count++;

    // Update the totalPrice based on the new count
    existingCartItem.totalPrice = existingCartItem.count * productPrice;
  } else {
    // If item doesn't exist, add it to the cart
    let cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      size: selectedSize, // Include size only if it's not null
      price: productPrice,
      image: selectedProduct.image,
      count: 1,
      totalPrice: productPrice * 1,
    };

    cart.push(cartItem);
  }

  // Save the updated cart back to localStorage
  saveCartToLocalStorage(cart);

  // Update the cart count
  updateCartCount();

  // Update the total price
  updateTotalPrice();

  // Update the UI
  updateCartUI();

  // Provide feedback to the user
  alert("Item added to cart!");

  // Redirect the user to another page
  // window.location.href = "/cart.html";
}

function createCartItemElement(cartItem) {
  let li = document.createElement("div");
  li.classList.add("cart_product_items");

  li.innerHTML = `
  <div class="img_cntr">
    <img src="${cartItem.image}">
    
    </div>
    
    <div>
    
        <div class="product_name">
<h1>

${cartItem.name}
</h1>
<p>
${cartItem.brand}
</p>

        </div>
        <div class="product_size">
    <p>
    ${cartItem.size ? "Size: " + cartItem.size + "" : ""}   
     </p>
        </div>
        <div class="product_quantity">
        <button onclick="decreaseCartItem('${cartItem.id}', '${
    cartItem.size
  }')">-</button>
        ${cartItem.count}
    <button onclick="increaseCartItem('${cartItem.id}', '${
    cartItem.size
  }')">+</button>
        </div>
    </div>


    <div class="product_total" >
    ₹${cartItem.totalPrice}
    </div>


    `;

  // ${cartItem.name} - ${cartItem.size ? 'Size: ' + cartItem.size + ' - ' : ''}Price: ${cartItem.price} - Count: ${cartItem.count} - Total Price: ${cartItem.totalPrice}
  // <button onclick="decreaseCartItem('${cartItem.id}', '${cartItem.size}')">-</button>
  // <button onclick="increaseCartItem('${cartItem.id}', '${cartItem.size}')">+</button>

  // Add event listeners for + and - buttons
  li.querySelector("button:last-child").addEventListener("click", function () {
    increaseCartItem(cartItem.id, cartItem.size);
  });
  li.querySelector("button:first-child").addEventListener("click", function () {
    decreaseCartItem(cartItem.id, cartItem.size);
  });

  return li;
}

function decreaseCartItem(productId, size) {
  updateCartItemQuantity(productId, size, -0.5);
}

function increaseCartItem(productId, size) {
  updateCartItemQuantity(productId, size, 0.5);
}

function updateCartItemQuantity(productId, size, quantityChange) {
  let cart = getCartFromLocalStorage();
  let cartItem = cart.find((item) => item.id == productId);

  if (cartItem) {
    // Update the count with the change
    cartItem.count += quantityChange;

    // Ensure count doesn't go below 1
    if (cartItem.count < 1) {
      // Remove the item from the cart if count is less than 1
      cart = cart.filter(
        (item) => !(item.id == productId && item.size == size)
      );
    } else {
      // Update the totalPrice based on the new count
      cartItem.totalPrice = cartItem.count * cartItem.price;
    }

    // Save the updated cart back to localStorage
    saveCartToLocalStorage(cart);

    // Update the UI
    updateCartUI();
  }
}

function updateCartUI() {
  let cartItemsContainer = document.getElementById("cartItems");

  // Fetch the updated cart items and display them
  let cart = getCartFromLocalStorage();

  // If cart is empty, display a message
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<li>Your cart is empty</li>";
  } else {
    // Clear the existing items in the UI
    cartItemsContainer.innerHTML = "";

    // Display each item in the cart
    cart.forEach((cartItem) => {
      let li = createCartItemElement(cartItem);
      cartItemsContainer.appendChild(li);
    });

    // Update the total price
    updateTotalPrice();
  }

  // Update the cart count
  updateCartCount();
  // Ensure total price is updated
  updateTotalPrice();
}

function clearCart() {
  // Clear the cart in localStorage
  localStorage.removeItem("cart");

  // Update the cart UI
  updateCartUI();
}

function getCartFromLocalStorage() {
  // Get cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Initialize totalPrice for each item
  cart.forEach((item) => {
    item.totalPrice = item.count * item.price;
  });

  return cart;
}

function saveCartToLocalStorage(cart) {
  // Save the updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  let cart = getCartFromLocalStorage();
  let cartCount = cart.reduce((total, item) => total + item.count, 0);

  // Check if the element with class 'icon-cart' exists
  let iconCartElement = document.querySelector(".icon-cart");

  if (iconCartElement) {
    // Check if the span element exists as a child of 'icon-cart'
    let spanElement = iconCartElement.querySelector("span");

    if (spanElement) {
      // Update the count in the UI
      spanElement.innerText = cartCount;
    } else {
      console.error(
        "No span element found inside element with class 'icon-cart'"
      );
    }
  } else {
    console.error("No element found with class 'icon-cart'");
  }

  // Update the total items count in the cart heading
  document.getElementById("totalItemsCount").innerText = cartCount;
}

function updateTotalPrice() {
  let cart = getCartFromLocalStorage();
  let totalPrice = cart.reduce(
    (total, item) => total + (item.totalPrice || 0),
    0
  );

  // Update the total price in the UI
  let totalPriceElement = document.getElementById("totalPrice");
  if (totalPriceElement) {
    totalPriceElement.innerText = totalPrice.toFixed(2); // Display total price with two decimal places
  } else {
    console.error("No element found with id 'totalPrice'");
  }
}

// ****------------------------PRODUCT JS------------------------****

let products = null;

// get data from JSON file
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    showDetail();
  });

function showDetail() {
  // remove default data from HTML
  let detail = document.querySelector(".detail");
  let listProduct = document.querySelector(".other_products");
  let listsize = document.querySelector(".size_row");
  let productId = new URLSearchParams(window.location.search).get("id");
  let thisProduct = products.find((product) => product.id == productId);

  // if there is no product with id = productId => return to home page
  // if (!thisProduct) {
  //     window.location.href = "/";
  //     return;
  // }

  // Show details for the selected product
  detail.querySelector(".image img").src = thisProduct.image;
  detail.querySelector(".brand").innerText = thisProduct.brand;
  detail.querySelector(".Shoe_name").innerText = thisProduct.name;
  detail.querySelector(".shoe_price").innerText = thisProduct.price;

  if (thisProduct.id >= 1 && thisProduct.id <= 12) {
    let newSizechart = document.createElement("div");
    newSizechart.innerHTML = `
            <div class="sizes">
                <p>Shoe Size (UK)</p>
                <p id="size_chrt" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="fa-solid fa-ruler fa-lg" style="color: #000000;"></i>Size Chart
                </p>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Size Chart</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div>
                                <h1>Size Chart for Shoes</h1>
                                <div class="cntry">
                                    <p>UK</p>
                                    <p>Euro</p>
                                    <p>US</p>
                                </div>
                                <div class="size_measure">
                                    <p>7</p>
                                    <p>41</p>
                                    <p>8</p>
                                </div>
                                <div class="size_measure_x">
                                    <p>8</p>
                                    <p>42.5</p>
                                    <p>9</p>
                                </div>
                                <div class="size_measure">
                                    <p>9</p>
                                    <p>44</p>
                                    <p>10</p>
                                </div>
                                <div class="size_measure_x">
                                    <p>10</p>
                                    <p>45</p>
                                    <p>11</p>
                                </div>
                                <div class="size_measure">
                                    <p>11</p>
                                    <p>46</p>
                                    <p>12</p>
                                </div>
                                <div class="size_measure_x">
                                    <p>12</p>
                                    <p>47.5</p>
                                    <p>13</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="size_btns">
                <button id="size7" onclick="selectSize(event, '7')">7</button>
                <button id="size8" onclick="selectSize(event, '8')">8</button>
                <button id="size9" onclick="selectSize(event, '9')">9</button>
                <button id="size10" onclick="selectSize(event, '10')">10</button>
                <button id="size11" onclick="selectSize(event, '11')">11</button>
                <button id="size12" onclick="selectSize(event, '12')">12</button>
            </div>
        `;
    listsize.appendChild(newSizechart);
  }

  // Get a random sample of 4 products (excluding the selected one)
  const randomProducts = getRandomProducts(products, 4, productId);

  randomProducts.forEach((product) => {
    let newProduct = document.createElement("a");
    newProduct.href = "/product.html?id=" + product.id;
    newProduct.classList.add("col-lg-3", "col-md-4");
    newProduct.innerHTML = ` <div class="card">
            <img class="img-fluid" alt="100%x280" src="${product.image}">
            <div class="card-body">
                <p class="card-text">${product.brand}</p>
                <h5 class="card-title">${product.name}</h5>
                <p>${product.price}</p>
            </div>
          </div>`;

    listProduct.appendChild(newProduct);
  });
}

// generate random you may like products

function getRandomProducts(products, count, excludedProductId) {
  // Shuffle the products array
  const shuffledProducts = shuffleArray(products);

  // Filter out the excluded product
  const filteredProducts = shuffledProducts.filter(
    (product) => product.id !== excludedProductId
  );

  // Take the first 'count' products
  return filteredProducts.slice(0, count);
}

function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ****------------------------PRODUCT JS END------------------------****

function applyCoupon() {
    let couponCodeInput = document.getElementById("couponCode");
    let discountMessage = document.querySelector(".dscnt_msg");
    let couponCode = couponCodeInput.value.trim().toUpperCase();

    if (couponCode === "URBAN20") {
        // Get the total price and apply a 20% discount
        let totalElement = document.getElementById("totalPrice");
        let total = parseFloat(totalElement.innerText);
        let discountedPrice = total * 0.8; // 20% discoun
        let discountElement = document.getElementById("discountPrice");

        // Display the discounted price
        discountElement.innerHTML =`<p>Applied 20% Discount</p>
        <p>Discounted Price: ₹ ${discountedPrice.toFixed(2)}</p>` ;

        // Provide feedback to the user
        alert("Coupon applied! 20% discount has been applied to the total price.");
    } else {
        // Provide feedback for invalid coupon code
        alert("Invalid coupon code. Please enter a valid code.");
    }
}
