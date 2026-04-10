/* ======================================
   MRIGNAINI — COUPON SYSTEM
   Shared coupon logic for cart & checkout
   ====================================== */

const COUPONS = {
    'MRIG500': {
        discount: 500,
        type: 'flat',
        minOrder: 3999,
        description: '₹500 off on orders above ₹3,999'
    },
    'MRIG1000': {
        discount: 1000,
        type: 'flat',
        minOrder: 7999,
        description: '₹1,000 off on orders above ₹7,999'
    },
    'FREESHIP': {
        discount: 0,
        type: 'freeship',
        minOrder: 1999,
        description: 'Free shipping on orders above ₹1,999'
    }
};

function validateCoupon(code, subtotal) {
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) {
        return { valid: false, message: 'Invalid coupon code. Please check and try again.' };
    }
    if (subtotal < coupon.minOrder) {
        return { valid: false, message: `Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required for this coupon.` };
    }
    return { valid: true, coupon: coupon, message: coupon.description };
}

// Copy code to clipboard from announcement bar
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ann-code').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const code = el.dataset.code;
            navigator.clipboard.writeText(code).then(() => {
                el.classList.add('copied');
                // Show toast
                let toast = document.querySelector('.copy-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.className = 'copy-toast';
                    document.body.appendChild(toast);
                }
                toast.textContent = `Code "${code}" copied to clipboard!`;
                toast.classList.add('show');
                setTimeout(() => {
                    el.classList.remove('copied');
                    toast.classList.remove('show');
                }, 2000);
            });
        });
    });
});
