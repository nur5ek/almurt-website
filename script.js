// Products Database
const products = [
    { id: 1, name: 'Яблоки Гренни Смит', price: 890, category: 'fruits', image: 'img/products/apples.jpg', discount: 15, popular: true },

    { id: 2, name: 'Молоко Простоквашино 3.2%', price: 650, category: 'dairy', image: 'img/products/milk.jpg', discount: 0, popular: true },

    { id: 3, name: 'Куриное филе охлажденное', price: 1890, category: 'meat', image: 'img/products/chicken.jpg', discount: 20, popular: false, nurbekChoice: true },

    { id: 4, name: 'Хлеб белый нарезной', price: 280, category: 'bakery', image: 'img/products/bread.jpg', discount: 0, popular: true },
    { id: 5, name: 'Томаты черри 250г', price: 1200, category: 'fruits', image: 'img/products/tomatoes.jpg', discount: 10, popular: false },
    { id: 6, name: 'Кока-Кола 2л', price: 780, category: 'beverages', image: 'img/products/cocacola.jpg', discount: 0, popular: true },
    { id: 7, name: 'Чипсы Lays сметана', price: 450, category: 'snacks', image: 'img/products/lays.jpg', discount: 25, popular: true, nurbekChoice: true },
    { id: 8, name: 'Сыр Голландский 45%', price: 2300, category: 'dairy', image: 'img/products/cheese.jpg', discount: 0, popular: false, nurbekChoice: true },
    { id: 9, name: 'Бананы 1кг', price: 750, category: 'fruits', image: 'img/products/bananas.jpg', discount: 5, popular: true, nurbekChoice: true },

    { id: 10, name: 'Йогурт Danone клубника', price: 320, category: 'dairy', image: 'img/products/yogurt.jpg', discount: 15, popular: false, nurbekChoice: true },

    { id: 11, name: 'Говядина мраморная', price: 3500, category: 'meat', image: 'img/products/beef.jpg', discount: 0, popular: false },

    { id: 12, name: 'Круассан французский', price: 380, category: 'bakery', image: 'img/products/Croissant.jpg', discount: 0, popular: false, nurbekChoice: true },
    { id: 13, name: 'Картофель 2кг', price: 450, category: 'fruits', image: 'img/products/potatoes.jpg', discount: 0, popular: true },

    { id: 14, name: 'Вода минеральная 1.5л', price: 180, category: 'beverages', image: 'img/products/water.jpg', discount: 0, popular: true, nurbekChoice: true },


    { id: 20, name: 'Сок яблочный 1л', price: 550, category: 'beverages', image: 'img/products/apple-juice.jpg', discount: 0, popular: false }
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
    initBannerSlider();
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
    } else if (category === 'nurbek-choice') {
        filtered = products.filter(p => p.nurbekChoice);
        title.textContent = 'Выбор Нурбека';
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
    
    // Trigger jQuery animation event
    if (typeof $ !== 'undefined') {
        $(document).trigger('categoryChanged');
    }
    
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

    const imageHtml = (typeof product.image === 'string' && product.image.startsWith('img/'))
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
        : `${product.image}`;

    return `
    <div class="product-card">
      <div class="product-image">${renderImage(product.image, product.name)}</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-price">
          <span class="price-current">${discountPrice} ₸</span>
          ${product.discount > 0 ? `
            <span class="price-old">${product.price} ₸</span>
            <span class="discount-badge">-${product.discount}%</span>
          ` : ''}
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
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
function renderImage(image, alt = '') {
    const isFile = typeof image === 'string' && /\.(png|jpe?g|webp|svg)$/i.test(image);
    return isFile
        ? `<img src="${image}" alt="${alt}" class="product-img">`
        : `<span class="product-emoji">${image}</span>`;
}


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

// Banner slider
let currentBannerIndex = 0;
let bannerInterval = null;

function initBannerSlider() {
    const img1 = document.getElementById('bannerImg1');
    const img2 = document.getElementById('bannerImg2');
    
    if (!img1 || !img2) return;
    
    // Switch images every 4 seconds
    bannerInterval = setInterval(() => {
        if (currentBannerIndex === 0) {
            img1.classList.remove('active');
            img2.classList.add('active');
            currentBannerIndex = 1;
        } else {
            img2.classList.remove('active');
            img1.classList.add('active');
            currentBannerIndex = 0;
        }
    }, 4000);
}

// Handle banner click
function handleBannerClick() {
    const img1 = document.getElementById('bannerImg1');
    const img2 = document.getElementById('bannerImg2');
    
    if (!img1 || !img2) return;
    
    // Check which image is currently active
    if (img1.classList.contains('active')) {
        // Nurbek.png is visible, open "Выбор Нурбека"
        goToCategory('nurbek-choice');
    } else if (img2.classList.contains('active')) {
        // Discount image is visible, open "Товары со скидкой"
        goToCategory('discount');
    }
}

// Export functions for use in other files
window.showAlert = showAlert;
window.products = products;
window.goToCategory = goToCategory;
window.scrollToCategories = scrollToCategories;
window.backToHome = backToHome;
window.handleBannerClick = handleBannerClick;