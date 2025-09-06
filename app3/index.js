let currentUser = null;
let currentOrder = null;

// DOM Elements
let loginSection, appSection, alertContainer;
let availableBtn, myOrdersBtn, logoutBtn;
let availableSection, orderDetailSection, myOrdersSection;

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
    availableBtn = document.getElementById('availableBtn');
    myOrdersBtn = document.getElementById('myOrdersBtn');
    logoutBtn = document.getElementById('logoutBtn');
    
    // Sections
    availableSection = document.getElementById('availableSection');
    orderDetailSection = document.getElementById('orderDetailSection');
    myOrdersSection = document.getElementById('myOrdersSection');
    
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
    if (availableBtn) {
        availableBtn.addEventListener('click', () => showSection('available'));
    }
    if (myOrdersBtn) {
        myOrdersBtn.addEventListener('click', () => showSection('myOrders'));
    }
    
    // Back button
    const backToAvailableBtn = document.getElementById('backToAvailableBtn');
    if (backToAvailableBtn) {
        backToAvailableBtn.addEventListener('click', () => showSection('available'));
    }
    
    // Accept order button
    const acceptOrderBtn = document.getElementById('acceptOrderBtn');
    if (acceptOrderBtn) {
        acceptOrderBtn.addEventListener('click', acceptOrder);
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            showApp();
            loadAvailableOrders();
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
            loadAvailableOrders();
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
    const sections = [availableSection, orderDetailSection, myOrdersSection];
    sections.forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // Remove active class from all nav buttons
    const navButtons = [availableBtn, myOrdersBtn];
    navButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Show selected section
    switch(section) {
        case 'available':
            if (availableSection) availableSection.classList.remove('hidden');
            if (availableBtn) availableBtn.classList.add('active');
            loadAvailableOrders();
            break;
        case 'myOrders':
            if (myOrdersSection) myOrdersSection.classList.remove('hidden');
            if (myOrdersBtn) myOrdersBtn.classList.add('active');
            loadMyOrders();
            break;
    }
}

// Load available orders
async function loadAvailableOrders() {
    try {
        const response = await fetch('/api/delivery/orders', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const orders = await response.json();
        
        const ordersList = document.getElementById('availableOrdersList');
        if (ordersList) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order-item">
                    <h4>Orden #${order.id}</h4>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
                    <p><strong>Dirección:</strong> ${order.address}</p>
                    <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    <button class="btn" onclick="viewOrderDetail(${order.id})">Ver Detalles</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading available orders:', error);
        showAlert('Error al cargar órdenes disponibles', 'error');
    }
}

// View order detail
async function viewOrderDetail(orderId) {
    try {
        const response = await fetch(`/api/delivery/orders/${orderId}`, {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const order = await response.json();
        
        currentOrder = order;
        
        const orderDetail = document.getElementById('orderDetail');
        if (orderDetail) {
            orderDetail.innerHTML = `
                <h3>Orden #${order.id}</h3>
                <p><strong>Tienda:</strong> ${order.storeName}</p>
                <p><strong>Dirección de la Tienda:</strong> ${order.storeAddress}</p>
                <p><strong>Total:</strong> $${order.total}</p>
                <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
                <p><strong>Dirección de Entrega:</strong> ${order.address}</p>
                <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <div style="margin-top: 15px;">
                    <strong>Productos:</strong>
                    <ul>
                        ${order.items.map(item => `<li>${item.quantity}x ${item.productName} - $${item.price} c/u</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (availableSection) availableSection.classList.add('hidden');
        if (orderDetailSection) orderDetailSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading order detail:', error);
        showAlert('Error al cargar detalles de la orden', 'error');
    }
}

// Accept order
async function acceptOrder() {
    if (!currentOrder) return;
    
    try {
        const response = await fetch(`/api/delivery/orders/${currentOrder.id}/accept`, {
            method: 'POST',
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Orden aceptada exitosamente', 'success');
            showSection('available');
        } else {
            showAlert(data.error || 'Error al aceptar orden', 'error');
        }
    } catch (error) {
        console.error('Error accepting order:', error);
        showAlert('Error al aceptar orden', 'error');
    }
}

// Load my orders
async function loadMyOrders() {
    try {
        const response = await fetch('/api/delivery/my-orders', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const deliveryOrders = await response.json();
        
        const ordersList = document.getElementById('myOrdersList');
        if (ordersList) {
            ordersList.innerHTML = deliveryOrders.map(deliveryOrder => {
                const order = deliveryOrder.order;
                return `
                    <div class="order-item">
                        <h4>Orden #${order.id}</h4>
                        <p><strong>Total:</strong> $${order.total}</p>
                        <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
                        <p><strong>Dirección:</strong> ${order.address}</p>
                        <p><strong>Estado:</strong> <span class="status ${deliveryOrder.status}">${deliveryOrder.status}</span></p>
                        <p><strong>Aceptada:</strong> ${new Date(deliveryOrder.acceptedAt).toLocaleString()}</p>
                        ${deliveryOrder.completedAt ? `<p><strong>Completada:</strong> ${new Date(deliveryOrder.completedAt).toLocaleString()}</p>` : ''}
                        <div style="margin-top: 10px;">
                            <strong>Productos:</strong>
                            <ul>
                                ${order.items.map(item => `<li>${item.quantity}x ${item.productName || 'Producto'} - $${item.price}</li>`).join('')}
                            </ul>
                        </div>
                        ${deliveryOrder.status === 'in_progress' ? 
                            `<button class="btn btn-success" onclick="completeOrder(${order.id})" style="margin-top: 10px;">Marcar como Entregada</button>` : 
                            ''
                        }
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading my orders:', error);
        showAlert('Error al cargar mis órdenes', 'error');
    }
}

// Complete order
async function completeOrder(orderId) {
    try {
        const response = await fetch(`/api/delivery/orders/${orderId}/complete`, {
            method: 'PUT',
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Orden marcada como entregada', 'success');
            loadMyOrders();
        } else {
            showAlert(data.error || 'Error al completar orden', 'error');
        }
    } catch (error) {
        console.error('Error completing order:', error);
        showAlert('Error al completar orden', 'error');
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
window.viewOrderDetail = viewOrderDetail;
window.completeOrder = completeOrder;