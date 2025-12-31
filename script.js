// Global Variables
let products = [];
let cart = [];
let userCurrency = { code: 'INR', symbol: '₹', rate: 1 };
let userCountry = 'IN';
let exchangeRates = {};
let shippingRates = null;

// Contact Information
const CONTACT_EMAIL = 'info@srushtibandh.in';
const CONTACT_WHATSAPP = '+919545717614';
const ORIGIN_PINCODE = '444702';
const ORIGIN_COUNTRY = 'IN';

// Currency symbols
const currencySymbols = {
    'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$', 'CAD': 'C$',
    'CHF': 'CHF', 'CNY': '¥', 'SEK': 'kr', 'NZD': 'NZ$', 'MXN': 'MX$', 'SGD': 'S$',
    'HKD': 'HK$', 'NOK': 'kr', 'KRW': '₩', 'TRY': '₺', 'RUB': '₽', 'BRL': 'R$',
    'ZAR': 'R', 'AED': 'د.إ', 'SAR': 'ر.س', 'MYR': 'RM', 'THB': '฿', 'IDR': 'Rp',
    'PHP': '₱', 'PKR': 'Rs', 'BDT': '৳', 'VND': '₫', 'EGP': 'E£', 'NGN': '₦',
    'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'ILS': '₪', 'CLP': 'CL$', 'COP': 'CO$',
    'PEN': 'S/', 'ARS': 'AR$', 'TWD': 'NT$', 'DKK': 'kr', 'RON': 'lei', 'BGN': 'лв',
    'HRK': 'kn', 'ISK': 'kr', 'LKR': 'Rs', 'NPR': 'Rs', 'MMK': 'K', 'KHR': '៛'
};

// Country to currency mapping
const countryCurrency = {
    'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR',
    'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 'IE': 'EUR',
    'FI': 'EUR', 'GR': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'LT': 'EUR', 'LV': 'EUR',
    'EE': 'EUR', 'CY': 'EUR', 'MT': 'EUR', 'LU': 'EUR', 'CA': 'CAD', 'AU': 'AUD',
    'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'SG': 'SGD', 'HK': 'HKD', 'TW': 'TWD',
    'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'BD': 'BDT',
    'PK': 'PKR', 'LK': 'LKR', 'NP': 'NPR', 'AE': 'AED', 'SA': 'SAR', 'IL': 'ILS',
    'TR': 'TRY', 'RU': 'RUB', 'UA': 'UAH', 'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF',
    'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
    'CH': 'CHF', 'NZ': 'NZD', 'ZA': 'ZAR', 'EG': 'EGP', 'NG': 'NGN', 'KE': 'KES',
    'BR': 'BRL', 'MX': 'MXN', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN'
};

// Country phone codes
const phoneCountryCodes = {
    'IN': '+91', 'US': '+1', 'GB': '+44', 'CA': '+1', 'AU': '+61', 'DE': '+49',
    'FR': '+33', 'IT': '+39', 'ES': '+34', 'NL': '+31', 'BE': '+32', 'AT': '+43',
    'CH': '+41', 'SE': '+46', 'NO': '+47', 'DK': '+45', 'FI': '+358', 'IE': '+353',
    'PT': '+351', 'PL': '+48', 'CZ': '+420', 'HU': '+36', 'RO': '+40', 'GR': '+30',
    'JP': '+81', 'KR': '+82', 'CN': '+86', 'SG': '+65', 'MY': '+60', 'TH': '+66',
    'ID': '+62', 'PH': '+63', 'VN': '+84', 'HK': '+852', 'TW': '+886',
    'AE': '+971', 'SA': '+966', 'IL': '+972', 'TR': '+90', 'ZA': '+27',
    'EG': '+20', 'NG': '+234', 'KE': '+254', 'BR': '+55', 'MX': '+52',
    'AR': '+54', 'CL': '+56', 'NZ': '+64', 'BD': '+880', 'PK': '+92',
    'LK': '+94', 'NP': '+977', 'RU': '+7', 'UA': '+380'
};

// Fallback shipping zones (used if API fails)
const fallbackShippingZones = {
    'domestic': { countries: ['IN'], baseRate: 50, perKg: 20, freeAbove: 1000, days: '3-5 business days', carrier: 'India Post / DTDC' },
    'saarc': { countries: ['BD', 'PK', 'LK', 'NP', 'BT', 'MV', 'AF'], baseRate: 450, perKg: 120, freeAbove: 5000, days: '7-10 business days', carrier: 'India Post International' },
    'asia': { countries: ['SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'KH', 'MM', 'HK', 'TW', 'KR', 'JP', 'CN', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM'], baseRate: 800, perKg: 200, freeAbove: 8000, days: '7-12 business days', carrier: 'DHL / FedEx' },
    'europe': { countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SE', 'NO', 'DK', 'CH', 'SK', 'SI', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU', 'IS', 'RU', 'UA', 'TR'], baseRate: 1200, perKg: 350, freeAbove: 10000, days: '10-15 business days', carrier: 'DHL Express' },
    'americas': { countries: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE'], baseRate: 1500, perKg: 400, freeAbove: 12000, days: '12-18 business days', carrier: 'FedEx / UPS' },
    'oceania': { countries: ['AU', 'NZ'], baseRate: 1400, perKg: 380, freeAbove: 12000, days: '12-18 business days', carrier: 'DHL Express' },
    'africa': { countries: ['ZA', 'EG', 'NG', 'KE', 'MA', 'TN', 'GH'], baseRate: 1600, perKg: 420, freeAbove: 15000, days: '15-20 business days', carrier: 'DHL / EMS' }
};

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
    detectUserLocation();
    setupEventListeners();
});

