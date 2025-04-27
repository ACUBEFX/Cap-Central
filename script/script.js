// Declare cartIcon and cartItems once at the top of your script
const cartIcon = document.querySelector('.cart-icon');
const cartItems = document.querySelector('.cart-items');

// Add a close button to the cart
const closeCartButton = document.createElement('button');
closeCartButton.classList.add('close-cart-button');
closeCartButton.innerHTML = '&times;'; // Close symbol
cartItems.prepend(closeCartButton); // Add the button to the top of the cart



function toggleCart() {
    const cartItems = document.querySelector('.cart-items');
    const isCartOpen = cartItems.style.display === 'block';
    cartItems.style.display = isCartOpen ? 'none' : 'block'; // Toggle display
    if (!isCartOpen) {
        renderCart(); // Render the cart when opening
    }
}

cartIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCart(); // Toggles the cart display
});

// Event listener for close button to close the cart
closeCartButton.addEventListener('click', (e) => {
    e.stopPropagation();
    cartItems.style.display = 'none'; // Close the cart
});

document.addEventListener('click', () => {
    cartItems.style.display = 'none'; // Hide the cart
});


cartItems.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the cart from closing when clicking inside
});


// Modal functionality
function openModal(productId) {
    const modal = document.getElementById('product-modal');
    const productCards = document.querySelectorAll('.product-card');

    if (productId < 1 || productId > productCards.length) return;

    const productCard = productCards[productId - 1];
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₦', '').replace(',', ''));
    const productDesc = productCard.querySelector('.product-desc').textContent;
    const productImage = productCard.querySelector('.product-image').src;

    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-product-price').textContent = `₦${productPrice.toLocaleString()}`;
    document.getElementById('modal-product-description').textContent = productDesc;
    document.getElementById('modal-product-image').src = productImage;

    modal.dataset.productId = productId; // Store the product ID in the modal for reference
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    modal.dataset.productId = ''; // Clear product ID
}

// Event delegation for product cards
document.querySelector('.product-grid').addEventListener('click', function (e) {
    const target = e.target;

    // Check if the clicked element is within a product card
    if (target.closest('.product-card')) {
        const productCard = target.closest('.product-card');

        // Prevent modal opening if clicking on "Select size" dropdown or "Add to cart" button
        if (
            target.tagName === 'SELECT' || // Select size dropdown
            target.closest('.add-to-cart-button') // Add to cart button
        ) {
            return;
        }

        // Open modal and pass the product ID
        const productId = Array.from(document.querySelectorAll('.product-card')).indexOf(productCard) + 1;
        openModal(productId);
    }
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal when clicking on the close button
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModal);
});

