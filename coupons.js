/* ======================================
   MRIGNAINI — COUPONS (announcement bar)
   Coupon rules live in the Supabase "coupons" table and are applied by the
   server when it prices the cart. This file only handles click-to-copy.
   ====================================== */

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
