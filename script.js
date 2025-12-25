// Global Variables
let products = [];
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadProductsFromCSV();
    updateCart();
    setupEventListeners();
});

// Load Products from CSV
function loadProductsFromCSV() {
    // Show loading state
    productsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading products...</p></div>';
    
    fetch('products.csv')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Could not load products.csv');
            }
            return response.text();
        })
        .then(function(csvText) {
            products = parseCSV(csvText);
            renderProducts('all');
        })
        .catch(function(error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<div class="loading"><p>Error loading products. Please refresh the page.</p></div>';
        });
}

// Parse CSV to Array of Objects
function parseCSV(csvText) {
    var lines = csvText.trim().split('\n');
    var headers = parseCSVLine(lines[0]);
    var result = [];
    
    for (var i = 1; i < lines.length; i++) {
        var values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            var product = {
                id: i,
                name: values[0],
                image: 'images/' + values[1],
                price: parseInt(values[2], 10),
                description: values[3],
                category: values[4],
                badge: values[5] || null
            };
            result.push(product);
        }
    }
    
    return result;
}

// Parse single CSV line handling commas in quoted fields
function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    
    return result;
}

// Setup Event Listeners
function setupEventListeners() {
    // Scroll handler
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Mobile Menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
    
    // Cart
    cartBtn.onclick = openCart;
    cartClose.onclick = closeCart;
    cartOverlay.onclick = closeCart;
    
    // Checkout
    checkoutBtn.onclick = function() {
        closeCart();
        openCheckout();
    };
    checkoutClose.onclick = closeCheckout;
    checkoutModal.onclick = function(e) {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    };
    
    // Contact Form
    document.getElementById('contactForm').onsubmit = function(e) {
        e.preventDefault();
        showToast('Message sent!');
        e.target.reset();
    };
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.onclick = function(e) {
            e.preventDefault();
            var target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();
            }
        };
    });
}

// Load Theme
function loadTheme() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Close Mobile Menu
function closeMobileMenu() {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
}

// Render Products
function renderProducts(filter) {
    var filtered = filter === 'all' ? products : products.filter(function(p) {
        return p.category === filter;
    });
    
    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div class="loading"><p>No products found in this category.</p></div>';
        return;
    }
    
    productsGrid.innerHTML = filtered.map(function(p) {
        return '<div class="product-card">' +
            '<div class="product-image">' +
            (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
            '<button class="product-wishlist">' +
            '<svg viewBox="0 0 24 24" stroke-width="2">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
            '</svg></button>' +
            '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
            '</div>' +
            '<div class="product-info">' +
            '<div class="product-category">' + p.category + '</div>' +
            '<h3 class="product-title">' + p.name + '</h3>' +
            '<p class="product-description">' + p.description + '</p>' +
            '<div class="product-footer">' +
            '<span class="product-price">₹' + p.price + '</span>' +
            '<button class="add-to-cart" onclick="addToCart(' + p.id + ')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="2">' +
            '<line x1="12" y1="5" x2="12" y2="19"></line>' +
            '<line x1="5" y1="12" x2="19" y2="12"></line>' +
            '</svg></button></div></div></div>';
    }).join('');
}

// Add to Cart
function addToCart(id) {
    var p = products.find(function(x) { return x.id === id; });
    if (!p) return;
    
    var existing = cart.find(function(x) { return x.id === id; });
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            quantity: 1
        });
    }
    updateCart();
    showToast(p.name + ' added!');
}

// Update Cart
function updateCart() {
    var totalItems = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
    var totalPrice = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = '₹' + totalPrice.toLocaleString();
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">' +
            '<div class="cart-empty-icon">🛒</div>' +
            '<p>Your cart is empty</p></div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(function(item) {
            return '<div class="cart-item">' +
                '<div class="cart-item-image">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                '</div>' +
                '<div class="cart-item-details">' +
                '<div class="cart-item-title">' + item.name + '</div>' +
                '<div class="cart-item-price">₹' + item.price + '</div>' +
                '<div class="cart-item-qty">' +
                '<button class="qty-btn" onclick="updateQty(' + item.id + ', -1)">−</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button class="qty-btn" onclick="updateQty(' + item.id + ', 1)">+</button>' +
                '</div>' +
                '<button class="cart-item-remove" onclick="removeItem(' + item.id + ')">Remove</button>' +
                '</div></div>';
        }).join('');
        cartFooter.style.display = 'block';
    }
}

