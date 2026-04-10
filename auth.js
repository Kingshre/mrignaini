// Local storage based mock authentication
let currentUser = null;

function initAuth() {
    const sessionStr = localStorage.getItem('mrignaini_session');
    if (sessionStr) {
        try {
            currentUser = JSON.parse(sessionStr);
        } catch (e) {
            currentUser = null;
        }
    }
    checkAuth();
}

function checkAuth() {
    updateAuthUI();
}

function updateAuthUI() {
    const authUiContainer = document.getElementById('authUiContainer');
    if (!authUiContainer) return;

    if (currentUser) {
        authUiContainer.innerHTML = `
            <div class="user-dropdown" style="position: relative;">
                <button class="user-btn" aria-label="User Profile" onclick="toggleUserMenu()">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span class="btn-label hide-mobile">Account</span>
                </button>
                <div class="user-menu" id="userMenu">
                    <div class="user-menu-header">
                        <span class="user-email">${currentUser.email}</span>
                    </div>
                    <a href="profile.html" class="user-menu-item">My Profile</a>
                    <button class="user-menu-item login-out-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    } else {
        authUiContainer.innerHTML = `
            <a href="auth.html" class="user-btn" aria-label="Login">
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
    if (menu) {
        menu.classList.toggle('active');
    }
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.user-btn');
    if (menu && menu.classList.contains('active')) {
        if (!menu.contains(e.target) && !userBtn.contains(e.target)) {
            menu.classList.remove('active');
        }
    }
});

function logout() {
    currentUser = null;
    localStorage.removeItem('mrignaini_session');
    updateAuthUI();
    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('auth.html')) {
        window.location.href = 'index.html';
    }
}

// Global functions for auth.html
async function mockSignIn(email, password) {
    // accept generic login
    const user = { email: email, full_name: "Customer" };
    localStorage.setItem('mrignaini_session', JSON.stringify(user));
    currentUser = user;
    return { data: { user }, error: null };
}

async function mockSignUp(email, password, name) {
    const user = { email: email, full_name: name };
    localStorage.setItem('mrignaini_session', JSON.stringify(user));
    currentUser = user;
    return { data: { user }, error: null };
}

// Init on DOM load
document.addEventListener('DOMContentLoaded', initAuth);
