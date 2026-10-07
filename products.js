/* ======================================
   MRIGNAINI — CATALOG
   Products, colours, variants and stock live in Supabase (single source of truth).
   This file loads them and provides shared display helpers.
   Requires: supabase-js CDN + config.js loaded first.
   ====================================== */

const ICONS = {
    cotton: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 21c-4.478 0-8.118-3.64-8.118-8.118 0-4.478 3.64-8.118 8.118-8.118M13 3c4.478 0 8.118 3.64 8.118 8.118 0 4.478-3.64 8.118-8.118 8.118M12 11a2 2 0 100-4 2 2 0 000 4z"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
    indigo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    upcycled: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"/></svg>',
    statement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    wrap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M8 3v18M16 3v18"/></svg>'
};

// Category metadata (display copy only — which products belong where comes from the DB)
const CATEGORIES = {
    tops: {
        name: 'Tops',
        fullName: 'Block Print Tops',
        description: 'Versatile handblock printed tops that bring Jaipur artistry to your everyday wardrobe.',
        banner: 'Effortless Style, Artisan Made'
    },
    layers: {
        name: 'Layers',
        fullName: 'Jackets & Layers',
        description: 'Statement layers handcrafted with patchwork, block printing, and upcycled cotton — for those who wear their values.',
        banner: 'Layer Up, Stand Out'
    },
    sets: {
        name: 'Sets',
        fullName: 'Block Print Sets',
        description: 'Coordinated sets that pair handcrafted block-printed tops and bottoms for a complete, effortless look.',
        banner: 'Complete the Look'
    }
};

// Old category / product links that should keep working
const CATEGORY_ALIASES = { kurtis: 'tops', dresses: 'tops' };
const PRODUCT_ALIASES = { 'dress-afsana': 'kurti-afsana', 'top-basanti-pink': 'top-basanti' };

// Size guide data
const SIZE_GUIDE = {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    rows: [
        ['XS', '32', '26', '34', '38-40'],
        ['S',  '34', '28', '36', '39-41'],
        ['M',  '36', '30', '38', '40-42'],
        ['L',  '38', '32', '40', '41-43'],
        ['XL', '40', '34', '42', '42-44'],
        ['XXL','42', '36', '44', '43-45']
    ]
};

// Shown wherever a product photo is missing or fails to load
const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#F3EDE3"/>' +
    '<g fill="none" stroke="#C8A96E" stroke-width="6" opacity="0.7"><path d="M150 170l50-30 50 30 40 25-20 40-25-12v137H155V223l-25 12-20-40z"/></g>' +
    '<text x="200" y="420" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#9C8B6E">Photo coming soon</text></svg>');

// <img onerror="imgFallback(this)">
function imgFallback(img) {
    img.onerror = null;
    img.src = PLACEHOLDER_IMG;
    img.classList.add('img-placeholder');
}

// Indian-style money: ₹1,299
function formatPrice(price) {
    return '₹' + Number(price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

const Catalog = (() => {
    let loading = null;
    let products = [];
    const variantIndex = new Map();

    const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

    function normalize(p) {
        const colors = (p.product_colors || [])
            .filter(c => c.is_active !== false)
            .sort(bySort)
            .map(c => ({
                id: c.id,
                name: c.name,
                hex: c.hex || '#cccccc',
                images: (Array.isArray(c.images) ? c.images : []).filter(Boolean),
                variants: (c.variants || []).sort(bySort).map(v => ({
                    id: v.id,
                    size: v.size,
                    stock: v.stock,
                    soldOut: !!v.is_sold_out || v.stock <= 0
                }))
            }));

        const sizes = [];
        colors.forEach(c => c.variants.forEach(v => { if (!sizes.includes(v.size)) sizes.push(v.size); }));
        const available = colors.some(c => c.variants.some(v => !v.soldOut));
        const cardColor = colors.find(c => c.images.length && c.variants.some(v => !v.soldOut)) || colors.find(c => c.images.length);

        return {
            id: p.id,
            name: p.name,
            shortName: p.short_name || p.name,
            shortDescription: p.short_description || '',
            category: p.category,
            price: p.price,
            // MRP is shown crossed out only when it is higher than the selling price
            mrp: p.mrp && p.mrp > p.price ? p.mrp : null,
            discountPct: p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0,
            description: p.description || '',
            specs: Array.isArray(p.specs) ? p.specs : [],
            care: p.care || '',
            specialNote: p.special_note || '',
            careNote: p.care_note || '',
            tag: p.tag || '',
            trustBadges: (Array.isArray(p.trust_badges) ? p.trust_badges : []).map(b => ({ icon: ICONS[b.icon] || '', label: b.label })),
            sizeLabel: p.size_label || '',
            sizeNote: p.size_note || '',
            isTest: !!p.is_test,
            isActive: p.is_active !== false,
            colors,
            sizes,
            available,
            image: (cardColor && cardColor.images[0]) || PLACEHOLDER_IMG
        };
    }

    async function load() {
        if (loading) return loading;
        loading = (async () => {
            const sb = getSupabase();
            if (!sb) throw new Error('Store is unavailable (Supabase library failed to load).');
            const { data, error } = await sb
                .from('products')
                .select('*, product_colors(*, variants(*))')
                .order('sort_order');
            if (error) throw error;
            products = data.map(normalize);
            variantIndex.clear();
            products.forEach(p => p.colors.forEach(c => c.variants.forEach(v => variantIndex.set(v.id, { product: p, color: c, variant: v }))));
            return products;
        })();
        loading.catch(() => { loading = null; });
        return loading;
    }

    return {
        load,
        // Shop-visible products (admins also receive hidden/test products from the DB, so filter them here)
        async all() {
            return (await load()).filter(p => p.isActive && !p.isTest);
        },
        async byCategory(category) {
            const cat = CATEGORY_ALIASES[category] || category;
            return (await this.all()).filter(p => p.category === cat);
        },
        async get(id) {
            const real = PRODUCT_ALIASES[id] || id;
            return (await load()).find(p => p.id === real) || null;
        },
        // { product, color, variant } for a cart line, or null if it no longer exists
        async findVariant(variantId) {
            await load();
            return variantIndex.get(variantId) || null;
        }
    };
})();

// Selling price, crossed-out MRP and "% off". Classes are styled in shop.css / product.html.
function priceHtml(p) {
    return `<span class="price-current">${formatPrice(p.price)}</span>` +
        (p.mrp ? ` <span class="price-original">${formatPrice(p.mrp)}</span> <span class="price-discount">${p.discountPct}% off</span>` : '');
}

// Shop grid card (category page)
function renderProductCard(p, index = 0) {
    const soldOut = !p.available;
    return `
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-card anim-reveal${soldOut ? ' is-soldout' : ''}" style="animation-delay: ${index * 0.1}s">
            <div class="product-card-image">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" onerror="imgFallback(this)">
                ${p.tag ? `<span class="product-card-tag">${escapeHtml(p.tag)}</span>` : ''}
                ${soldOut ? '<span class="product-card-soldout">Sold out</span>' : ''}
                <div class="product-card-quick">View →</div>
            </div>
            <div class="product-card-info">
                <h3 class="product-card-name">${escapeHtml(p.name)}</h3>
                <div class="product-card-price">${priceHtml(p)}</div>
            </div>
        </a>`;
}
