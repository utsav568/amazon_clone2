// ============================================
// Checkout Module
// ============================================

const Checkout = {
    init() {
        this.renderCheckoutPage();
        this.bindEvents();
    },

    renderCheckoutPage() {
        const checkoutItemsContainer = document.getElementById('checkout-items');
        const checkoutSummaryContainer = document.getElementById('checkout-summary');

        if (!checkoutItemsContainer || !checkoutSummaryContainer) return;

        const items = Cart.getItems();

        if (items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        // Render checkout items
        const itemsHTML = items.map(item => `
            <div class="checkout-item">
                <img src="${item.product.image}" alt="${item.product.title}">
                <div class="checkout-item-details">
                    <h4>${Utils.truncateText(item.product.title, 50)}</h4>
                    <p>Qty: ${item.quantity}</p>
                    <p><strong>$${(item.product.price * item.quantity).toFixed(2)}</strong></p>
                </div>
            </div>
        `).join('');

        checkoutItemsContainer.innerHTML = itemsHTML;

        // Render checkout summary
        const subtotal = Cart.getTotal();
        const shipping = Cart.getShippingCost();
        const tax = Cart.getTax();
        const total = Cart.getOrderTotal();

        checkoutSummaryContainer.innerHTML = `
            <button class="place-order-btn" id="place-order-btn">Place your order</button>
            <p style="font-size: 12px; color: #565959; text-align: center;">
                By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
            </p>
            <hr style="margin: 20px 0;">
            <h3>Order Summary</h3>
            <div class="summary-line">
                <span>Items:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping & handling:</span>
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
            <div class="checkout-items" id="checkout-items">
                ${itemsHTML}
            </div>
        `;

        // Bind place order button
        document.getElementById('place-order-btn').addEventListener('click', () => {
            this.placeOrder();
        });
    },

    bindEvents() {
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }
    },

    validateForm() {
        const requiredFields = [
            'shipping-name',
            'shipping-address',
            'shipping-city',
            'shipping-state',
            'shipping-zip',
            'card-number',
            'card-expiry',
            'card-cvv'
        ];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                Utils.showToast('Please fill in all required fields', 'error');
                field.focus();
                return false;
            }
        }

        return true;
    },

    placeOrder() {
        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            Utils.showToast('Please sign in to place your order', 'info');
            Auth.openModal('sign-in');
            return;
        }

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Create order
        const order = {
            id: Utils.generateId(),
            userId: Auth.getUser().id,
            items: Cart.getItems().map(item => ({
                productId: item.product.id,
                title: item.product.title,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity
            })),
            subtotal: Cart.getTotal(),
            shipping: Cart.getShippingCost(),
            tax: Cart.getTax(),
            total: Cart.getOrderTotal(),
            shippingAddress: {
                name: document.getElementById('shipping-name')?.value || '',
                address: document.getElementById('shipping-address')?.value || '',
                city: document.getElementById('shipping-city')?.value || '',
                state: document.getElementById('shipping-state')?.value || '',
                zip: document.getElementById('shipping-zip')?.value || ''
            },
            status: 'Processing',
            createdAt: new Date().toISOString(),
            estimatedDelivery: Utils.getDeliveryDate()
        };

        // Save order
        const orders = Utils.storage.get('orders') || [];
        orders.push(order);
        Utils.storage.set('orders', orders);

        // Clear cart
        Cart.clear();

        // Show success and redirect
        Utils.showToast('Order placed successfully!', 'success');

        // Redirect to orders page after delay
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1500);
    }
};

// Orders Module
const Orders = {
    getAll() {
        return Utils.storage.get('orders') || [];
    },

    getByUser(userId) {
        return this.getAll().filter(order => order.userId === userId);
    },

    renderOrdersPage() {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;

        if (!Auth.isLoggedIn()) {
            ordersContainer.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-user-lock"></i>
                    <h2>Please sign in</h2>
                    <p>Sign in to view your orders</p>
                    <button onclick="Auth.openModal('sign-in')" class="continue-shopping-btn">Sign In</button>
                </div>
            `;
            return;
        }

        const userOrders = this.getByUser(Auth.getUser().id);

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-box-open"></i>
                    <h2>No orders yet</h2>
                    <p>Looks like you haven't placed any orders</p>
                    <a href="../index.html" class="continue-shopping-btn">Start Shopping</a>
                </div>
            `;
            return;
        }

        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const ordersHTML = userOrders.map(order => {
            const itemsHTML = order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="order-item-details">
                        <h4><a href="product.html?id=${item.productId}">${item.title}</a></h4>
                        <p>Qty: ${item.quantity} | $${item.price.toFixed(2)} each</p>
                    </div>
                </div>
            `).join('');

            return `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-header-item">
                            <span>ORDER PLACED</span>
                            <span>${Utils.formatDate(order.createdAt)}</span>
                        </div>
                        <div class="order-header-item">
                            <span>TOTAL</span>
                            <span>$${order.total.toFixed(2)}</span>
                        </div>
                        <div class="order-header-item">
                            <span>SHIP TO</span>
                            <span>${order.shippingAddress.name}</span>
                        </div>
                        <div class="order-header-item">
                            <span>ORDER #</span>
                            <span>${order.id.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="order-body">
                        <p class="order-status">
                            <i class="fas fa-truck"></i> ${order.status} - Arriving ${order.estimatedDelivery}
                        </p>
                        ${itemsHTML}
                    </div>
                </div>
            `;
        }).join('');

        ordersContainer.innerHTML = ordersHTML;
    }
};

// Make modules globally available
window.Checkout = Checkout;
window.Orders = Orders;