// Detect user location and currency
function detectUserLocation() {
    productsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading products...</p></div>';
    
    fetch('https://ipapi.co/json/')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            userCountry = data.country_code || 'IN';
            var currencyCode = countryCurrency[userCountry] || 'USD';
            return fetchExchangeRates(currencyCode);
        })
        .catch(function(error) {
            console.log('Location detection failed, using INR:', error);
            userCurrency = { code: 'INR', symbol: '₹', rate: 1 };
            loadProductsFromCSV();
        });
}

// Fetch live exchange rates
function fetchExchangeRates(targetCurrency) {
    fetch('https://api.exchangerate-api.com/v4/latest/INR')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            exchangeRates = data.rates;
            var rate = exchangeRates[targetCurrency] || 1;
            userCurrency = {
                code: targetCurrency,
                symbol: currencySymbols[targetCurrency] || targetCurrency,
                rate: rate
            };
            loadProductsFromCSV();
        })
        .catch(function(error) {
            console.log('Exchange rate fetch failed:', error);
            userCurrency = { code: 'INR', symbol: '₹', rate: 1 };
            loadProductsFromCSV();
        });
}

// Fetch shipping rates from carrier APIs
function fetchShippingRates(destCountry, destPincode, weightKg) {
    return new Promise(function(resolve) {
        // Try multiple shipping APIs
        var shippingPromises = [];
        
        // EasyPost API (if available) - simulated
        // Shippo API (if available) - simulated
        // For demo, we'll use a rate calculation service
        
        // Using Abstract API for geolocation-based estimation
        var estimatedRates = [];
        
        // Try to get rates from shipping calculator APIs
        fetch('https://api.postalpincode.in/pincode/' + destPincode)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                // Use postal data to refine shipping estimate
                var zone = getShippingZone(destCountry);
                var baseRate = zone.data.baseRate;
                var perKgRate = zone.data.perKg;
                var totalWeight = Math.max(0.5, weightKg);
                
                // Calculate rates for different carriers
                estimatedRates = [
                    {
                        carrier: 'Standard Shipping',
                        service: zone.data.carrier || 'India Post',
                        rate: baseRate + (totalWeight * perKgRate),
                        days: zone.data.days,
                        freeAbove: zone.data.freeAbove
                    },
                    {
                        carrier: 'Express Shipping',
                        service: 'DHL Express',
                        rate: Math.round((baseRate + (totalWeight * perKgRate)) * 1.5),
                        days: reduceDays(zone.data.days),
                        freeAbove: zone.data.freeAbove * 1.5
                    }
                ];
                resolve(estimatedRates);
            })
            .catch(function() {
                // Fallback to zone-based calculation
                var zone = getShippingZone(destCountry);
                var totalWeight = Math.max(0.5, weightKg);
                estimatedRates = [{
                    carrier: 'Standard Shipping',
                    service: zone.data.carrier || 'International Post',
                    rate: zone.data.baseRate + (totalWeight * zone.data.perKg),
                    days: zone.data.days,
                    freeAbove: zone.data.freeAbove
                }];
                resolve(estimatedRates);
            });
    });
}

// Reduce delivery days for express shipping
function reduceDays(daysStr) {
    var match = daysStr.match(/(\d+)-(\d+)/);
    if (match) {
        var min = Math.max(1, Math.floor(parseInt(match[1]) * 0.6));
        var max = Math.max(2, Math.floor(parseInt(match[2]) * 0.6));
        return min + '-' + max + ' business days';
    }
    return daysStr;
}

// Convert price from INR to user currency
function convertPrice(priceINR) {
    var converted = priceINR * userCurrency.rate;
    if (userCurrency.code === 'JPY' || userCurrency.code === 'KRW' || userCurrency.code === 'VND' || userCurrency.code === 'IDR') {
        return Math.round(converted);
    }
    return Math.round(converted * 100) / 100;
}

// Format price with currency symbol
function formatPrice(priceINR) {
    var converted = convertPrice(priceINR);
    var formatted = converted.toLocaleString();
    return userCurrency.symbol + formatted;
}

// Get shipping zone for country
function getShippingZone(countryCode) {
    for (var zone in fallbackShippingZones) {
        if (fallbackShippingZones[zone].countries.indexOf(countryCode) !== -1) {
            return { name: zone, data: fallbackShippingZones[zone] };
        }
    }
    return { name: 'international', data: { baseRate: 2000, perKg: 500, freeAbove: 20000, days: '15-25 business days', carrier: 'International Post' } };
}

