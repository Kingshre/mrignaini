/* ======================================
   MRIGNAINI — PRODUCT CATALOG
   ====================================== */

const PRODUCTS = [
    {
        id: 'top-iktara',
        name: 'Iktara Indigo Hand-Block Printed Cotton Peplum Top',
        category: 'tops',
        price: 1200,
        originalPrice: 1399,
        shipping: 99,
        images: [
            'assets/images/iktaratop1.jpg',
            'assets/images/iktaratop2.jpg',
            'assets/images/iktaratop3.jpg',
            'assets/images/iktaratop4.jpg'
        ],
        image: 'assets/images/iktaratop1.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        tag: 'New Arrival',
        description: 'The Iktara Indigo Hand-Block Printed Cotton Peplum Top blends traditional craft with a playful silhouette. Made from soft, breathable cotton and adorned with hand-stamped indigo motifs by Jaipur artisans, this peplum top is perfect for casual outings, festive occasions, or everyday ethnic charm.',
        details: [
            'Fabric: 100% Cotton',
            'Print: Hand Block Printed',
            'Dye: Natural Indigo',
            'Wash: Gentle hand wash recommended',
            'Style: Peplum silhouette'
        ],
        trustBadges: [
            { icon: '🌿', label: '100% Cotton' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '🧿', label: 'Natural Indigo' }
        ]
    },
    {
        id: 'layer-paltu',
        name: 'Paltu Reversible Patchwork Cotton Jacket',
        category: 'layers',
        price: 1000,
        originalPrice: 1199,
        shipping: 99,
        images: [
            'assets/images/paltujacket1.jpg',
            'assets/images/paltujacket2.jpg',
            'assets/images/paltujacket3.jpg',
            'assets/images/paltujacket4.jpg',
            'assets/images/paltujacket5.jpg',
            'assets/images/paltujacket6.jpg'
        ],
        image: 'assets/images/paltujacket1.jpg',
        sizes: ['Free Size'],
        tag: 'Handcrafted',
        description: 'The Paltu Reversible Upcycled Patchwork Cotton Jacket is a playful statement layer that celebrates craft, colour, and conscious fashion. Handcrafted in breathable pure cotton, the jacket features a striking patchwork design where different hand-block printed fabrics come together to create a vibrant, one-of-a-kind composition.\n\nEach piece is completely unique and reversible — flip it inside out to reveal a new combination of prints, giving you two distinct looks in one garment.\n\nMade using carefully selected leftover fabrics from handcrafted pieces, this jacket embraces an upcycled design philosophy, ensuring beautiful textiles are repurposed rather than wasted.\n\nLightweight yet statement-making, it layers effortlessly over shirts, dresses, kurtas, or denims.',
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed Patchwork',
            'Technique: Reversible Construction',
            'Sustainability: Upcycled',
            'Colour: Multicolour Patchwork',
            'Neckline: High neck with soft gathered collar',
            'Sleeves: Sleeveless',
            'Fit: Relaxed fit',
            'Length: Waist length'
        ],
        specialNote: 'Every piece is unique. The design may vary slightly from the images.',
        trustBadges: [
            { icon: '♻️', label: 'Upcycled' },
            { icon: '🔄', label: 'Reversible' },
            { icon: '🌿', label: '100% Cotton' }
        ]
    },
    {
        id: 'top-dopatti',
        name: 'Do Patti Upcycled Spaghetti Strap Top',
        category: 'tops',
        price: 700,
        originalPrice: 899,
        shipping: 99,
        images: [
            'assets/images/dopatti1.png',
            'assets/images/dopatti2.png',
            'assets/images/dopatti3.png',
            'assets/images/dopatti4.png',
            'assets/images/dopatti5.png',
            'assets/images/dopatti6.png',
            'assets/images/dopatti7.png'
        ],
        image: 'assets/images/dopatti1.png',
        sizes: ['Free Size'],
        tag: 'One-of-a-Kind',
        description: 'The Do Patti Upcycled Spaghetti Strap Top is a bold, playful piece crafted from carefully repurposed textiles. Each top is made using unique combinations of hand-block printed fabrics, making every piece completely one-of-a-kind.\n\nDesigned with a flattering silhouette and lightweight cotton feel, this top blends traditional prints with a modern, effortless style — perfect for everyday wear, layering, or statement looks.',
        details: [
            'Fabric: 100% Cotton (Upcycled)',
            'Craft: Hand Block Printed',
            'Technique: Upcycled Construction',
            'Fit: Relaxed fit',
            'Style: Spaghetti strap'
        ],
        specialNote: 'Every piece is unique. No two tops are the same.',
        trustBadges: [
            { icon: '♻️', label: 'Upcycled' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '🌿', label: '100% Cotton' }
        ]
    }
];

// Category metadata
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
    }
};

// Size guide data
const SIZE_GUIDE = {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    rows: [
        ['XS', '32', '26', '34', '38-40'],
        ['S',  '34', '28', '36', '39-41'],
        ['M',  '36', '30', '38', '40-42'],
        ['L',  '38', '32', '40', '41-43']
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
