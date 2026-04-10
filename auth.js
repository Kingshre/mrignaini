const SUPABASE_URL = 'https://ltdqrujonwgnfivhhfya.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZHFydWpvbndnbmZpdmhoZnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA2MzUsImV4cCI6MjA5MTMyNjYzNX0.Di4IQ4zFpQbIIIIser_vEWtNJZX_XIg7OnYzXZSKk_s';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth state
let currentUser = null;

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    updateAuthUI();
}

function updateAuthUI() {
    const authUiContainer = document.getElementById('authUiContainer');
    if (!authUiContainer) return;

    if (currentUser) {
        authUiContainer.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn" aria-label="User Profile" onclick="toggleUserMenu()">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </button>
                <div class="user-menu" id="userMenu">
                    <div class="user-menu-header">
                        <span class="user-email">${currentUser.email}</span>
                    </div>
                    <a href="profile.html" class="user-menu-item">My Profile</a>
                    <button class="user-menu-item" onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    } else {
        authUiContainer.innerHTML = `
            <a href="auth.html" class="user-btn" aria-label="Login">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                     <circle cx="12" cy="7" r="4"/>
                </svg>
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
    if (menu && menu.classList.contains('active') && !menu.contains(e.target) && !userBtn.contains(e.target)) {
        menu.classList.remove('active');
    }
});

async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    updateAuthUI();
    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('auth.html')) {
        window.location.href = 'index.html';
    }
}

// Setup listeners
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
});

// Init on DOM load
document.addEventListener('DOMContentLoaded', checkAuth);
