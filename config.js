/* ======================================
   MRIGNAINI — PUBLIC FRONTEND CONFIG
   Only public values belong here. The anon key is designed to be public;
   Row Level Security in Supabase is what protects the data.
   Never put the service-role key or any secret in a frontend file.
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
