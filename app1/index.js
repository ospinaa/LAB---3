let currentUser = null;
let currentStore = null;
let cart = { items: [] };

// DOM Elements
let loginSection, appSection, alertContainer;
let storesBtn, cartBtn, ordersBtn, logoutBtn;
let storesSection, storeProductsSection, cartSection, checkoutSection, ordersSection;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    loginSection = document.getElementById('loginSection');
    appSection = document.getElementById('appSection');
    alertContainer = document.getElementById('alertContainer');
    
    // Navigation
    storesBtn = document.getElementById('storesBtn');
    cartBtn = document.getElementById('cartBtn');
    ordersBtn = document.getElementById('ordersBtn');
    logoutBtn = document.getElementById('logoutBtn');
    
    // Sections
    storesSection = document.getElementById('storesSection');
    storeProductsSection = document.getElementById('storeProductsSection');
    cartSection = document.getElementById('cartSection');
    checkoutSection = document.getElementById('checkoutSection');
    ordersSection = document.getElementById('ordersSection');
    
    // Setup event listeners
    setupEventListeners();
    
    // Check if user is logged in
    checkLoginStatus();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation buttons
    if (storesBtn) {
        storesBtn.addEventListener('click', () => showSection('stores'));
    }
    if (cartBtn) {
        cartBtn.addEventListener('click', () => showSection('cart'));
    }
    if (ordersBtn) {
        ordersBtn.addEventListener('click', () => showSection('orders'));
    }
    
    // Back buttons
    const backToStoresBtn = document.getElementById('backToStoresBtn');
    if (backToStoresBtn) {
        backToStoresBtn.addEventListener('click', () => showSection('stores'));
    }
    
    const backToCartBtn = document.getElementById('backToCartBtn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', () => showSection('cart'));
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => showSection('checkout'));
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            showApp();
            loadStores();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}

function showApp() {
    if (loginSection) loginSection.classList.add('hidden');
    if (appSection) appSection.classList.remove('hidden');
}