// Calculate shipping cost
function calculateShipping(cartTotalINR, countryCode, pincode) {
    var zone = getShippingZone(countryCode || userCountry);
    var zoneData = zone.data;
    
    if (cartTotalINR >= zoneData.freeAbove) {
        return { cost: 0, costINR: 0, isFree: true, days: zoneData.days, zone: zone.name, carrier: zoneData.carrier };
    }
    
    var itemCount = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    var estimatedKg = Math.max(0.5, itemCount * 0.2);
    var shippingINR = zoneData.baseRate + (estimatedKg * zoneData.perKg);
    
    return {
        cost: convertPrice(shippingINR),
        costINR: shippingINR,
        isFree: false,
        days: zoneData.days,
        zone: zone.name,
        freeAbove: zoneData.freeAbove,
        carrier: zoneData.carrier
    };
}

// Google Sheets Configuration
const GOOGLE_SHEET_ID = '1guWacKQNtAzqFiyKWySN6CO_qLDK0wh57b2ALhg5GTY';
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/' + GOOGLE_SHEET_ID + '/gviz/tq?tqx=out:csv';

// Convert Google Drive URL to direct image URL
function getDirectImageUrl(imageUrl) {
    if (!imageUrl) return 'images/placeholder.jpg';
    
    var cleanUrl = imageUrl.trim();
    
    // If not a URL, return as-is (local file)
    if (!cleanUrl.startsWith('http')) {
        return 'images/' + cleanUrl;
    }
    
    // Convert Google Drive sharing URLs to direct image URLs
    if (cleanUrl.includes('drive.google.com')) {
        var fileId = null;
        
        // Extract file ID from various formats
        var patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,      // /file/d/ID/view
            /id=([a-zA-Z0-9_-]+)/,               // ?id=ID or &id=ID
            /\/d\/([a-zA-Z0-9_-]+)/,             // /d/ID
            /open\?id=([a-zA-Z0-9_-]+)/          // open?id=ID
        ];
        
        for (var i = 0; i < patterns.length; i++) {
            var match = cleanUrl.match(patterns[i]);
            if (match) {
                fileId = match[1];
                break;
            }
        }
        
        if (fileId) {
            // Use lh3.googleusercontent.com for reliable image loading
            return 'https://lh3.googleusercontent.com/d/' + fileId + '=w500';
        }
    }
    
    // Return original URL for non-Google Drive URLs
    return cleanUrl;
}

// Load Products from Google Sheets
function loadProductsFromCSV() {
    fetch(GOOGLE_SHEET_URL)
        .then(function(response) {
            if (!response.ok) throw new Error('Could not load Google Sheet');
            return response.text();
        })
        .then(function(csvText) {
            products = parseCSV(csvText);
            renderProducts('all');
            updateCart();
        })
        .catch(function(error) {
            console.error('Error loading products from Google Sheets:', error);
            // Fallback to local CSV
            fetch('products.csv')
                .then(function(response) { return response.text(); })
                .then(function(csvText) {
                    products = parseCSV(csvText);
                    renderProducts('all');
                    updateCart();
                })
                .catch(function(err) {
                    productsGrid.innerHTML = '<div class="loading"><p>Error loading products. Please refresh.</p></div>';
                });
        });
}

// Parse CSV (handles Google Sheets format)
function parseCSV(csvText) {
    var lines = csvText.trim().split('\n');
    var result = [];
    for (var i = 1; i < lines.length; i++) {
        var values = parseCSVLine(lines[i]);
        if (values.length >= 5 && values[0].trim()) {
            // Clean up values (remove extra quotes from Google Sheets)
            var cleanValue = function(val) {
                if (!val) return '';
                return val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            };
            
            var name = cleanValue(values[0]);
            var imageUrl = cleanValue(values[1]);
            var price = parseInt(cleanValue(values[2]), 10) || 0;
            var description = cleanValue(values[3]);
            var category = cleanValue(values[4]).toLowerCase();
            var badge = values[5] ? cleanValue(values[5]) : null;
            
            // Convert to direct image URL
            var directImageUrl = getDirectImageUrl(imageUrl);
            
            if (name && price > 0) {
                result.push({
                    id: i,
                    name: name,
                    image: directImageUrl,
                    price: price,
                    description: description,
                    category: category,
                    badge: badge
                });
            }
        }
    }
    console.log('Loaded ' + result.length + ' products from spreadsheet');
    return result;
}

function parseCSVLine(line) {
    var result = [], current = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim());
    return result;
}