// Update Quantity
function updateQty(id, delta) {
    var item = cart.find(function(x) { return x.id === id; });
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            updateCart();
        }
    }
}

// Remove Item
function removeItem(id) {
    cart = cart.filter(function(x) { return x.id !== id; });
    updateCart();
    showToast('Item removed');
}

// Open Cart
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Cart
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Open Checkout
function openCheckout() {
    var totalPrice = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);
    var shipping = totalPrice > 1000 ? 0 : 100;
    
    var orderItems = cart.map(function(item) {
        return '<div class="order-item">' +
            '<span>' + item.name + ' × ' + item.quantity + '</span>' +
            '<span>₹' + (item.price * item.quantity).toLocaleString() + '</span></div>';
    }).join('');
    
    document.getElementById('checkoutBody').innerHTML = 
        '<form id="checkoutForm">' +
        '<div class="checkout-section">' +
        '<h4>Shipping Information</h4>' +
        '<div class="form-group"><label>Full Name *</label><input type="text" required></div>' +
        '<div class="form-group"><label>Email *</label><input type="email" required></div>' +
        '<div class="form-group"><label>Phone *</label><input type="tel" required></div>' +
        '<div class="form-group"><label>Address *</label><input type="text" required></div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>City *</label><input type="text" required></div>' +
        '<div class="form-group"><label>PIN Code *</label><input type="text" pattern="[0-9]{6}" required></div>' +
        '</div></div>' +
        '<div class="checkout-section">' +
        '<h4>Payment Details</h4>' +
        '<div class="card-icons"><span>💳 Visa</span><span>💳 Mastercard</span><span>💳 RuPay</span></div>' +
        '<div class="form-group"><label>Card Number *</label><input type="text" id="cardNum" maxlength="19" placeholder="1234 5678 9012 3456" required></div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Expiry *</label><input type="text" id="expiry" maxlength="5" placeholder="MM/YY" required></div>' +
        '<div class="form-group"><label>CVV *</label><input type="text" maxlength="4" placeholder="123" required></div>' +
        '</div></div>' +
        '<div class="checkout-section">' +
        '<h4>Order Summary</h4>' +
        '<div class="order-summary">' + orderItems +
        '<div class="order-item"><span>Shipping</span><span>' + (shipping ? '₹' + shipping : 'FREE') + '</span></div>' +
        '<div class="order-total"><span>Total</span><span>₹' + (totalPrice + shipping).toLocaleString() + '</span></div>' +
        '</div></div>' +
        '<button type="submit" class="place-order-btn">Place Order - ₹' + (totalPrice + shipping).toLocaleString() + '</button>' +
        '</form>';
    
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup form handlers
    document.getElementById('checkoutForm').onsubmit = handleCheckout;
    
    document.getElementById('cardNum').oninput = function(e) {
        var value = e.target.value.replace(/\D/g, '');
        var formatted = value.match(/.{1,4}/g);
        e.target.value = formatted ? formatted.join(' ') : value;
    };
    
    document.getElementById('expiry').oninput = function(e) {
        var value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    };
}

// Close Checkout
function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle Checkout
function handleCheckout(e) {
    e.preventDefault();
    var btn = e.target.querySelector('.place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(function() {
        var orderNumber = 'SBK' + Date.now().toString().slice(-6);
        document.getElementById('checkoutBody').innerHTML = 
            '<div class="success-message">' +
            '<div class="success-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="2">' +
            '<polyline points="20 6 9 17 4 12"></polyline>' +
            '</svg></div>' +
            '<h3>Order Placed Successfully!</h3>' +
            '<p>Thank you for supporting Melghat artisans.<br>Order #' + orderNumber + ' confirmed.</p>' +
            '<button class="btn btn-primary" onclick="closeCheckout(); cart=[]; updateCart();">Continue Shopping</button>' +
            '</div>';
    }, 2000);
}

// Show Toast
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}
