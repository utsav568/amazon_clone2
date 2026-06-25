// ============================================
// Shopping Cart Module
// ============================================

const Cart = {
    items: [],

    init() {
        // Load cart from storage
        this.items = Utils.storage.get('cart') || [];
        this.updateCartCount();
    },

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = ProductsData.getById(productId);
        if (!product) {
            Utils.showToast('Product not found', 'error');
            return false;
        }

        // Check if item already in cart
        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: Utils.generateId(),
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.save();
        this.updateCartCount();
        Utils.showToast('Added to Cart', 'success');
        return true;
    },

    // Remove item from cart
    removeItem(cartItemId) {
        this.items = this.items.filter(item => item.id !== cartItemId);
        this.save();
        this.updateCartCount();
        Utils.showToast('Item removed from cart', 'info');
    },

    // Update item quantity
    updateQuantity(cartItemId, quantity) {
        const item = this.items.find(item => item.id === cartItemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(cartItemId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateCartCount();
            }
        }
    },

    // Get all cart items with product details
    getItems() {
        return this.items.map(item => {
            const product = ProductsData.getById(item.productId);
            return {
                ...item,
                product
            };
        }).filter(item => item.product); // Filter out items with missing products
    },

    // Get cart total
    getTotal() {
        return this.getItems().reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    },

    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    // Save cart to storage
    save() {
        Utils.storage.set('cart', this.items);
    },

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    },

    // Clear cart
    clear() {
        this.items = [];
        this.save();
        this.updateCartCount();
    },

    // Check if product is in cart
    hasItem(productId) {
        return this.items.some(item => item.productId === productId);
    },

    // Get shipping cost (free over $35)
    getShippingCost() {
        const subtotal = this.getTotal();
        return subtotal >= 35 ? 0 : 5.99;
    },

    // Get estimated tax (8%)
    getTax() {
        return this.getTotal() * 0.08;
    },

    // Get order total
    getOrderTotal() {
        return this.getTotal() + this.getShippingCost() + this.getTax();
    },

    // Render cart page
    renderCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummaryContainer = document.getElementById('cart-summary');
        const emptyCartContainer = document.getElementById('empty-cart');

        if (!cartItemsContainer) return;

        const items = this.getItems();

        if (items.length === 0) {
            cartItemsContainer.style.display = 'none';
            if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            if (emptyCartContainer) emptyCartContainer.style.display = 'block';
            return;
        }

        cartItemsContainer.style.display = 'block';
        if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
        if (emptyCartContainer) emptyCartContainer.style.display = 'none';

        // Render cart items
        const itemsHTML = items.map(item => {
            const price = Utils.formatPrice(item.product.price);
            const deliveryDate = Utils.getDeliveryDate();

            return `
                <div class="cart-item" data-cart-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.product.image}" alt="${item.product.title}">
                    </div>
                    <div class="cart-item-details">
                        <h3><a href="product.html?id=${item.product.id}">${item.product.title}</a></h3>
                        <p class="cart-item-price">${price.symbol}${price.whole}.${price.fraction}</p>
                        <p class="cart-item-stock">In Stock</p>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease-qty" data-cart-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-cart-id="${item.id}">
                                <button class="quantity-btn increase-qty" data-cart-id="${item.id}">+</button>
                            </div>
                            <span>|</span>
                            <a href="#" class="delete-item" data-cart-id="${item.id}">Delete</a>
                            <span>|</span>
                            <a href="#" class="save-for-later">Save for later</a>
                        </div>
                        <p class="product-delivery">FREE delivery <span>${deliveryDate}</span></p>
                    </div>
                </div>
            `;
        }).join('');

        cartItemsContainer.innerHTML = `
            <div class="cart-header">
                <h1>Shopping Cart</h1>
                <span>Price</span>
            </div>
            ${itemsHTML}
        `;

        // Render cart summary
        if (cartSummaryContainer) {
            const subtotal = this.getTotal();
            const shipping = this.getShippingCost();
            const tax = this.getTax();
            const total = this.getOrderTotal();
            const itemCount = this.getItemCount();

            cartSummaryContainer.innerHTML = `
                <div class="summary-line">
                    <span>Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''}):</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Estimated tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-total">
                    <span>Order total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <a href="checkout.html" class="checkout-btn">Proceed to checkout</a>
                ${shipping > 0 ? `<p style="font-size: 12px; color: #067d62; margin-top: 10px;">Add $${(35 - subtotal).toFixed(2)} more for FREE Shipping</p>` : ''}
            `;
        }

        // Bind cart item events
        this.bindCartItemEvents();
    },

    // Bind events for cart items
    bindCartItemEvents() {
        // Decrease quantity
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = e.target.dataset.cartId;
                const item = this.items.find(i => i.id === cartId);
                if (item) {
                    this.updateQuantity(cartId, item.quantity - 1);
                    this.renderCartPage();
                }
            });
        });

        // Increase quantity
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = e.target.dataset.cartId;
                const item = this.items.find(i => i.id === cartId);
                if (item) {
                    this.updateQuantity(cartId, item.quantity + 1);
                    this.renderCartPage();
                }
            });
        });

        // Quantity input change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const cartId = e.target.dataset.cartId;
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(cartId, quantity);
                this.renderCartPage();
            });
        });

        // Delete item
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cartId = e.target.dataset.cartId;
                this.removeItem(cartId);
                this.renderCartPage();
            });
        });
    }
};

// Make Cart globally available
window.Cart = Cart;