// Setup Event Listeners
function setupEventListeners() {
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    themeToggle.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
    
    cartBtn.onclick = openCart;
    cartClose.onclick = closeCart;
    cartOverlay.onclick = closeCart;
    checkoutBtn.onclick = function() { closeCart(); openCheckout(); };
    checkoutClose.onclick = closeCheckout;
    checkoutModal.onclick = function(e) { if (e.target === checkoutModal) closeCheckout(); };
    
    document.getElementById('contactForm').onsubmit = function(e) {
        e.preventDefault();
        showToast('Message sent!');
        e.target.reset();
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.onclick = function(e) {
            e.preventDefault();
            var target = document.querySelector(a.getAttribute('href'));
            if (target) { target.scrollIntoView({ behavior: 'smooth' }); closeMobileMenu(); }
        };
    });
}

function loadTheme() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
}

// Render Products
function renderProducts(filter) {
    var filtered = filter === 'all' ? products : products.filter(function(p) { return p.category === filter; });
    
    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div class="loading"><p>No products found.</p></div>';
        return;
    }
    
    productsGrid.innerHTML = filtered.map(function(p) {
        return '<div class="product-card"><div class="product-image">' +
            (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
            '<button class="product-wishlist"><svg viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>' +
            '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="handleImageError(this)"></div>' +
            '<div class="product-info"><div class="product-category">' + p.category + '</div>' +
            '<h3 class="product-title">' + p.name + '</h3>' +
            '<p class="product-description">' + p.description + '</p>' +
            '<div class="product-footer"><span class="product-price">' + formatPrice(p.price) + '</span>' +
            '<button class="add-to-cart" onclick="addToCart(' + p.id + ')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div></div></div>';
    }).join('');
}

// Handle image loading errors
function handleImageError(img) {
    var currentSrc = img.src;
    console.log('Image failed to load:', currentSrc);
    
    // Try alternate Google Drive URL format
    if (currentSrc.includes('lh3.googleusercontent.com')) {
        var fileId = currentSrc.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileId) {
            img.src = 'https://drive.google.com/thumbnail?id=' + fileId[1] + '&sz=w500';
            return;
        }
    } else if (currentSrc.includes('drive.google.com/thumbnail')) {
        var fileId = currentSrc.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileId) {
            img.src = 'https://drive.google.com/uc?export=view&id=' + fileId[1];
            return;
        }
    }
    
    // Show placeholder
    img.onerror = null;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect fill="%23C8D9B3" width="300" height="300"/%3E%3Ctext fill="%232D5016" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
}

// Cart Functions
function addToCart(id) {
    var p = products.find(function(x) { return x.id === id; });
    if (!p) return;
    var existing = cart.find(function(x) { return x.id === id; });
    if (existing) existing.quantity++;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    updateCart();
    showToast(p.name + ' added!');
}

function updateCart() {
    var totalItems = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    var totalPriceINR = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPriceINR);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(function(i) {
            return '<div class="cart-item"><div class="cart-item-image"><img src="' + i.image + '" alt="' + i.name + '"></div>' +
                '<div class="cart-item-details"><div class="cart-item-title">' + i.name + '</div>' +
                '<div class="cart-item-price">' + formatPrice(i.price) + '</div>' +
                '<div class="cart-item-qty"><button class="qty-btn" onclick="updateQty(' + i.id + ',-1)">−</button>' +
                '<span>' + i.quantity + '</span><button class="qty-btn" onclick="updateQty(' + i.id + ',1)">+</button></div>' +
                '<button class="cart-item-remove" onclick="removeItem(' + i.id + ')">Remove</button></div></div>';
        }).join('');
        cartFooter.style.display = 'block';
    }
}

function updateQty(id, d) {
    var item = cart.find(function(x) { return x.id === id; });
    if (item) {
        item.quantity += d;
        if (item.quantity <= 0) removeItem(id);
        else updateCart();
    }
}

