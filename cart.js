// Cart Page Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    setupProfileButton();
});

function setupProfileButton() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const textSpan = profileBtn.querySelector('span');
            if (textSpan) {
                textSpan.textContent = user.name || user.email;
            }
        }
        
        profileBtn.addEventListener('click', () => {
            if (user) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

function displayCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Ваша корзина пуста</h2>
                <p style="margin: 20px 0; color: #666;">Добавьте товары, чтобы продолжить покупки</p>
                <a href="index.html" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 300px;">
                    Перейти к покупкам
                </a>
            </div>
        `;
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartContent.innerHTML = `
        <div class="cart-content">
            <div class="cart-items">
                <h2 style="margin-bottom: 20px;">Товары (${totalItems})</h2>
                ${cart.map((item, index) => createCartItem(item, index)).join('')}
            </div>
            
            <div class="cart-summary">
                <h2 style="margin-bottom: 20px;">Итого</h2>
                <div class="summary-row">
                    <span>Товары (${totalItems})</span>
                    <span>${totalPrice} ₸</span>
                </div>
                <div class="summary-row">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                </div>
                <div class="summary-row summary-total">
                    <span>Итого</span>
                    <span>${totalPrice} ₸</span>
                </div>
                <button class="checkout-btn" onclick="goToCheckout()">
                    Перейти к оформлению
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    setupCartEventListeners();
}

function createCartItem(item, index) {
    return `
        <div class="cart-item" data-index="${index}">
            <div class="item-image">${item.image}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price">${item.price} ₸</div>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-index="${index}">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                </div>
                <button class="remove-btn" data-index="${index}">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `;
}

function setupCartEventListeners() {
    // Increase quantity
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            increaseQuantity(index);
        });
    });
    
    // Decrease quantity
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            decreaseQuantity(index);
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            removeItem(index);
        });
    });
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    displayCart();
    showAlert('Количество товара увеличено', 'success');
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        displayCart();
        showAlert('Количество товара уменьшено', 'success');
    } else {
        removeItem(index);
    }
}

function removeItem(index) {
    const itemName = cart[index].name;
    
    if (confirm(`Удалить "${itemName}" из корзины?`)) {
        cart.splice(index, 1);
        saveCart();
        displayCart();
        showAlert('Товар удален из корзины', 'success');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function goToCheckout() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        showAlert('Пожалуйста, войдите в аккаунт для оформления заказа', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    window.location.href = 'checkout.html';
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}