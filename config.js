/* ======================================
   MRIGNAINI — PUBLIC FRONTEND CONFIG
   Only public values belong here. The anon key is designed to be public;
   Row Level Security in Supabase is what protects the data.
   Never put the service-role key or any secret in a frontend file.
   Load after the supabase-js CDN script and before other site scripts.
   ====================================== */

const MRG_CONFIG = (() => {
    const host = window.location.hostname;
    const isFile = window.location.protocol === 'file:';
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    return {
        SUPABASE_URL: 'https://ltdqrujonwgnfivhhfya.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZHFydWpvbndnbmZpdmhoZnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA2MzUsImV4cCI6MjA5MTMyNjYzNX0.Di4IQ4zFpQbIIIIser_vEWtNJZX_XIg7OnYzXZSKk_s',
        // Locally, server.js serves both the site and the API on the same origin (any port).
        API_BASE_URL: isLocal ? window.location.origin
            : isFile ? 'http://localhost:3000'
            : 'https://mrignaini-backend.onrender.com'
    };
})();

// One shared Supabase client per page (auth session is shared via localStorage)
function getSupabase() {
    if (!window.__mrgSupabase && window.supabase) {
        window.__mrgSupabase = window.supabase.createClient(MRG_CONFIG.SUPABASE_URL, MRG_CONFIG.SUPABASE_ANON_KEY);
    }
    return window.__mrgSupabase || null;
}

// POST JSON to the backend, sending the signed-in user's token when there is one.
// Resolves to the parsed JSON body; rejects with an Error carrying .status and .body.
async function mrgApi(path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const sb = getSupabase();
    if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session) headers.Authorization = 'Bearer ' + session.access_token;
    }
    let res;
    try {
        res = await fetch(MRG_CONFIG.API_BASE_URL + path, { method: 'POST', headers, body: JSON.stringify(body || {}) });
    } catch (e) {
        const err = new Error('Could not reach the store server. Please check your connection and try again.');
        err.status = 0;
        throw err;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
        const err = new Error(data.message || `Request failed (${res.status})`);
        err.status = res.status;
        err.body = data;
        throw err;
    }
    return data;
}

// Escape text before putting it into innerHTML
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
