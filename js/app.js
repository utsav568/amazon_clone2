// ============================================
// Main Application
// ============================================

const App = {
    productsPerPage: 8,
    currentPage: 1,
    currentCategory: 'all',
    currentSort: 'featured',
    filteredProducts: [],

    init() {
        // Initialize modules
        Cart.init();
        Auth.init();

        // Determine which page we're on
        const path = window.location.pathname;

        if (path.includes('cart.html')) {
            Cart.renderCartPage();
        } else if (path.includes('checkout.html')) {
            Checkout.init();
        } else if (path.includes('orders.html')) {
            Orders.renderOrdersPage();
        } else if (path.includes('product.html')) {
            this.renderProductPage();
        } else {
            // Home page
            this.renderHomePage();
        }

        // Bind global events
        this.bindGlobalEvents();
    },

    bindGlobalEvents() {
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Category navigation
        document.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderProducts();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderProducts(true);
            });
        }

        // Hero slider
        this.initHeroSlider();
    },

    renderHomePage() {
        this.renderCategories();
        this.filteredProducts = ProductsData.getAll();
        this.renderProducts();
        this.renderDeals();
    },

    renderCategories() {
        const categoryGrid = document.getElementById('category-grid');
        if (!categoryGrid) return;

        const categories = ProductsData.getCategories();

        categoryGrid.innerHTML = categories.map(cat => `
            <div class="category-card">
                <h3>${cat.name}</h3>
                <img src="${cat.image}" alt="${cat.name}">
                <a href="#" data-category="${cat.id}">${cat.link}</a>
            </div>
        `).join('');

        // Rebind category events
        categoryGrid.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });
    },

    renderProducts(append = false) {
        const productsGrid = document.getElementById('products-grid');
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!productsGrid) return;

        // Sort products
        let products = ProductsData.sort(this.filteredProducts, this.currentSort);

        // Pagination
        const startIndex = append ? (this.currentPage - 1) * this.productsPerPage : 0;
        const endIndex = this.currentPage * this.productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        const productsHTML = paginatedProducts.map(product => this.createProductCard(product)).join('');

        if (append) {
            productsGrid.insertAdjacentHTML('beforeend', productsHTML);
        } else {
            productsGrid.innerHTML = productsHTML;
        }

        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = endIndex >= products.length ? 'none' : 'inline-block';
        }

        // Bind add to cart events
        this.bindAddToCartEvents();
    },

    createProductCard(product) {
        const price = Utils.formatPrice(product.price);
        const stars = Utils.generateStars(product.rating);
        const deliveryDate = Utils.getDeliveryDate();
        const discount = product.isOnSale ? Utils.calculateDiscount(product.originalPrice, product.price) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${product.isBestSeller ? '<span class="product-badge">Best Seller</span>' : ''}
                ${discount > 0 ? `<span class="product-badge" style="background: #067d62;">${discount}% off</span>` : ''}
                <div class="product-image">
                    <a href="pages/product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                    </a>
                </div>
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="pages/product.html?id=${product.id}">${product.title}</a>
                    </h3>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">${product.reviewCount.toLocaleString()}</span>
                    </div>
                    <div class="product-price">
                        <span class="price-symbol">${price.symbol}</span>
                        <span class="price-whole">${price.whole}</span>
                        <span class="price-fraction">${price.fraction}</span>
                        ${product.isOnSale ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <p class="product-delivery">FREE delivery <span>${deliveryDate}</span></p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    },

    renderDeals() {
        const dealsGrid = document.getElementById('deals-grid');
        if (!dealsGrid) return;

        const deals = ProductsData.getDeals().slice(0, 6);

        dealsGrid.innerHTML = deals.map(product => {
            const price = Utils.formatPrice(product.price);
            const discount = Utils.calculateDiscount(product.originalPrice, product.price);
            const claimed = Math.floor(Math.random() * 60) + 30; // Random 30-90%

            return `
                <div class="deal-card">
                    <span class="deal-badge">${discount}% off</span>
                    <div class="deal-image">
                        <a href="pages/product.html?id=${product.id}">
                            <img src="${product.image}" alt="${product.title}">
                        </a>
                    </div>
                    <div class="deal-info">
                        <div class="deal-progress">
                            <div class="deal-progress-bar" style="width: ${claimed}%"></div>
                        </div>
                        <p class="deal-text">${claimed}% claimed</p>
                        <p class="deal-price">${price.symbol}${price.whole}.${price.fraction}</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderProductPage() {
        const params = Utils.getUrlParams();
        const productId = params.id;

        if (!productId) {
            window.location.href = '../index.html';
            return;
        }

        const product = ProductsData.getById(productId);
        if (!product) {
            window.location.href = '../index.html';
            return;
        }

        const productContainer = document.getElementById('product-detail');
        if (!productContainer) return;

        const price = Utils.formatPrice(product.price);
        const stars = Utils.generateStars(product.rating);
        const deliveryDate = Utils.getDeliveryDate();
        const discount = product.isOnSale ? Utils.calculateDiscount(product.originalPrice, product.price) : 0;

        productContainer.innerHTML = `
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.title}" id="main-product-image">
                </div>
                <div class="thumbnail-list">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                            <img src="${img}" alt="Thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="product-details">
                <h1>${product.title}</h1>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">${product.reviewCount.toLocaleString()} ratings</span>
                </div>

                <div class="product-price-section">
                    ${discount > 0 ? `<span style="color: #cc0c39; font-weight: bold;">-${discount}%</span>` : ''}
                    <span class="price-label">Price: </span>
                    <span class="price-value">${price.symbol}${price.whole}.${price.fraction}</span>
                    ${product.isOnSale ? `<span class="original-price">List Price: $${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>

                <div class="product-description">
                    <h3>About this item</h3>
                    <ul>
                        ${product.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="buy-box">
                <div class="price">
                    <span class="price-symbol">${price.symbol}</span>
                    <span class="price-whole">${price.whole}</span>
                    <span class="price-fraction">${price.fraction}</span>
                </div>
                <p class="delivery-info">FREE delivery <span>${deliveryDate}</span></p>
                <p class="stock-status"><i class="fas fa-check-circle"></i> In Stock</p>

                <div class="quantity-row">
                    <label>Qty:</label>
                    <select id="product-quantity">
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n}</option>`).join('')}
                    </select>
                </div>

                <button class="add-to-cart-btn" id="add-to-cart-detail">Add to Cart</button>
                <button class="buy-now-btn" id="buy-now-btn">Buy Now</button>

                <p class="secure-transaction">
                    <i class="fas fa-lock"></i> Secure transaction
                </p>
            </div>
        `;

        // Update page title
        document.title = `${product.title} - Amazon Clone`;

        // Bind thumbnail clicks
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                document.getElementById('main-product-image').src = thumb.dataset.image;
            });
        });

        // Bind add to cart
        document.getElementById('add-to-cart-detail')?.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('product-quantity').value);
            Cart.addItem(productId, quantity);
        });

        // Bind buy now
        document.getElementById('buy-now-btn')?.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('product-quantity').value);
            Cart.addItem(productId, quantity);
            window.location.href = 'cart.html';
        });
    },

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        if (category === 'all') {
            this.filteredProducts = ProductsData.getAll();
        } else {
            this.filteredProducts = ProductsData.getByCategory(category);
        }

        this.renderProducts();

        // Scroll to products section
        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
    },

    handleSearch() {
        const searchInput = document.getElementById('search-input');
        const category = document.getElementById('search-category');

        if (!searchInput) return;

        const query = searchInput.value.trim();
        const selectedCategory = category?.value || 'all';

        if (!query) {
            this.filterByCategory(selectedCategory);
            return;
        }

        let results = ProductsData.search(query);

        if (selectedCategory !== 'all') {
            results = results.filter(p => p.category === selectedCategory);
        }

        this.filteredProducts = results;
        this.currentPage = 1;
        this.renderProducts();

        // Update section header
        const sectionHeader = document.querySelector('.section-header h2');
        if (sectionHeader) {
            sectionHeader.textContent = `Search Results for "${query}" (${results.length})`;
        }

        // Scroll to products section
        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
    },

    bindAddToCartEvents() {
        document.querySelectorAll('.add-to-cart-btn[data-product-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.dataset.productId;
                Cart.addItem(productId);
            });
        });
    },

    initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (slides.length === 0) return;

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
