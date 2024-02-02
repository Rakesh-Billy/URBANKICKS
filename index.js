const startinghours = 12;
const startingminutes = 60;
let time = startingminutes*60;
let time2 = startinghours*60*60;

const Hours = document.getElementById('hour');
const Minutes = document.getElementById('minute');
const Seconds = document.getElementById('second');

setInterval(updateCountdown, 1000);

function updateCountdown(){
    let hrs = Math.floor(time2 / 3600); // Calculate remaining hours
    let mins = Math.floor((time2 % 3600) / 60); // Calculate remaining minutes
    let secs = time % 60;

    secs =secs < 10 ? '0' + secs : secs;
    mins =mins < 10 ? '0' + mins : mins;
    hrs =hrs < 10 ? '0' + hrs : hrs;


    Hours.innerHTML= hrs
    Minutes.innerHTML = mins;
    Seconds.innerHTML = secs;
    time--;
    time2--;
}

// Scroll to Top

// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 650 || document.documentElement.scrollTop > 650) {
    mybutton.style.display = "block" ;

  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

let products = null;

// get data from the JSON file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        filterAndAddDataToHTML();
        console.log(products);
    });

function filterAndAddDataToHTML() {
    // remove default data from HTML
    let listProductHTML = document.querySelector('.favorite');
    
    // filter products based on the specified product IDs (1, 3, 7)
    let filteredProducts = products.filter(product => [8, 2, 3, 7].includes(product.id));

    // add new data
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            let newProduct = document.createElement('a');
            newProduct.href = '/product.html?id=' + product.id;
            newProduct.classList.add('col-md-3', 'g-10');
            newProduct.innerHTML =
                ` <div class="card">
                    <img class="img-fluid" alt="100%x280" src="${product.image}">
                    <div class="card-body">
                      <p id="p_brand" class="card-text">${product.brand}</p>
                      <h5 id="p_name" class="card-title">${product.name}</h5>
                      <p id="p_price" >${product.price}</p>
                    </div>
                  </div>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}
