/* ======================================
   MRIGNAINI — PRODUCT CATALOG
   ====================================== */

const PRODUCTS = [
    {
        id: 'top-iktara',
        name: 'Iktara Indigo Hand-Block Printed Cotton Peplum Top',
        category: 'tops',
        price: 1399,
        originalPrice: 1599,
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
            'Dye: Indigo',
            'Style: Peplum silhouette',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        trustBadges: [
            { icon: '🌿', label: '100% Cotton' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '💙', label: 'Indigo Dyed' }
        ]
    },
    {
        id: 'layer-paltu',
        name: 'Paltu Reversible Patchwork Cotton Jacket',
        category: 'layers',
        price: 1000,
        originalPrice: 1199,
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
        tag: 'Upcycled',
        description: 'The Paltu Reversible Upcycled Patchwork Cotton Jacket is a playful statement layer that celebrates craft, colour, and conscious fashion. Handcrafted in breathable pure cotton, the jacket features a striking patchwork design where different hand-block printed fabrics come together to create a vibrant, one-of-a-kind composition.\n\nEach piece is completely unique and reversible — flip it inside out to reveal a new combination of prints, giving you two distinct looks in one garment.\n\nMade using carefully selected leftover fabrics from handcrafted pieces, this jacket embraces an upcycled design philosophy, ensuring beautiful textiles are repurposed rather than wasted.\n\nLightweight yet statement-making, it layers effortlessly over shirts, dresses, kurtas, or denims.',
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed Patchwork',
            'Technique: Reversible Construction',
            'Sustainability: Upcycled',
            'Colour: Multicolour Patchwork',
            'Neckline: Round neck with soft gathered collar',
            'Sleeves: Sleeveless',
            'Fit: Relaxed fit',
            'Length: Waist length',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
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
        price: 1499,
        originalPrice: 1699,
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
            'Length: Waist length',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        trustBadges: [
            { icon: '🌿', label: '100% Cotton' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '🪡', label: 'Wrap Construction' }
        ]
    },
    {
        id: 'top-basanti-pink',
        name: 'Basanti Hand-Block Printed Cotton Wrap Top — Rose Pink',
        category: 'tops',
        price: 1499,
        originalPrice: 1699,
        images: [
            'assets/images/pinkbasanti1.jpg',
            'assets/images/pinkbasanti2.jpg',
            'assets/images/pinkbasanti3.jpg',
            'assets/images/pinkbasanti4.jpg'
        ],
        image: 'assets/images/pinkbasanti1.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        tag: 'New Arrival',
        selectedColor: 'Rose Pink',
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
            'Length: Waist length',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        trustBadges: [
            { icon: '🌿', label: '100% Cotton' },
            { icon: '🎨', label: 'Hand Block Printed' },
            { icon: '🪡', label: 'Wrap Construction' }
        ]
    },
    {
        id: 'top-dopatti',
        name: 'Do Patti Upcycled Spaghetti Strap Top',
        category: 'tops',
        price: 699,
        originalPrice: 899,
        images: [
            'assets/images/dopatti1.jpg',
            'assets/images/dopatti2.jpg',
            'assets/images/dopatti3.jpg',
            'assets/images/dopatti4.jpg'
        ],
        image: 'assets/images/dopatti1.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        tag: 'Upcycled',
        description: 'The Do Patti Upcycled Spaghetti Strap Top is a celebration of sustainable fashion and artisanal craft. Handcrafted using carefully repurposed hand-block printed cotton offcuts, each top is a unique patchwork of heritage prints.\n\nThe relaxed spaghetti strap silhouette keeps it breezy and effortless, making it perfect for layering with jackets or wearing solo on warm days. Each piece is one-of-a-kind — embracing the beauty of imperfection and circular fashion.',
        details: [
            'Fabric: 100% Pure Cotton (Upcycled)',
            'Craft: Hand Block Printed Patchwork',
            'Sustainability: Upcycled from leftover fabrics',
            'Strap: Adjustable spaghetti straps',
            'Fit: Relaxed fit',
            'Length: Waist length',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        specialNote: 'Every piece is unique. The patchwork design may vary slightly from the images.',
        trustBadges: [
            { icon: '♻️', label: 'Upcycled' },
            { icon: '🌿', label: '100% Cotton' },
            { icon: '✨', label: 'One-of-a-Kind' }
        ]
    },
    {
        id: 'kurti-afsana',
        name: 'Afsana Hand-Block Printed Cotton Corset Kurti Top',
        category: 'kurtis',
        price: 850,
        originalPrice: 1099,
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
        description: 'The Afsana Hand-Block Printed Cotton Corset Kurti Top is a statement piece that blends traditional craft with a bold, contemporary silhouette. Crafted in breathable pure cotton, the kurti features intricate hand-block printed patterns inspired by classic Jaipuri motifs.\n\nDesigned for both comfort and style, the fitted silhouette with corset drawstring detailing allows for an adjustable, flattering fit while maintaining a structured look. Perfect for everyday wear, casual outings, or styled-up moments, making it a versatile addition to your wardrobe.\n\nWith its vibrant print and effortless silhouette, Afsana captures the essence of modern Indian wear — rooted in tradition yet designed for today.',
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed',
            'Colour: Red / Rust printed base',
            'Neckline: Straight-cut neckline',
            'Sleeves: Sleeveless / slim strap style',
            'Fit: Fitted with corset drawstring',
            'Length: Little below hip',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        trustBadges: [
            { icon: '\uD83C\uDF3F', label: '100% Cotton' },
            { icon: '\uD83C\uDFA8', label: 'Hand Block Printed' },
            { icon: '\u2728', label: 'Statement Piece' }
        ]
    },
    {
        id: 'set-afreen',
        name: 'Afreen Hand-Block Printed Blue Cotton Skirt-Top Set',
        category: 'sets',
        price: 2200,
        originalPrice: 2499,
        images: [
            'assets/images/afreen1.png',
            'assets/images/afreen2.png',
            'assets/images/afreen3.png',
            'assets/images/afreen4.png',
            'assets/images/afreen5.png',
            'assets/images/afreen6.png'
        ],
        image: 'assets/images/afreen1.png',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        sizeLabel: 'Select Top Size',
        sizeNote: 'Skirt is Free Size — fits all',
        tag: 'Exclusive Drop',
        description: 'Afreen is a soulful celebration of craft and silhouette. Dipped in the deepest hues of blue dye, this handcrafted set features intricate Sanganeri block prints that tell a story of heritage. The tiered skirt offers a dramatic flare for every twirl moment, while the square-neck top\u2014designed with a functional drawstring back\u2014allows for an adjustable fit that beautifully cinches the waist.',
        detailSections: [
            {
                title: 'Afreen Top',
                items: [
                    'Square neckline',
                    'Sleeveless',
                    'Adjustable drawstring back-tie',
                    'Waist-length cropped silhouette',
                    'Blue with Sanganeri print'
                ]
            },
            {
                title: 'Afreen Skirt',
                items: [
                    'High-waisted',
                    'Tiered flare',
                    'Full-length maxi',
                    'Gota trim at hem',
                    'Blue with Sanganeri print'
                ]
            }
        ],
        details: [
            'Fabric: 100% Pure Cotton',
            'Craft: Hand Block Printed',
            'Print: Sanganeri Block Print',
            'Dye: Blue dye',
            'Set includes: Top + Skirt',
            'Wash & Care: Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.'
        ],
        careNote: 'This garment is dyed using blue dye. Colour bleeding during initial washes is normal. Hand wash separately in cold water and dry in shade.',
        trustBadges: [
            { icon: '\uD83C\uDF3F', label: '100% Cotton' },
            { icon: '\uD83C\uDFA8', label: 'Sanganeri Print' },
            { icon: '\uD83D\uDC99', label: 'Blue Dyed' }
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
    kurtis: {
        name: 'Kurtis',
        fullName: 'Block Print Kurtis',
        description: 'Statement kurtis that blend traditional hand-block printing with contemporary silhouettes — for every occasion.',
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
        ['L',  '38', '32', '40', '41-43'],
        ['XL', '40', '34', '42', '42-44'],
        ['XXL','42', '36', '44', '43-45']
    ]
};

// Helper functions
function getProductById(id) {
    // Support legacy 'dress-afsana' ID redirect to 'kurti-afsana'
    if (id === 'dress-afsana') id = 'kurti-afsana';
    return PRODUCTS.find(p => p.id === id);
}

function getProductsByCategory(category) {
    // Support legacy 'dresses' category redirect to 'kurtis'
    if (category === 'dresses') category = 'kurtis';
    return PRODUCTS.filter(p => p.category === category);
}

function getAllProducts() {
    return PRODUCTS;
}

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}
