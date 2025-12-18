// Products Database
const products = [
    { id: 1, name: 'Яблоки Гренни Смит', price: 890, category: 'fruits', image: '🍏', discount: 15, popular: true },
    { id: 2, name: 'Молоко Простоквашино 3.2%', price: 650, category: 'dairy', image: '🥛', discount: 0, popular: true },
    { id: 3, name: 'Куриное филе охлажденное', price: 1890, category: 'meat', image: '🍗', discount: 20, popular: false },
    { id: 4, name: 'Хлеб белый нарезной', price: 280, category: 'bakery', image: '🍞', discount: 0, popular: true },
    { id: 5, name: 'Томаты черри 250г', price: 1200, category: 'fruits', image: '🍅', discount: 10, popular: false },
    { id: 6, name: 'Кока-Кола 2л', price: 780, category: 'beverages', image: '🥤', discount: 0, popular: true },
    { id: 7, name: 'Чипсы Lays сметана', price: 450, category: 'snacks', image: '🥔', discount: 25, popular: true },
    { id: 8, name: 'Сыр Голландский 45%', price: 2300, category: 'dairy', image: '🧀', discount: 0, popular: false },
    { id: 9, name: 'Бананы 1кг', price: 750, category: 'fruits', image: '🍌', discount: 5, popular: true },
    { id: 10, name: 'Йогурт Danone клубника', price: 320, category: 'dairy', image: '🥛', discount: 15, popular: false },
    { id: 11, name: 'Говядина мраморная', price: 3500, category: 'meat', image: '🥩', discount: 0, popular: false },
    { id: 12, name: 'Круассан французский', price: 380, category: 'bakery', image: '🥐', discount: 0, popular: false },
    { id: 13, name: 'Картофель 2кг', price: 450, category: 'fruits', image: '🥔', discount: 0, popular: true },
    { id: 14, name: 'Вода минеральная 1.5л', price: 180, category: 'beverages', image: '💧', discount: 0, popular: true },
    { id: 15, name: 'Шоколад Milka', price: 620, category: 'snacks', image: '🍫', discount: 30, popular: true },
    { id: 16, name: 'Апельсины 1кг', price: 980, category: 'fruits', image: '🍊', discount: 0, popular: false },
    { id: 17, name: 'Кефир 1л', price: 420, category: 'dairy', image: '🥛', discount: 0, popular: false },
    { id: 18, name: 'Свинина ошеек', price: 2100, category: 'meat', image: '🥓', discount: 15, popular: false },
    { id: 19, name: 'Батон нарезной', price: 200, category: 'bakery', image: '🥖', discount: 0, popular: true },
    { id: 20, name: 'Сок яблочный 1л', price: 550, category: 'beverages', image: '🧃', discount: 0, popular: false }
];

// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'popular';
let catalogVisible = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupEventListeners();
    checkAuth();
});

// Setup Event Listeners
function setupEventListeners() {
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            displayProducts(currentCategory);
        });
    });

    // Profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

// Display Products
function displayProducts(category) {
    const grid = document.getElementById('productsGrid');
    const title = document.getElementById('catalogTitle');
    
    let filtered = [];
    
    if (category === 'popular') {
        filtered = products.filter(p => p.popular);
        title.textContent = 'Популярные товары';
    } else if (category === 'discount') {
        filtered = products.filter(p => p.discount > 0);
        title.textContent = 'Товары со скидкой';
    } else {
        filtered = products.filter(p => p.category === category);
        const categoryNames = {
            'fruits': 'Овощи и фрукты',
            'dairy': 'Молочные продукты',
            'meat': 'Мясо и птица',
            'bakery': 'Хлеб и выпечка',
            'beverages': 'Напитки',
            'snacks': 'Снеки'
        };
        title.textContent = categoryNames[category] || 'Продукты';
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Товары не найдены</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
    
    // Add event listeners to add-to-cart buttons
    const addButtons = grid.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// Create Product Card HTML
function createProductCard(product) {
    const discountPrice = product.discount > 0 
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
    
    return `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${discountPrice} ₸</span>
                    ${product.discount > 0 ? `
                        <span class="price-old">${product.price} ₸</span>
                        <span class="discount-badge">-${product.discount}%</span>
                    ` : ''}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    В корзину
                </button>
            </div>
        </div>
    `;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.discount > 0 
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAlert('Товар добавлен в корзину', 'success');
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show Alert
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

// Check Authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profileBtn = document.getElementById('profileBtn');
    
    if (profileBtn && user) {
        const textSpan = profileBtn.querySelector('span');
        if (textSpan) {
            textSpan.textContent = user.name || user.email;
        }
    }
}

// Export functions for use in other files
window.showAlert = showAlert;
window.products = products;
window.goToCategory = goToCategory;
window.scrollToCategories = scrollToCategories;
window.backToHome = backToHome;

// Navigate to category
function goToCategory(category) {
    currentCategory = category;
    catalogVisible = true;
    
    // Hide welcome sections
    document.querySelector('.welcome-banner').style.display = 'none';
    document.querySelector('.categories-section').style.display = 'none';
    
    // Show catalog
    document.getElementById('catalogSection').style.display = 'block';
    
    // Update active button
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Display products
    displayProducts(category);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll to categories section
function scrollToCategories() {
    document.getElementById('categoriesSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Back to home
function backToHome() {
    catalogVisible = false;
    
    // Show welcome sections
    document.querySelector('.welcome-banner').style.display = 'block';
    document.querySelector('.categories-section').style.display = 'block';
    
    // Hide catalog
    document.getElementById('catalogSection').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}