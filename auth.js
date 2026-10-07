/* ======================================
   MRIGNAINI — CUSTOMER AUTH (Supabase Auth)
   Requires: supabase-js CDN + config.js loaded first.
   ====================================== */

let currentUser = null;

async function initAuth() {
    const sb = getSupabase();
    if (!sb) { updateAuthUI(); return; }
    const { data: { session } } = await sb.auth.getSession();
    currentUser = session ? session.user : null;
    updateAuthUI();
    sb.auth.onAuthStateChange((_event, session) => {
        currentUser = session ? session.user : null;
        updateAuthUI();
    });
}

function updateAuthUI() {
    const authUiContainer = document.getElementById('authUiContainer');
    if (!authUiContainer) return;

    if (currentUser) {
        authUiContainer.innerHTML = `
            <div class="user-dropdown" style="position: relative;">
                <button class="user-btn" aria-label="Account menu" aria-haspopup="true" onclick="toggleUserMenu()">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span class="btn-label hide-mobile">Account</span>
                </button>
                <div class="user-menu" id="userMenu">
                    <div class="user-menu-header">
                        <span class="user-email">${escapeHtml(currentUser.email)}</span>
                    </div>
                    <a href="profile.html" class="user-menu-item">My Account &amp; Orders</a>
                    <button class="user-menu-item login-out-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    } else {
        authUiContainer.innerHTML = `
            <a href="auth.html" class="user-btn" aria-label="Sign in">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                     <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="btn-label hide-mobile">Sign In</span>
            </a>
        `;
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.user-btn');
    if (menu && menu.classList.contains('active') && !menu.contains(e.target) && !(userBtn && userBtn.contains(e.target))) {
        menu.classList.remove('active');
    }
});

async function logout() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    currentUser = null;
    updateAuthUI();
    if (window.location.pathname.includes('profile.html')) {
        window.location.href = 'index.html';
    }
}

// Used by auth.html
async function authSignIn(email, password) {
    return getSupabase().auth.signInWithPassword({ email, password });
}

async function authSignUp(email, password, fullName) {
    return getSupabase().auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + '/auth.html'
        }
    });
}

async function authResetPassword(email) {
    return getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth.html?mode=reset'
    });
}

document.addEventListener('DOMContentLoaded', initAuth);