function removeItem(id) {
    cart = cart.filter(function(x) { return x.id !== id; });
    updateCart();
    showToast('Item removed');
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Checkout
function openCheckout() {
    var totalPriceINR = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    var shipping = calculateShipping(totalPriceINR, userCountry);
    
    var orderItems = cart.map(function(i) {
        return '<div class="order-item"><span>' + i.name + ' × ' + i.quantity + '</span><span>' + formatPrice(i.price * i.quantity) + '</span></div>';
    }).join('');
    
    // Country options
    var countries = [
        ['IN', 'India'], ['US', 'United States'], ['GB', 'United Kingdom'], ['CA', 'Canada'],
        ['AU', 'Australia'], ['DE', 'Germany'], ['FR', 'France'], ['IT', 'Italy'], ['ES', 'Spain'],
        ['NL', 'Netherlands'], ['BE', 'Belgium'], ['AT', 'Austria'], ['CH', 'Switzerland'],
        ['SE', 'Sweden'], ['NO', 'Norway'], ['DK', 'Denmark'], ['FI', 'Finland'], ['IE', 'Ireland'],
        ['PT', 'Portugal'], ['PL', 'Poland'], ['CZ', 'Czech Republic'], ['HU', 'Hungary'],
        ['RO', 'Romania'], ['GR', 'Greece'], ['JP', 'Japan'], ['KR', 'South Korea'], ['CN', 'China'],
        ['SG', 'Singapore'], ['MY', 'Malaysia'], ['TH', 'Thailand'], ['ID', 'Indonesia'],
        ['PH', 'Philippines'], ['VN', 'Vietnam'], ['HK', 'Hong Kong'], ['TW', 'Taiwan'],
        ['AE', 'UAE'], ['SA', 'Saudi Arabia'], ['IL', 'Israel'], ['TR', 'Turkey'],
        ['ZA', 'South Africa'], ['EG', 'Egypt'], ['NG', 'Nigeria'], ['KE', 'Kenya'],
        ['BR', 'Brazil'], ['MX', 'Mexico'], ['AR', 'Argentina'], ['CL', 'Chile'],
        ['NZ', 'New Zealand'], ['BD', 'Bangladesh'], ['PK', 'Pakistan'], ['LK', 'Sri Lanka'], ['NP', 'Nepal'],
        ['RU', 'Russia'], ['UA', 'Ukraine']
    ];
    
    var countryOptions = countries.map(function(c) {
        return '<option value="' + c[0] + '"' + (c[0] === userCountry ? ' selected' : '') + '>' + c[1] + '</option>';
    }).join('');
    
    // Phone country code options
    var phoneCodeOptions = countries.map(function(c) {
        var code = phoneCountryCodes[c[0]] || '+1';
        return '<option value="' + code + '"' + (c[0] === userCountry ? ' selected' : '') + '>' + code + ' (' + c[1] + ')</option>';
    }).join('');
    
    var shippingText = shipping.isFree ? '<span class="free-shipping">FREE</span>' : formatPrice(shipping.costINR);
    var grandTotalINR = totalPriceINR + shipping.costINR;
    
    document.getElementById('checkoutBody').innerHTML = 
        '<form id="checkoutForm">' +
        
        // Direct Contact Message
        '<div class="direct-contact-box">' +
        '<h4>💬 Prefer to Order Directly?</h4>' +
        '<p>Contact us through Email or WhatsApp for personalized assistance, bulk orders, or custom requests.</p>' +
        '<div class="direct-contact-buttons">' +
        '<a href="mailto:' + CONTACT_EMAIL + '?subject=Order%20Inquiry&body=Hi,%20I%20would%20like%20to%20place%20an%20order." class="contact-btn email-btn">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>' +
        'Email Us</a>' +
        '<a href="https://wa.me/' + CONTACT_WHATSAPP.replace('+', '') + '?text=Hi,%20I%20would%20like%20to%20place%20an%20order%20from%20Srushtibandh." target="_blank" class="contact-btn whatsapp-btn">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        'WhatsApp</a>' +
        '</div></div>' +
        
        '<div class="checkout-divider"><span>Or continue with online checkout</span></div>' +
        
        // Customer Information
        '<div class="checkout-section">' +
        '<h4>Customer Information</h4>' +
        '<div class="form-group"><label>Full Name *</label><input type="text" id="custName" placeholder="Enter your full name" required></div>' +
        '<div class="form-group"><label>Email Address *</label><input type="email" id="custEmail" placeholder="your.email@example.com" required></div>' +
        '<div class="form-group"><label>Phone Number *</label>' +
        '<div class="phone-input-group">' +
        '<select id="phoneCode" class="phone-code-select">' + phoneCodeOptions + '</select>' +
        '<input type="tel" id="custPhone" placeholder="Phone number" pattern="[0-9]{6,15}" required>' +
        '</div></div>' +
        '</div>' +
        
        // Shipping Address
        '<div class="checkout-section">' +
        '<h4>Shipping Address</h4>' +
        '<div class="form-group"><label>Street Address *</label><input type="text" id="custAddress" placeholder="House/Flat No., Street, Landmark" required></div>' +
        '<div class="form-group"><label>City *</label><input type="text" id="custCity" placeholder="City" required></div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>State/Province *</label><input type="text" id="custState" placeholder="State" required></div>' +
        '<div class="form-group"><label>ZIP/Postal Code *</label><input type="text" id="custZip" placeholder="Postal Code" required></div>' +
        '</div>' +
        '<div class="form-group"><label>Country *</label><select id="custCountry" required>' + countryOptions + '</select></div>' +
        '</div>' +
        
        // Order Summary
        '<div class="checkout-section">' +
        '<h4>Order Summary</h4>' +
        '<div class="order-summary">' + orderItems +
        '<div class="order-item shipping-row">' +
        '<span>Shipping to <span id="shippingCountryName">' + getCountryName(userCountry) + '</span></span>' +
        '<span id="shippingCost">' + shippingText + '</span></div>' +
        '<div class="shipping-info" id="shippingInfo">' +
        '📦 Estimated: ' + shipping.days + '<br>' +
        '🚚 Carrier: <span id="carrierName">' + shipping.carrier + '</span>' +
        (shipping.isFree ? '' : '<br>🎁 Free shipping above ' + formatPrice(shipping.freeAbove)) +
        '</div>' +
        '<div class="order-total"><span>Total</span><span id="grandTotal">' + formatPrice(grandTotalINR) + '</span></div>' +
        '</div></div>' +
        
        // Payment Method Section
        '<div class="checkout-section">' +
        '<h4>Payment Method</h4>' +
        '<div class="payment-methods">' +
        '<label class="payment-option">' +
        '<input type="radio" name="paymentMethod" value="card" checked>' +
        '<div class="payment-option-content">' +
        '<div class="payment-option-header">' +
        '<span class="payment-icon">💳</span>' +
        '<span class="payment-name">Credit / Debit Card</span>' +
        '</div>' +
        '<span class="payment-desc">Visa, Mastercard, RuPay, American Express</span>' +
        '</div>' +
        '</label>' +
        '<label class="payment-option">' +
        '<input type="radio" name="paymentMethod" value="upi">' +
        '<div class="payment-option-content">' +
        '<div class="payment-option-header">' +
        '<span class="payment-icon">📱</span>' +
        '<span class="payment-name">UPI</span>' +
        '<span class="payment-badge">Popular in India</span>' +
        '</div>' +
        '<span class="payment-desc">Pay using Google Pay, PhonePe, Paytm, or any UPI app</span>' +
        '</div>' +
        '</label>' +
        '</div>' +
        
        // Card Payment Details (shown by default now)
        '<div class="payment-details" id="cardDetails">' +
        '<div class="form-group">' +
        '<label>Card Number *</label>' +
        '<input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group">' +
        '<label>Expiry Date *</label>' +
        '<input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>CVV *</label>' +
        '<input type="password" id="cardCvv" placeholder="•••" maxlength="4" required>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Name on Card *</label>' +
        '<input type="text" id="cardName" placeholder="As printed on card" required>' +
        '</div>' +
        '<div class="card-icons">' +
        '<span class="card-icon" title="Visa">VISA</span>' +
        '<span class="card-icon" title="Mastercard">MC</span>' +
        '<span class="card-icon" title="RuPay">RuPay</span>' +
        '<span class="card-icon" title="Amex">AMEX</span>' +
        '</div>' +
        '</div>' +
        
        // UPI Payment Details (hidden by default now)
        '<div class="payment-details" id="upiDetails" style="display:none;">' +
        '<div class="upi-payment-info">' +
        '<div class="upi-merchant">' +
        '<p class="merchant-label">Pay to:</p>' +
        '<p class="merchant-name">VENU SHILPI AUDYOGIK</p>' +
        '<p class="merchant-upi"><strong>UPI ID:</strong> VASS@mahb</p>' +
        '<p class="merchant-bank">Bank of Maharashtra</p>' +
        '</div>' +
        '<div class="upi-amount-display">' +
        '<p>Amount to Pay:</p>' +
        '<p class="upi-total" id="upiTotalAmount">₹' + grandTotalINR.toLocaleString('en-IN') + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Your UPI ID *</label>' +
        '<input type="text" id="upiId" placeholder="yourname@upi / mobile@paytm" pattern="[a-zA-Z0-9.\\-_]+@[a-zA-Z]+">' +
        '<p class="upi-hint">We will send a payment request to this UPI ID</p>' +
        '</div>' +
        '<div class="upi-apps mobile-only">' +
        '<span>Or pay directly using:</span>' +
        '<div class="upi-app-icons">' +
        '<button type="button" class="upi-app-btn gpay-btn" data-app="gpay" title="Google Pay">' +
        '<span class="app-icon">G</span>GPay</button>' +
        '<button type="button" class="upi-app-btn phonepe-btn" data-app="phonepe" title="PhonePe">' +
        '<span class="app-icon">℗</span>PhonePe</button>' +
        '<button type="button" class="upi-app-btn paytm-btn" data-app="paytm" title="Paytm">' +
        '<span class="app-icon">₱</span>Paytm</button>' +
        '<button type="button" class="upi-app-btn bhim-btn" data-app="bhim" title="BHIM">' +
        '<span class="app-icon">B</span>BHIM</button>' +
        '<button type="button" class="upi-app-btn amazonpay-btn" data-app="amazonpay" title="Amazon Pay">' +
        '<span class="app-icon">a</span>Amazon Pay</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        
        '<div class="shipping-origin">📍 Ships from: Lawada, Duni, Dharani, Amravati, India - 444702</div>' +
        '<div class="secure-payment"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Secure Payment - 256-bit SSL Encryption</div>' +
        '<button type="submit" class="place-order-btn" id="placeOrderBtn">Pay ' + formatPrice(grandTotalINR) + '</button>' +
        '</form>';
    
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('checkoutForm').onsubmit = handleCheckout;
    document.getElementById('custCountry').onchange = updateShippingOnCountryChange;
    document.getElementById('custZip').onblur = updateShippingWithPincode;
    
    // Payment method toggle
    var paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            togglePaymentDetails(this.value);
        });
    });
    
    // UPI app buttons (mobile only)
    var upiAppBtns = document.querySelectorAll('.upi-app-btn');
    upiAppBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            handleUpiAppClick(this.dataset.app);
        });
    });
    
    // Card number formatting
    var cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            var value = this.value.replace(/\s/g, '').replace(/\D/g, '');
            var formatted = value.match(/.{1,4}/g);
            this.value = formatted ? formatted.join(' ') : '';
        });
    }
    
    // Expiry date formatting
    var cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            var value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                this.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                this.value = value;
            }
        });
    }
}