function showLogin() {
    if (loginSection) loginSection.classList.remove('hidden');
    if (appSection) appSection.classList.add('hidden');
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showAlert('Login exitoso', 'success');
            showApp();
            loadStores();
        } else {
            showAlert(data.error || 'Error en el login', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// Logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showLogin();
}

// Show section
function showSection(section) {
    // Hide all sections
    const sections = [storesSection, storeProductsSection, cartSection, checkoutSection, ordersSection];
    sections.forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // Remove active class from all nav buttons
    const navButtons = [storesBtn, cartBtn, ordersBtn];
    navButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Show selected section
    switch(section) {
        case 'stores':
            if (storesSection) storesSection.classList.remove('hidden');
            if (storesBtn) storesBtn.classList.add('active');
            break;
        case 'cart':
            if (cartSection) cartSection.classList.remove('hidden');
            if (cartBtn) cartBtn.classList.add('active');
            loadCart();
            break;
        case 'orders':
            if (ordersSection) ordersSection.classList.remove('hidden');
            if (ordersBtn) ordersBtn.classList.add('active');
            loadOrders();
            break;
    }
}

// Load stores
async function loadStores() {
    try {
        const response = await fetch('/api/consumer/stores');
        const stores = await response.json();
        
        const storesList = document.getElementById('storesList');
        if (storesList) {
            storesList.innerHTML = stores.map(store => `
                <div class="card">
                    <h3>${store.name}</h3>
                    <p><strong>Dirección:</strong> ${store.address}</p>
                    <p><strong>Estado:</strong> <span class="status ${store.isOpen ? 'accepted' : 'pending'}">${store.isOpen ? 'Abierta' : 'Cerrada'}</span></p>
                    <button class="btn" onclick="viewStoreProducts(${store.id}, '${store.name}')" ${!store.isOpen ? 'disabled' : ''}>
                        ${store.isOpen ? 'Ver Productos' : 'Tienda Cerrada'}
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading stores:', error);
        showAlert('Error al cargar tiendas', 'error');
    }
}

// View store products
async function viewStoreProducts(storeId, storeName) {
    currentStore = storeId;
    const storeNameElement = document.getElementById('storeName');
    if (storeNameElement) {
        storeNameElement.textContent = `Productos de ${storeName}`;
    }
    
    try {
        const response = await fetch(`/api/consumer/stores/${storeId}/products`);
        const products = await response.json();
        
        const productsList = document.getElementById('productsList');
        if (productsList) {
            productsList.innerHTML = products.map(product => `
                <div class="card">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p><strong>Precio:</strong> $${product.price}</p>
                    <p><strong>Stock:</strong> ${product.stock}</p>
                    <div style="margin-top: 10px;">
                        <input type="number" id="qty-${product.id}" min="1" max="${product.stock}" value="1" style="width: 60px; margin-right: 10px;">
                        <button class="btn" onclick="addToCart(${product.id}, ${product.price})">Agregar al Carrito</button>
                    </div>
                </div>
            `).join('');
        }
        
        if (storesSection) storesSection.classList.add('hidden');
        if (storeProductsSection) storeProductsSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error al cargar productos', 'error');
    }
}

// Add to cart
async function addToCart(productId, price) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    if (!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    
    try {
        const response = await fetch('/api/consumer/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto agregado al carrito', 'success');
            loadCart();
        } else {
            showAlert(data.error || 'Error al agregar producto', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showAlert('Error al agregar al carrito', 'error');
    }
}

// Load cart
async function loadCart() {
    try {
        const response = await fetch('/api/consumer/cart', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const data = await response.json();
        
        cart = data;
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (cartItems) {
            if (cart.items.length === 0) {
                cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
            } else {
                cartItems.innerHTML = cart.items.map(item => `
                    <div class="cart-item">
                        <div style="display: flex; align-items: center;">
                            <img src="${item.productImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                            <div>
                                <h4>${item.productName}</h4>
                                <p>${item.productDescription}</p>
                                <p>Cantidad: ${item.quantity} x $${item.price}</p>
                            </div>
                        </div>
                        <div>
                            <strong>$${(item.quantity * item.price).toFixed(2)}</strong>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
        
        if (checkoutBtn) {
            checkoutBtn.style.display = cart.items.length > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showAlert('Error al cargar carrito', 'error');
    }
}

// Checkout
function showCheckout() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.items.map(item => `
            <div class="cart-item">
                <div style="display: flex; align-items: center;">
                    <img src="${item.productImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop'}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div>
                        <h4>${item.productName}</h4>
                        <p>Cantidad: ${item.quantity} x $${item.price}</p>
                    </div>
                </div>
                <div>
                    <strong>$${(item.quantity * item.price).toFixed(2)}</strong>
                </div>
            </div>
        `).join('');
    }
    
    if (checkoutTotal) {
        const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        checkoutTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
    
    if (cartSection) cartSection.classList.add('hidden');
    if (checkoutSection) checkoutSection.classList.remove('hidden');
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    const address = document.getElementById('address').value;
    
    if (!paymentMethod || !address) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/consumer/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                storeId: currentStore,
                paymentMethod,
                address
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Orden creada exitosamente', 'success');
            showSection('orders');
        } else {
            showAlert(data.error || 'Error al crear orden', 'error');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showAlert('Error al crear orden', 'error');
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('/api/consumer/orders', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const orders = await response.json();
        
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order-item">
                    <h4>Orden #${order.id}</h4>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
                    <p><strong>Dirección:</strong> ${order.address}</p>
                    <p><strong>Estado:</strong> <span class="status ${order.status}">${order.status}</span></p>
                    <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showAlert('Error al cargar órdenes', 'error');
    }
}

// Show alert
function showAlert(message, type) {
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Make functions global for onclick handlers
window.viewStoreProducts = viewStoreProducts;
window.addToCart = addToCart;