/* ======================================
   MRIGNAINI — PRODUCT CATALOG
   ====================================== */

const PRODUCTS = [
    // ---- SETS ----
    {
        id: 'set-001',
        name: 'Vrindavan Floral Set',
        category: 'sets',
        price: 3499,
        originalPrice: 4999,
        image: 'assets/images/set-floral-green.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'New Arrival',
        description: 'A charming coord set adorned with hand-carved floral motifs in forest green and soft pink. Crafted from breathable cotton using traditional dahi wash technique, this set is perfect for festive gatherings and casual elegance.',
        details: [
            'Fabric: 100% Hand-spun Cotton',
            'Print: Hand Block Printed',
            'Dye: Natural vegetable dyes',
            'Wash: Gentle hand wash recommended',
            'Includes: Top + Bottom set'
        ]
    },
    {
        id: 'set-002',
        name: 'Indigo Dreams Set',
        category: 'sets',
        price: 3799,
        originalPrice: 5499,
        image: 'assets/images/set-indigo-blue.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'Bestseller',
        description: 'Inspired by the ancient Dabu printing tradition, this set features mesmerising indigo patterns that echo the night sky. Each mark is hand-stamped with care by master artisans of Bagru village.',
        details: [
            'Fabric: Premium Mulmul Cotton',
            'Print: Dabu Hand Block Print',
            'Dye: Natural Indigo extract',
            'Wash: Cold hand wash, dry in shade',
            'Includes: Top + Bottom set'
        ]
    },
    {
        id: 'set-003',
        name: 'Rangeela Wine Set',
        category: 'sets',
        price: 4299,
        originalPrice: 5999,
        image: 'assets/images/set-maroon-gold.png',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Limited Edition',
        description: 'A regal coord set in deep wine with golden block-printed motifs that whisper of Mughal garden elegance. The rich tones come from madder root and pomegranate dye — no chemicals, only heritage.',
        details: [
            'Fabric: Fine Cotton Cambric',
            'Print: Hand Block Printed',
            'Dye: Madder root & Pomegranate',
            'Wash: Gentle hand wash, separate first wash',
            'Includes: Top + Bottom set'
        ]
    },

    // ---- TOPS ----
    {
        id: 'top-001',
        name: 'Gulabi Rose Top',
        category: 'tops',
        price: 1899,
        originalPrice: 2499,
        image: 'assets/images/top-block-pink.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'Bestseller',
        description: 'A delightful top in soft pink featuring delicate rose block prints — a nod to Jaipur\'s famed rose gardens. Pairs beautifully with palazzos, skirts, or your favourite jeans.',
        details: [
            'Fabric: Soft Cotton Voile',
            'Print: Hand Block Printed',
            'Dye: Natural lac dye (pink)',
            'Wash: Gentle hand wash',
            'Style: Relaxed fit, boat neck'
        ]
    },
    {
        id: 'top-002',
        name: 'Panna Leaf Top',
        category: 'tops',
        price: 1699,
        originalPrice: 2299,
        image: 'assets/images/top-sage-green.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'New Arrival',
        description: 'Inspired by the misty forests of the Aravalli hills, this sage green top features botanical leaf prints in a soothing palette. Perfect for everyday ethnic elegance.',
        details: [
            'Fabric: Organic Cotton',
            'Print: Hand Block Printed',
            'Dye: Natural plant-based dyes',
            'Wash: Machine wash gentle cycle',
            'Style: A-line, mandarin collar'
        ]
    },
    {
        id: 'top-003',
        name: 'Kesari Paisley Top',
        category: 'tops',
        price: 2099,
        originalPrice: 2799,
        image: 'assets/images/top-mustard.png',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Festive Pick',
        description: 'A vibrant mustard top with traditional paisley and floral motifs in rich red. The turmeric-dyed fabric carries warmth that deepens beautifully with every wash.',
        details: [
            'Fabric: Handwoven Khadi Cotton',
            'Print: Hand Block Printed',
            'Dye: Turmeric & Iron',
            'Wash: Cold hand wash only',
            'Style: Boxy fit, side slits'
        ]
    },

    // ---- KURTIS ----
    {
        id: 'kurti-001',
        name: 'Panna Emerald Kurti',
        category: 'kurtis',
        price: 2499,
        originalPrice: 3499,
        image: 'assets/images/kurti-emerald.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Bestseller',
        description: 'Our signature emerald kurti with intricate hand block printed florals — a celebration of Jaipur\'s lush Mughal gardens. The deep green comes from natural indigo blended with pomegranate.',
        details: [
            'Fabric: Premium Cotton Cambric',
            'Print: Hand Block Printed',
            'Dye: Indigo + Pomegranate blend',
            'Wash: Gentle hand wash, dry in shade',
            'Length: 44 inches, A-line cut'
        ]
    },
    {
        id: 'kurti-002',
        name: 'Chandni Rose Kurti',
        category: 'kurtis',
        price: 2299,
        originalPrice: 3199,
        image: 'assets/images/kurti-ivory-rose.png',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'New Arrival',
        description: 'An ethereal kurti in moonlit ivory, graced with delicate rose prints that bloom across the fabric. Lightweight and breathable — perfect for daytime celebrations.',
        details: [
            'Fabric: Fine Mulmul Cotton',
            'Print: Hand Block Printed (Sanganeri)',
            'Dye: Natural lac & alum',
            'Wash: Hand wash cold, iron while damp',
            'Length: 42 inches, straight cut'
        ]
    },
    {
        id: 'kurti-003',
        name: 'Neelam Teal Kurti',
        category: 'kurtis',
        price: 2699,
        originalPrice: 3699,
        image: 'assets/images/kurti-teal.png',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Limited Edition',
        description: 'A striking kurti in deep teal with geometric and floral block prints in gold and cream. The bold patterns draw from traditional Ajrakh printing — a craft over 4,000 years old.',
        details: [
            'Fabric: Pure Cotton Silk blend',
            'Print: Ajrakh Hand Block Print',
            'Dye: Natural indigo & iron rust',
            'Wash: Dry clean recommended',
            'Length: 46 inches, A-line with side slits'
        ]
    }
];

// Category metadata
const CATEGORIES = {
    sets: {
        name: 'Sets',
        fullName: 'Coord Sets',
        description: 'Matching coord sets handcrafted with traditional block printing — effortless ethnic elegance in every pairing.',
        banner: 'Perfectly Paired, Traditionally Printed'
    },
    tops: {
        name: 'Tops',
        fullName: 'Block Print Tops',
        description: 'Versatile handblock printed tops that bring Jaipur artistry to your everyday wardrobe.',
        banner: 'Effortless Style, Artisan Made'
    },
    kurtis: {
        name: 'Kurtis',
        fullName: 'Ethnic Kurtis',
        description: 'Timeless kurtis adorned with heritage prints — from Sanganeri florals to bold Ajrakh geometry.',
        banner: 'Heritage Prints, Modern Silhouettes'
    }
};

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

// Helper functions
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

function getProductsByCategory(category) {
    return PRODUCTS.filter(p => p.category === category);
}

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}