// Prevent click propagation for the "Select size" dropdown
document.querySelectorAll('.product-size select').forEach(select => {
    select.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Add to cart functionality
let cart = []; // Array to store cart items
const cartCount = document.querySelector('.cart-count');



function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');

    // Clear the cart container
    cartItemsContainer.innerHTML = `
        <button class="close-cart-button">&times;</button>
        <h2>Your Cart</h2>
    `;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML += `<p><i>Nothing is added to the cart list</i></p>`;
        // Add event listener to the newly created close button
        document.querySelector('.close-cart-button').addEventListener('click', toggleCart);
        return;
    }

    // Rest of your renderCart function remains the same...
    let total = 0;
    const itemsList = document.createElement('div');
    itemsList.classList.add('cart-items-list');

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemsList.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <p class="cart-item-name"><strong>${item.name}</strong></p>
                    <p class="cart-item-size">Size: <strong>${item.size}</strong></p>
                    <p class="cart-item-price">Price: <strong>₦${item.price.toLocaleString()}</strong></p>
                    <p class="cart-item-quantity">Quantity: <strong>${item.quantity}</strong></p>
                </div>
                <button class="remove-item-button" data-index="${index}">Remove</button>
            </div>
        `;
    });

    cartItemsContainer.appendChild(itemsList);

    // Add total and checkout button
    cartItemsContainer.innerHTML += `
        <div class="cart-total">
            <p><strong>Total: ₦${total.toLocaleString()}</strong></p>
            <button class="checkout-button">Checkout</button>
        </div>
    `;

    // Add event listeners to remove item buttons
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemIndex = e.target.dataset.index;
            removeFromCart(itemIndex);
        });
    });

    // Add event listener to the newly created close button
    document.querySelector('.close-cart-button').addEventListener('click', toggleCart);
}



// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item at the specified index
    renderCart(); // Re-render the cart
    updateCartCount(); // Update cart count
}

// Function to add an item to the cart
function addToCart(product) {
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.name === product.name && item.size === product.size);

    if (existingItemIndex !== -1) {
        // If the item exists, increase its quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.push({ ...product, quantity: 1 });
    }

    renderCart(); // Re-render the cart
    updateCartCount(); // Update cart count
}

// Update the cart count displayed on the cart icon
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Attach event listener to "Add to Cart" button inside the modal
document.getElementById('add-to-cart-button').addEventListener('click', () => {
    const modal = document.getElementById('product-modal');
    const productId = modal.dataset.productId;
    const productCard = document.querySelectorAll('.product-card')[productId - 1];

    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₦', '').replace(',', ''));
    const productSize = modal.querySelector('#modal-size-select').value;

    // Ensure a size is selected before adding to cart
    if (!productSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    const product = {
        name: productName,
        price: productPrice,
        size: productSize
    };

    addToCart(product); // Add the product to the cart
    closeModal(); // Close modal after adding to cart
});

// Event listener for add-to-cart buttons on product cards
document.querySelectorAll('.add-to-cart-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal from opening

        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₦', '').replace(',', ''));
        const productSize = productCard.querySelector('.product-size select').value;

        // Ensure a size is selected before adding to cart
        if (!productSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

        const product = {
            name: productName,
            price: productPrice,
            size: productSize
        };

        addToCart(product); // Add the product to the cart
    });
});


// Burger menu functionality
const burgerMenu = document.querySelector('.burger-menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

burgerMenu.addEventListener('click', function() {
    // Toggle burger menu animation
    this.classList.toggle('open');
    
    // Toggle sidebar and overlay
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = this.classList.contains('open') ? 'hidden' : 'auto';
});

// Close sidebar when clicking overlay
overlay.addEventListener('click', function() {
    burgerMenu.classList.remove('open');
    sidebar.classList.remove('active');
    this.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close sidebar when clicking a sidebar link
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Sidebar dropdown functionality
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Toggle active class on the button
        this.classList.toggle('active');
        
        // Get the next element sibling (dropdown content)
        const dropdownContent = this.nextElementSibling;
        
        // Toggle display of dropdown content
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
        
        // Close other dropdowns when opening a new one
        document.querySelectorAll('.dropdown-btn').forEach(otherButton => {
            if (otherButton !== this) {
                otherButton.classList.remove('active');
                otherButton.nextElementSibling.style.display = 'none';
            }
        });
    });
});

// Email Form Modal functionality
const emailUsLink = document.getElementById('emailUsLink');
const emailModal = document.getElementById('email-modal');

emailUsLink.addEventListener('click', function(e) {
    e.preventDefault();
    emailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Close email modal when clicking close button
emailModal.querySelector('.close').addEventListener('click', function() {
    emailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close email modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === emailModal) {
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form submission handler
document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('email-name').value;
    const email = document.getElementById('email-address').value;
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    
    // Here you would typically send the form data to your server
    // For now, we'll just show an alert and close the modal
    alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
    
    // Reset form and close modal
    this.reset();
    emailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});



function scrollToServices() {
    // Close any open menus if needed
    document.querySelector('.sidebar').classList.add('active');
    document.querySelector('.overlay').classList.add('active');
    
    // Scroll to the services button
    document.getElementById('services-button').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Optionally open the services dropdown
    document.getElementById('services-button').click();
    
    return false; // Prevent default link behavior
}




 document.addEventListener("DOMContentLoaded", () => {
            const menTab = document.getElementById("men-tab");
            const womenTab = document.getElementById("women-tab");
            const menProducts = document.getElementById("men-products");
            const womenProducts = document.getElementById("women-products");

            menTab.addEventListener("click", (e) => {
                e.preventDefault();
                menTab.classList.add("active-tab");
                womenTab.classList.remove("active-tab");
                menProducts.style.display = "grid";
                womenProducts.style.display = "none";
            });

            womenTab.addEventListener("click", (e) => {
                e.preventDefault();
                womenTab.classList.add("active-tab");
                menTab.classList.remove("active-tab");
                womenProducts.style.display = "grid";
                menProducts.style.display = "none";
            });
        });
