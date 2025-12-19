// Profile Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        showAlert('Пожалуйста, войдите в аккаунт', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    displayUserInfo(user);
    displayOrders();
});

function displayUserInfo(user) {
    document.getElementById('userName').textContent = user.name || 'Пользователь';
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone;
}

function displayOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">📦</div>
                <h3>У вас пока нет заказов</h3>
                <p style="margin: 20px 0; color: #666;">Начните покупки прямо сейчас!</p>
                <a href="index.html" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 300px;">
                    Перейти к покупкам
                </a>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersContainer.innerHTML = orders.map(order => createOrderCard(order)).join('');
}

function createOrderCard(order) {
    const date = new Date(order.date);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusText = order.status === 'processing' ? 'В обработке' : 'Доставлен';
    const statusClass = order.status === 'processing' ? 'status-processing' : 'status-delivered';
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Заказ #${order.id}</div>
                    <div class="order-date">${formattedDate}</div>
                </div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="order-item-info">
                        
                        
                            <div class="item-image">${renderImage(item.image, item.name)}</div>
                            
                            
                            <div>
                                <div style="font-weight: 500;">${item.name}</div>
                                <div style="color: #666; font-size: 14px;">${item.quantity} шт × ${item.price} ₸</div>
                            </div>
                        </div>
                        <div style="font-weight: 600;">${item.price * item.quantity} ₸</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                <span>Итого:</span>
                <span>${order.totalPrice} ₸</span>
            </div>
            
            ${order.deliveryAddress ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); color: #666;">
                    <strong>📍 Адрес доставки:</strong><br>
                    ${order.deliveryAddress.city}, ${order.deliveryAddress.address}
                    ${order.deliveryAddress.apartment ? `, кв. ${order.deliveryAddress.apartment}` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

function renderImage(image, alt = '') {
    const isFile = typeof image === 'string' && /\.(png|jpe?g|webp|svg)$/i.test(image);
    return isFile
        ? `<img src="${image}" alt="${alt}" style="width:60px;height:60px;object-fit:cover;border-radius:10px;">`
        : `<span style="font-size:40px;">${image}</span>`;
}
function logout() {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        localStorage.removeItem('user');
        showAlert('Вы успешно вышли из аккаунта', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
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