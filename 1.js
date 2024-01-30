document.addEventListener("DOMContentLoaded", function () {
    let addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.addEventListener("click", addToCart);
});

function selectSize(size) {
// Remove active class from all buttons
let sizeButtons = document.querySelectorAll('.size_btns button');
sizeButtons.forEach(button => button.classList.remove('active'));

// Add active class to the clicked button
let clickedButton = document.getElementById(`size${size}`);
clickedButton.classList.add('active');

// Prevent form submission
event.preventDefault();
}


function addToCart() {
    // Get selected size
    let selectedSizeBtn = document.querySelector('.size_btns button.active');

    if (!selectedSizeBtn) {
        alert("Please select a size before adding to the cart.");
        return;
    }

    // Get product details
    let productId = new URLSearchParams(window.location.search).get('id');
    let selectedProduct = products.find(product => product.id == productId);
    let selectedSizeValue = selectedSizeBtn.innerText;

    // Add the product to the cart
    let cartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        brand: selectedProduct.brand,
        size: selectedSizeValue,
        price: selectedProduct.price,
        image: selectedProduct.image,
    };

    // Assume you have a function addToCart in your cart.js
    addToCartFunction(cartItem);

    // Update the cart count
    updateCartCount();

    // Provide feedback to the user
    alert("Item added to cart!");
}

function updateCartCount() {
    // Implement this function based on your cart structure
    // For example, if you have a global variable for cart count, you can increment it here.
}

// ... Your existing script for showing details ...
let products = null;

// get data from JSON file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        showDetail();
    })

function showDetail() {
    // remove default data from HTML
    let detail = document.querySelector('.detail');
    let listProduct = document.querySelector('.other_products');
    let productId = new URLSearchParams(window.location.search).get('id');
    let thisProduct = products.find(product => product.id == productId);

    // if there is no product with id = productId => return to home page
    // if (!thisProduct) {
    //     window.location.href = "/";
    // }

    // Show details for the selected product
    detail.querySelector('.image img').src = thisProduct.image;
    detail.querySelector('.brand').innerText = thisProduct.brand;
    detail.querySelector('.Shoe_name').innerText = thisProduct.name;
    detail.querySelector('.shoe_price').innerText = thisProduct.price;

    // Get a random sample of 4 products (excluding the selected one)
    const randomProducts = getRandomProducts(products, 4, productId);

    randomProducts.forEach(product => {
        let newProduct = document.createElement('a');
        newProduct.href = '/product.html?id=' + product.id;
        newProduct.classList.add('col-lg-3', 'col-md-4');
        newProduct.innerHTML =
            ` <div class="card">
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
    const filteredProducts = shuffledProducts.filter(product => product.id !== excludedProductId);

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