/* ======================================
   MRIGNAINI — ADMIN SHARED
   Login gate (Supabase Auth + public.is_admin()), helpers, toasts.
   Requires supabase-js + config.js. Every read/write is checked by RLS
   in the database, so hiding the UI is a convenience, not the security.
   ====================================== */

const IST = 'Asia/Kolkata';
const sb = typeof getSupabase === 'function' ? getSupabase() : null;

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatINR(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function toast(message, ok = true) {
    let el = document.getElementById('adminToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'adminToast';
        el.className = 'admin-toast';
        el.setAttribute('role', 'status');
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle('error', !ok);
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ok ? 2500 : 6000);
}

const Admin = {
    user: null,

    showView(view) {
        document.getElementById('loginView').hidden = view !== 'login';
        document.getElementById('dashboardView').hidden = view !== 'dashboard';
        document.getElementById('signOutBtn').hidden = view !== 'dashboard';
        document.querySelectorAll('.admin-tabs').forEach(t => { t.hidden = view !== 'dashboard'; });
    },

    // Shows the login form until an admin signs in, then calls onReady(user)
    async init(onReady) {
        const loginMsg = document.getElementById('loginMsg');
        if (!sb) {
            this.showView('login');
            loginMsg.textContent = 'Supabase failed to load. Check your connection and config.js.';
            return;
        }

        const check = async () => {
            const { data: { session } } = await sb.auth.getSession();
            if (!session) { this.showView('login'); return; }
            const { data: isAdmin, error } = await sb.rpc('is_admin');
            if (error || !isAdmin) {
                await sb.auth.signOut();
                this.showView('login');
                loginMsg.textContent = error ? 'Could not verify admin access: ' + error.message : 'This account is not an admin.';
                return;
            }
            this.user = session.user;
            document.getElementById('adminEmail').textContent = session.user.email;
            this.showView('dashboard');
            onReady(session.user);
        };

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('loginBtn');
            loginMsg.textContent = '';
            btn.disabled = true;
            btn.textContent = 'Signing in…';
            const { error } = await sb.auth.signInWithPassword({
                email: document.getElementById('loginEmail').value.trim(),
                password: document.getElementById('loginPassword').value
            });
            btn.disabled = false;
            btn.textContent = 'Sign in';
            if (error) { loginMsg.textContent = error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message; return; }
            check();
        });

        document.getElementById('signOutBtn').addEventListener('click', async () => {
            await sb.auth.signOut();
            window.location.reload();
        });

        await check();
    }
};