// Toggle payment details visibility
function togglePaymentDetails(method) {
    var upiDetails = document.getElementById('upiDetails');
    var cardDetails = document.getElementById('cardDetails');
    
    if (method === 'upi') {
        upiDetails.style.display = 'block';
        cardDetails.style.display = 'none';
        document.getElementById('upiId').setAttribute('required', '');
        document.getElementById('cardNumber').removeAttribute('required');
        document.getElementById('cardExpiry').removeAttribute('required');
        document.getElementById('cardCvv').removeAttribute('required');
        document.getElementById('cardName').removeAttribute('required');
    } else {
        upiDetails.style.display = 'none';
        cardDetails.style.display = 'block';
        document.getElementById('upiId').removeAttribute('required');
        document.getElementById('cardNumber').setAttribute('required', '');
        document.getElementById('cardExpiry').setAttribute('required', '');
        document.getElementById('cardCvv').setAttribute('required', '');
        document.getElementById('cardName').setAttribute('required', '');
    }
}

// Handle UPI app button click (mobile only)
function handleUpiAppClick(app) {
    var totalPriceINR = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    var shipping = calculateShipping(totalPriceINR, userCountry);
    var grandTotal = totalPriceINR + shipping.costINR;
    
    // UPI payment link format
    var upiId = 'VASS@mahb';
    var merchantName = 'VENU SHILPI AUDYOGIK';
    var transactionNote = 'Order from Srushtibandh';
    
    var upiUrl = 'upi://pay?pa=' + upiId + 
                 '&pn=' + encodeURIComponent(merchantName) + 
                 '&am=' + grandTotal + 
                 '&cu=INR' + 
                 '&tn=' + encodeURIComponent(transactionNote);
    
    // App-specific deep links
    var appUrls = {
        'gpay': 'tez://upi/pay?pa=' + upiId + '&pn=' + encodeURIComponent(merchantName) + '&am=' + grandTotal + '&cu=INR&tn=' + encodeURIComponent(transactionNote),
        'phonepe': 'phonepe://pay?pa=' + upiId + '&pn=' + encodeURIComponent(merchantName) + '&am=' + grandTotal + '&cu=INR&tn=' + encodeURIComponent(transactionNote),
        'paytm': 'paytmmp://pay?pa=' + upiId + '&pn=' + encodeURIComponent(merchantName) + '&am=' + grandTotal + '&cu=INR&tn=' + encodeURIComponent(transactionNote),
        'bhim': upiUrl,
        'amazonpay': upiUrl  // Amazon Pay uses standard UPI protocol
    };
    
    // Try to open the app
    window.location.href = appUrls[app] || upiUrl;

    // Show toast
    var appNames = {
        'gpay': 'Google Pay',
        'phonepe': 'PhonePe',
        'paytm': 'Paytm',
        'bhim': 'BHIM',
        'amazonpay': 'Amazon Pay'
    };
    showToast('Opening ' + (appNames[app] || app) + '...');
}

