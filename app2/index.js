let currentUser = null;

// DOM Elements
let loginSection, appSection, alertContainer;
let infoBtn, productsBtn, ordersBtn, logoutBtn;
let infoSection, productsSection, ordersSection;

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
    infoBtn = document.getElementById('infoBtn');
    productsBtn = document.getElementById('productsBtn');
    ordersBtn = document.getElementById('ordersBtn');
    logoutBtn = document.getElementById('logoutBtn');
    
    // Sections
    infoSection = document.getElementById('infoSection');
    productsSection = document.getElementById('productsSection');
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
    if (infoBtn) {
        infoBtn.addEventListener('click', () => showSection('info'));
    }
    if (productsBtn) {
        productsBtn.addEventListener('click', () => showSection('products'));
    }
    if (ordersBtn) {
        ordersBtn.addEventListener('click', () => showSection('orders'));
    }
    
    // Store toggle
    const toggleStoreBtn = document.getElementById('toggleStoreBtn');
    if (toggleStoreBtn) {
        toggleStoreBtn.addEventListener('click', toggleStore);
    }
    
    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            showApp();
            loadStoreInfo();
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
            loadStoreInfo();
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
    const sections = [infoSection, productsSection, ordersSection];
    sections.forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // Remove active class from all nav buttons
    const navButtons = [infoBtn, productsBtn, ordersBtn];
    navButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Show selected section
    switch(section) {
        case 'info':
            if (infoSection) infoSection.classList.remove('hidden');
            if (infoBtn) infoBtn.classList.add('active');
            loadStoreInfo();
            break;
        case 'products':
            if (productsSection) productsSection.classList.remove('hidden');
            if (productsBtn) productsBtn.classList.add('active');
            loadProducts();
            break;
        case 'orders':
            if (ordersSection) ordersSection.classList.remove('hidden');
            if (ordersBtn) ordersBtn.classList.add('active');
            loadOrders();
            break;
    }
}

// Load store info
async function loadStoreInfo() {
    try {
        const response = await fetch('/api/store/info', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const store = await response.json();
        
        const storeInfo = document.getElementById('storeInfo');
        const toggleBtn = document.getElementById('toggleStoreBtn');
        
        if (storeInfo) {
            storeInfo.innerHTML = `
                <h3>${store.name}</h3>
                <p><strong>Dirección:</strong> ${store.address}</p>
                <p><strong>Estado:</strong> <span class="store-status ${store.isOpen ? 'open' : 'closed'}">${store.isOpen ? 'Abierta' : 'Cerrada'}</span></p>
            `;
        }
        
        if (toggleBtn) {
            toggleBtn.textContent = store.isOpen ? 'Cerrar Tienda' : 'Abrir Tienda';
            toggleBtn.className = store.isOpen ? 'btn btn-danger' : 'btn btn-success';
        }
    } catch (error) {
        console.error('Error loading store info:', error);
        showAlert('Error al cargar información de la tienda', 'error');
    }
}

// Toggle store status
async function toggleStore() {
    try {
        const response = await fetch('/api/store/toggle', {
            method: 'PUT',
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert(data.message, 'success');
            loadStoreInfo();
        } else {
            showAlert(data.error || 'Error al cambiar estado', 'error');
        }
    } catch (error) {
        console.error('Error toggling store:', error);
        showAlert('Error al cambiar estado de la tienda', 'error');
    }
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch('/api/store/products', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
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
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error al cargar productos', 'error');
    }
}

// Add product
async function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value;
    
    if (!name || !price || !description || !stock) {
        showAlert('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/store/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ name, price, description, stock, image })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto agregado exitosamente', 'success');
            const form = document.getElementById('productForm');
            if (form) form.reset();
            loadProducts();
        } else {
            showAlert(data.error || 'Error al agregar producto', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('Error al agregar producto', 'error');
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('/api/store/orders', {
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
                    <div style="margin-top: 10px;">
                        <strong>Productos:</strong>
                        <ul>
                            ${order.items.map(item => `<li>${item.quantity}x ${item.productName || 'Producto'} - $${item.price}</li>`).join('')}
                        </ul>
                    </div>
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