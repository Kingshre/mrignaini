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
        id: 'top-basanti',
        name: 'Basanti Hand-Block Printed Cotton Wrap Top',
        category: 'tops',
        price: 1299,
        originalPrice: 1499,
        shipping: 99,
        // Default images (Blue variant shown by default)
        images: [
            'assets/images/basanti1.jpg',
            'assets/images/basanti2.jpg',
            'assets/images/basanti3.jpg',
            'assets/images/basanti4.jpg'
        ],
        image: 'assets/images/basanti1.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        tag: 'New Arrival',
        selectedColor: 'Blue',
        colorVariants: {
            'Blue': {
                images: [
                    'assets/images/basanti1.jpg',
                    'assets/images/basanti2.jpg',
                    'assets/images/basanti3.jpg',
                    'assets/images/basanti4.jpg'
                ],
                hex: '#4A7C9B'
            },
            'Rose Pink': {
                images: [
                    'assets/images/pinkbasanti1.jpg',
                    'assets/images/pinkbasanti2.jpg',
                    'assets/images/pinkbasanti3.jpg',
                    'assets/images/pinkbasanti4.jpg'
                ],
                hex: '#D4838F'
            }
        },
        description: 'The Basanti Hand-Block Printed Cotton Wrap Top is designed for effortless everyday elegance. Crafted in soft, breathable pure cotton, the top features delicate hand-block printed floral motifs inspired by traditional Jaipuri textiles.\n\nDesigned in a flattering wrap silhouette, the top ties securely with two tie-up strings — one inside for structure and one outside for the visible wrap detail, allowing the fit to be adjusted comfortably to your shape. The V-neckline enhances the feminine silhouette while keeping the look relaxed and easy to wear.\n\nLightweight, breathable, and versatile, this handcrafted piece moves easily between everyday moments — from college days to coffee outings — making it a staple for those who love traditional prints styled in modern silhouettes.\n\nAvailable in two beautiful colourways, Blue and Rose Pink, each highlighting the intricate hand-block printed patterns.',
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed',
            'Technique: Wrap Construction with Dual Tie-Up Detail',
            'Print: Floral Jaal Block Print',
            'Neckline: V-neck wrap neckline',
            'Sleeves: Three-quarter sleeves',
            'Fit: Adjustable wrap fit',
            'Length: Waist length'
        ],
        trustBadges: [
            { icon: '🌿', label: '100% Cotton' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '🪡', label: 'Wrap Construction' }
        ]
    },
    {
        id: 'dress-afsana',
        name: 'Afsana Hand-Block Printed Cotton Dress',
        category: 'dresses',
        price: 1499,
        originalPrice: 1699,
        shipping: 99,
        images: [
            'assets/images/afsana1.png',
            'assets/images/afsana2.png',
            'assets/images/afsana3.png',
            'assets/images/afsana4.png',
            'assets/images/afsana5.png'
        ],
        image: 'assets/images/afsana1.png',
        sizes: ['XS', 'S', 'M', 'L'],
        tag: 'New Arrival',
        description: 'The Afsana Hand-Block Printed Cotton Dress is a statement piece that blends traditional craft with a bold, contemporary silhouette. Crafted in breathable pure cotton, the dress features intricate hand-block printed patterns inspired by classic Jaipuri motifs.\n\nDesigned for both comfort and style, the relaxed yet flattering fit allows for easy movement while maintaining a structured look. The dress is perfect for everyday wear, casual outings, or styled-up moments, making it a versatile addition to your wardrobe.\n\nWith its vibrant print and effortless silhouette, Afsana captures the essence of modern Indian wear — rooted in tradition yet designed for today.',
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed',
            'Colour: Red / Rust printed base',
            'Neckline: Round neckline',
            'Sleeves: Sleeveless / slim strap style',
            'Fit: Relaxed fit',
            'Length: Knee length'
        ],
        trustBadges: [
            { icon: '\uD83C\uDF3F', label: '100% Cotton' },
            { icon: '\uD83C\uDFA8', label: 'Hand Block Printed' },
            { icon: '\u2728', label: 'Statement Piece' }
        ]
    },
    {
        id: 'set-afreen',
        name: 'Afreen Hand-Block Printed Indigo Cotton Skirt-Top Set',
        category: 'sets',
        price: 2000,
        originalPrice: 2200,
        shipping: 99,
        images: [
            'assets/images/afreen1.png',
            'assets/images/afreen2.png',
            'assets/images/afreen3.png',
            'assets/images/afreen4.png',
            'assets/images/afreen5.png',
            'assets/images/afreen6.png'
        ],
        image: 'assets/images/afreen1.png',
        sizes: ['36', '40'],
        sizeLabel: 'Select Top Size',
        sizeNote: 'Skirt is Free Size — fits all',
        tag: 'New Arrival',
        description: 'Afreen is a soulful celebration of craft and silhouette. Dipped in the deepest hues of natural indigo, this handcrafted set features intricate Sanganeri block prints that tell a story of heritage. The tiered skirt offers a dramatic flare for every twirl moment, while the square-neck top\u2014designed with a functional drawstring back\u2014allows for an adjustable fit that beautifully cinches the waist.',
        detailSections: [
            {
                title: 'Afreen Top',
                items: [
                    'Square neckline',
                    'Sleeveless',
                    'Adjustable drawstring back-tie',
                    'Waist-length cropped silhouette',
                    'Indigo blue with Sanganeri print'
                ]
            },
            {
                title: 'Afreen Skirt',
                items: [
                    'High-waisted',
                    'Tiered flare',
                    'Full-length maxi',
                    'Gota trim at hem',
                    'Indigo blue with Sanganeri print'
                ]
            }
        ],
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed',
            'Print: Sanganeri Block Print',
            'Dye: Natural Indigo',
            'Set includes: Top + Skirt'
        ],
        careNote: 'This garment is dyed using natural indigo. Colour bleeding during initial washes is normal. Hand wash separately in cold water and dry in shade.',
        trustBadges: [
            { icon: '\uD83C\uDF3F', label: '100% Cotton' },
            { icon: '\uD83C\uDFA8', label: 'Sanganeri Print' },
            { icon: '\uD83E\uDDF5', label: 'Natural Indigo' }
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
    },
    dresses: {
        name: 'Dresses',
        fullName: 'Block Print Dresses',
        description: 'Statement dresses that blend traditional hand-block printing with contemporary silhouettes — for every occasion.',
        banner: 'Wear the Art'
    },
    sets: {
        name: 'Sets',
        fullName: 'Block Print Sets',
        description: 'Coordinated sets that pair handcrafted block-printed tops and bottoms for a complete, effortless look.',
        banner: 'Complete the Look'
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