function getCountryName(code) {
    var names = {
        'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada',
        'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain',
        'NL': 'Netherlands', 'JP': 'Japan', 'CN': 'China', 'SG': 'Singapore', 'AE': 'UAE',
        'BD': 'Bangladesh', 'PK': 'Pakistan', 'LK': 'Sri Lanka', 'NP': 'Nepal',
        'BE': 'Belgium', 'AT': 'Austria', 'CH': 'Switzerland', 'SE': 'Sweden',
        'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'IE': 'Ireland', 'PT': 'Portugal',
        'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania', 'GR': 'Greece',
        'KR': 'South Korea', 'MY': 'Malaysia', 'TH': 'Thailand', 'ID': 'Indonesia',
        'PH': 'Philippines', 'VN': 'Vietnam', 'HK': 'Hong Kong', 'TW': 'Taiwan',
        'SA': 'Saudi Arabia', 'IL': 'Israel', 'TR': 'Turkey', 'ZA': 'South Africa',
        'EG': 'Egypt', 'NG': 'Nigeria', 'KE': 'Kenya', 'BR': 'Brazil', 'MX': 'Mexico',
        'AR': 'Argentina', 'CL': 'Chile', 'NZ': 'New Zealand', 'RU': 'Russia', 'UA': 'Ukraine'
    };
    return names[code] || code;
}

