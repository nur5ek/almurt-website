// Checkout Page Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showAlert('Пожалуйста, войдите в аккаунт', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        showAlert('Ваша корзина пуста', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    displayOrderSummary();
    setupForm();
});

function displayOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const totalPrice = document.getElementById('totalPrice');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <div class="summary-item-image">${item.image}</div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-quantity">${item.quantity} шт × ${item.price} ₸</div>
                </div>
            </div>
            <div style="font-weight: 600;">${item.price * item.quantity} ₸</div>
        </div>
    `).join('');
    
    totalPrice.textContent = `${total} ₸`;
}

function setupForm() {
    const form = document.getElementById('checkoutForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVVInput = document.getElementById('cardCVV');
    
    // Format card number
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value;
    });
    
    // Format expiry date
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Format CVV
    cardCVVInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
    
    // Handle form submission
    form.addEventListener('submit', handleCheckout);
}

function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Validate delivery address
    const city = formData.get('city').trim();
    const address = formData.get('address').trim();
    
    if (city.length < 2) {
        showAlert('Введите корректный город', 'error');
        return;
    }
    
    if (address.length < 5) {
        showAlert('Введите корректный адрес', 'error');
        return;
    }
    
    // Validate card
    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
    const cardExpiry = formData.get('cardExpiry');
    const cardCVV = formData.get('cardCVV');
    const cardHolder = formData.get('cardHolder').trim();
    
    if (cardNumber.length !== 16) {
        showAlert('Неверный номер карты (должно быть 16 цифр)', 'error');
        return;
    }
    
    if (!validateExpiry(cardExpiry)) {
        showAlert('Неверный срок действия карты', 'error');
        return;
    }
    
    if (cardCVV.length !== 3) {
        showAlert('Неверный CVV код (должно быть 3 цифры)', 'error');
        return;
    }
    
    if (cardHolder.length < 3) {
        showAlert('Введите имя держателя карты', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryAddress: {
            city: city,
            address: address,
            apartment: formData.get('apartment'),
            entrance: formData.get('entrance'),
            floor: formData.get('floor'),
            intercom: formData.get('intercom'),
            comment: formData.get('comment')
        },
        status: 'processing'
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    showAlert('Заказ успешно оформлен!', 'success');
    
    setTimeout(() => {
        window.location.href = 'order-success.html?orderId=' + order.id;
    }, 1500);
}

function validateExpiry(expiry) {
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
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