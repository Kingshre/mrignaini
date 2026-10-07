/* ======================================
   MRIGNAINI — CART SYSTEM
   localStorage cart of { variantId, qty }. A variant is one colour + size,
   so the same top in two colours is two lines. Prices are never stored here:
   the server prices every cart from the database.
   ====================================== */

const CART_KEY = 'mrignaini_cart_v2';
const CART_MAX_QTY = 10;

// Carts from the old site referenced products, not colour/size variants, and can't be mapped safely.
try { localStorage.removeItem('mrignaini_cart'); } catch (e) { /* storage unavailable */ }

const Cart = {
    getItems() {
        try {
            const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            return Array.isArray(items) ? items.filter(i => i && i.variantId && i.qty > 0) : [];
        } catch (e) {
            return [];
        }
    },

    _save(items) {
        try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
        Cart.updateBadge();
    },

    // maxQty = stock available for this variant (caps the line)
    add(variantId, qty = 1, maxQty = CART_MAX_QTY) {
        const items = Cart.getItems();
        const limit = Math.min(maxQty, CART_MAX_QTY);
        const existing = items.find(i => i.variantId === variantId);
        const current = existing ? existing.qty : 0;
        const newQty = Math.min(current + qty, limit);
        if (newQty <= current) {
            Cart.showNotification(`You already have the last ${limit === 1 ? 'piece' : limit + ' pieces'} in your cart.`, false);
            return false;
        }
        if (existing) existing.qty = newQty;
        else items.push({ variantId, qty: newQty });
        Cart._save(items);
        Cart.showNotification(newQty - current < qty ? `Added — only ${limit} available.` : 'Added to cart!');
        return true;
    },

    remove(variantId) {
        Cart._save(Cart.getItems().filter(i => i.variantId !== variantId));
    },

    updateQty(variantId, newQty) {
        if (newQty <= 0) return Cart.remove(variantId);
        const items = Cart.getItems();
        const item = items.find(i => i.variantId === variantId);
        if (item) {
            item.qty = Math.min(newQty, CART_MAX_QTY);
            Cart._save(items);
        }
    },

    clear() {
        try { localStorage.removeItem(CART_KEY); } catch (e) { /* storage unavailable */ }
        Cart.updateBadge();
    },

    getCount() {
        return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    // Update the cart badge in the navbar
    updateBadge() {
        const count = Cart.getCount();
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.classList.toggle('visible', count > 0);
        });
    },

    // Show a mini notification with Checkout / Explore options
    showNotification(message, success = true) {
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.setAttribute('role', 'status');
        notif.innerHTML = `
            ${success ? '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
            <span>${escapeHtml(message)}</span>
            <div class="cart-notif-actions">
                <a href="cart.html" class="cart-notif-checkout">Checkout →</a>
                <a href="category.html?cat=all" class="cart-notif-explore">Continue shopping</a>
            </div>
        `;
        document.body.appendChild(notif);
        requestAnimationFrame(() => notif.classList.add('show'));
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 5000);
    }
};

// Initialize badge on page load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