function updateShippingOnCountryChange() {
    var country = document.getElementById('custCountry').value;
    var totalPriceINR = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    
    // Update phone code when country changes
    var phoneCode = phoneCountryCodes[country] || '+1';
    document.getElementById('phoneCode').value = phoneCode;
    
    // Show loading
    document.getElementById('shippingCost').innerHTML = '<span class="loading-shipping">Calculating...</span>';
    
    // Fetch dynamic shipping rates
    var itemCount = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    var weightKg = Math.max(0.5, itemCount * 0.2);
    var pincode = document.getElementById('custZip').value || '';
    
    fetchShippingRates(country, pincode, weightKg).then(function(rates) {
        var shipping = calculateShipping(totalPriceINR, country);
        if (rates && rates.length > 0) {
            shipping.carrier = rates[0].service;
            shipping.days = rates[0].days;
        }
        
        var shippingText = shipping.isFree ? '<span class="free-shipping">FREE</span>' : formatPrice(shipping.costINR);
        var grandTotalINR = totalPriceINR + shipping.costINR;
        
        document.getElementById('shippingCost').innerHTML = shippingText;
        document.getElementById('shippingCountryName').textContent = getCountryName(country);
        document.getElementById('shippingInfo').innerHTML = '📦 Estimated: ' + shipping.days + '<br>🚚 Carrier: <span id="carrierName">' + shipping.carrier + '</span>' + (shipping.isFree ? '' : '<br>🎁 Free shipping above ' + formatPrice(shipping.freeAbove));
        document.getElementById('grandTotal').textContent = formatPrice(grandTotalINR);
        document.getElementById('placeOrderBtn').textContent = 'Pay ' + formatPrice(grandTotalINR);
    });
}

function updateShippingWithPincode() {
    var pincode = document.getElementById('custZip').value;
    if (pincode && pincode.length >= 4) {
        updateShippingOnCountryChange();
    }
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleCheckout(e) {
    e.preventDefault();
    
    var name = document.getElementById('custName').value;
    var email = document.getElementById('custEmail').value;
    var phoneCode = document.getElementById('phoneCode').value;
    var phone = document.getElementById('custPhone').value;
    var address = document.getElementById('custAddress').value;
    var city = document.getElementById('custCity').value;
    var state = document.getElementById('custState').value;
    var zip = document.getElementById('custZip').value;
    var country = document.getElementById('custCountry').value;
    
    // Get payment method
    var paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    var paymentInfo = '';
    
    if (paymentMethod === 'upi') {
        var upiId = document.getElementById('upiId').value;
        if (!upiId) {
            showToast('Please enter your UPI ID');
            return;
        }
        paymentInfo = 'UPI: ' + upiId;
    } else {
        var cardNumber = document.getElementById('cardNumber').value;
        var cardExpiry = document.getElementById('cardExpiry').value;
        var cardCvv = document.getElementById('cardCvv').value;
        var cardName = document.getElementById('cardName').value;

        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            showToast('Please fill all card details');
            return;
        }

        // Remove spaces and get last 4 digits
        var cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanCardNumber.length < 4) {
            showToast('Invalid card number');
            return;
        }
        paymentInfo = 'Card ending in ' + cleanCardNumber.slice(-4);
    }
    
    var fullPhone = phoneCode + ' ' + phone;
    
    var btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Processing Payment...';
    
    setTimeout(function() {
        var orderNum = 'SBK' + Date.now().toString().slice(-6);
        var totalPriceINR = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
        var shipping = calculateShipping(totalPriceINR, country);
        var grandTotalINR = totalPriceINR + shipping.costINR;
        
        document.getElementById('checkoutBody').innerHTML = 
            '<div class="success-message">' +
            '<div class="success-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' +
            '<h3>Payment Successful!</h3>' +
            '<p>Thank you for supporting Melghat artisans, ' + name.split(' ')[0] + '!</p>' +
            '<div class="order-confirmation">' +
            '<p><strong>Order #' + orderNum + '</strong></p>' +
            '<p>💰 Amount Paid: ' + formatPrice(grandTotalINR) + '</p>' +
            '<p>💳 Payment Method: ' + paymentInfo + '</p>' +
            '<p>📧 Confirmation sent to: ' + email + '</p>' +
            '<p>📱 Phone: ' + fullPhone + '</p>' +
            '<p>📦 Shipping to:<br>' + address + '<br>' + city + ', ' + state + ' ' + zip + '<br>' + getCountryName(country) + '</p>' +
            '</div>' +
            '<div class="post-order-contact">' +
            '<p>Questions about your order? Contact us:</p>' +
            '<a href="mailto:' + CONTACT_EMAIL + '" class="contact-link">📧 ' + CONTACT_EMAIL + '</a>' +
            '<a href="https://wa.me/' + CONTACT_WHATSAPP.replace('+', '') + '" target="_blank" class="contact-link">💬 WhatsApp: ' + CONTACT_WHATSAPP + '</a>' +
            '</div>' +
            '<button class="btn btn-primary" onclick="closeCheckout(); cart=[]; updateCart();">Continue Shopping</button>' +
            '</div>';
    }, 2500);
}

function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}
