/* ======================================
   MRIGNAINI — CART SYSTEM
   localStorage-based shopping cart
   ====================================== */

const CART_KEY = 'mrignaini_cart';

const Cart = {
    // Get all cart items
    getItems() {
        const data = localStorage.getItem(CART_KEY);
        let items = data ? JSON.parse(data) : [];
        if (typeof getProductById === 'function') {
            const valid = items.filter(i => getProductById(i.productId));
            if (valid.length !== items.length) {
                localStorage.setItem(CART_KEY, JSON.stringify(valid));
                items = valid;
            }
        }
        return items;
    },

    // Save items
    _save(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        Cart.updateBadge();
    },

    // Add item to cart
    add(productId, size, qty = 1) {
        const items = Cart.getItems();
        const existing = items.find(i => i.productId === productId && i.size === size);
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({ productId, size, qty });
        }
        Cart._save(items);
        Cart.showNotification('Added to cart!');
    },

    // Remove item from cart
    remove(productId, size) {
        let items = Cart.getItems();
        items = items.filter(i => !(i.productId === productId && String(i.size) === String(size)));
        Cart._save(items);
    },

    // Update quantity
    updateQty(productId, size, newQty) {
        const items = Cart.getItems();
        const item = items.find(i => i.productId === productId && String(i.size) === String(size));
        if (item) {
            if (newQty <= 0) {
                Cart.remove(productId, size);
            } else {
                item.qty = newQty;
                Cart._save(items);
            }
        }
    },

    // Clear entire cart
    clear() {
        localStorage.removeItem(CART_KEY);
        Cart.updateBadge();
    },

    // Get total item count
    getCount() {
        return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    // Get cart total price
    getTotal() {
        const items = Cart.getItems();
        let total = 0;
        items.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                total += product.price * item.qty;
            }
        });
        return total;
    },

    // Get original total (before discount)
    getOriginalTotal() {
        const items = Cart.getItems();
        let total = 0;
        items.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                total += product.originalPrice * item.qty;
            }
        });
        return total;
    },

    // Update the cart badge in the navbar
    updateBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = Cart.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.add('visible');
            } else {
                badge.classList.remove('visible');
            }
        });
    },

    // Show a mini notification with Checkout / Explore options
    showNotification(message) {
        // Remove existing
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>${message}</span>
            <div class="cart-notif-actions">
                <a href="cart.html" class="cart-notif-checkout">Checkout →</a>
                <a href="category.html?cat=all" class="cart-notif-explore">Continue shopping</a>
            </div>
        `;
        document.body.appendChild(notif);

        // Animate in
        requestAnimationFrame(() => {
            notif.classList.add('show');
        });

        // Remove after 5s (longer to give time to click)
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 5000);
    }
};

// Initialize badge on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
});
