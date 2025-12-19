// Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search (optional)
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 2) {
                performSearch();
            } else if (searchInput.value.length === 0) {
                // Reset to current category when search is cleared
                if (typeof displayProducts === 'function' && typeof currentCategory !== 'undefined') {
                    displayProducts(currentCategory);
                }
            }
        });
    }
});

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        showAlert('Введите название товара', 'error');
        return;
    }
    
    // Show catalog section
    document.querySelector('.welcome-banner').style.display = 'none';
    document.querySelector('.categories-section').style.display = 'none';
    document.getElementById('catalogSection').style.display = 'block';
    
    // Remove active class from all category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const grid = document.getElementById('productsGrid');
    const title = document.getElementById('catalogTitle');
    
    // Search in products
    const results = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>Товары не найдены</h3>
                <p>По запросу "${query}" ничего не найдено</p>
            </div>
        `;
        title.textContent = 'Результаты поиска';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    title.textContent = `Результаты поиска: "${query}" (${results.length})`;
    
    grid.innerHTML = results.map(product => {
        const discountPrice = product.discount > 0 
            ? Math.round(product.price * (1 - product.discount / 100))
            : product.price;
        
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
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        В корзину
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners to buttons
    const addButtons = grid.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}