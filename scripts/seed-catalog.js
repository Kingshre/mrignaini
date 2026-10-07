/* ======================================
   One-time catalog seed → Supabase
   Usage:  node scripts/seed-catalog.js            (add anything missing)
           node scripts/seed-catalog.js --update   (also overwrite product text/prices/photos)
   Safe to re-run: products, colours and variants are matched by id / name,
   never duplicated, and existing stock counts are never overwritten.
   Content source: products-catalog.txt
   ====================================== */
require('dotenv').config({ quiet: true });
const { createClient } = require('@supabase/supabase-js');

const UPDATE = process.argv.includes('--update');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const img = (prefix, n, ext = 'jpg') => Array.from({ length: n }, (_, i) => `assets/images/${prefix}${i + 1}.${ext}`);
const DEFAULT_STOCK = 5;   // where real stock isn't known yet (see TODO list)

const STANDARD_CARE = 'Treat your handcrafted piece to a gentle hand wash in cold water. Dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.';
const CORSET_CARE = 'Treat your handcrafted piece to a gentle hand wash in cold water. Reshape the corset ties while damp and dry in the shade to preserve the artisanal vibrancy of the hand-blocked prints.';
const ONE_OF_A_KIND = 'Each piece is one-of-a-kind; the print you receive may differ from the photos.';

const KURTI_LOVE = {
    title: 'Why You’ll Love It',
    items: [
        'Artisanal Heritage: Authentically hand-block printed by artisans in Sanganer, Jaipur.',
        'Customizable Fit: The criss-cross corset back isn’t just for show — it ensures the top fits you perfectly.',
        'Eco-Chic: Made from pure cotton that gets softer with every wash.',
        'Styling Tip: Pair it with distressed denims and oxidized silver jewelry for that ultimate “Indie-cool” look, or style it with wide-leg palazzos for a more refined ethnic feel.'
    ]
};
const KURTI_FABRIC = {
    title: 'Fabric & Artistry',
    items: ['Fabric: 100% Pure Premium Cotton', 'Craft: Handcrafted Fusion Wear', 'Technique: Traditional Hand-Block Printing', 'Print: Sanganeri Floral Pattern']
};

// colours: { name, hex, images, stock: number | { size: number } }
const CATALOG = [
    {
        id: 'top-iktara',
        name: 'Iktara Indigo Hand-Block Printed Cotton Peplum Top',
        short_name: 'Iktara Indigo Peplum Top',
        short_description: 'Hand-block printed cotton peplum top with traditional indigo motifs',
        category: 'tops', price: 1200, mrp: 1399, tag: 'New Arrival',
        description: 'The Iktara Indigo Hand-Block Printed Cotton Peplum Top blends traditional craft with a playful silhouette. Crafted in breathable pure cotton, the top features intricate hand-block printed floral patterns on the bodice paired with delicate buti motifs across the peplum panel, creating a beautiful contrast of prints.\n\nThe gathered empire waist adds soft volume and movement, while the printed yoke panel and three-quarter sleeves with border detailing enhance its handcrafted charm. Finished in rich indigo with ivory block prints, this versatile piece pairs effortlessly with skirts, palazzos, or matching bottoms for an easy everyday ethnic look.',
        specs: [
            { title: 'Product Specifications', items: ['Neckline: Round neckline with printed yoke panel', 'Sleeves: Three-quarter sleeves with printed borders', 'Fit: Relaxed peplum fit', 'Colour: Indigo blue with ivory accents', 'Print: Hand-block printed floral and buti mix', 'Length: Hip length'] },
            { title: 'Fabric & Craft', items: ['Fabric: 100% Pure Cotton', 'Craft: Hand Block Printed', 'Colour: Indigo Blue & Ivory'] }
        ],
        care: STANDARD_CARE,
        trust_badges: [{ icon: 'cotton', label: '100% Cotton' }, { icon: 'print', label: 'Hand Block Printed' }, { icon: 'indigo', label: 'Indigo Dyed' }],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [{ name: 'Indigo Blue', hex: '#2E3F6E', images: img('iktaratop', 4), stock: DEFAULT_STOCK }]
    },
    {
        id: 'layer-paltu',
        name: 'Paltu Reversible Patchwork Cotton Jacket',
        short_name: 'Paltu Reversible Jacket',
        short_description: 'Upcycled patchwork cotton jacket — reversible, one-of-a-kind',
        category: 'layers', price: 1000, mrp: 1199, tag: 'Upcycled',
        description: 'The Paltu Reversible Upcycled Patchwork Cotton Jacket is a playful statement layer that celebrates craft, colour and conscious fashion. Handcrafted in breathable pure cotton, the jacket features a striking half-and-half patchwork design where different hand-block printed fabrics meet to create a vibrant, one-of-a-kind composition.\n\nEach side combines multiple prints, giving the piece four distinct textile patterns in one look. Designed to be fully reversible, simply flip the jacket inside out to reveal another set of beautifully coordinated prints — creating two completely different styling options in a single garment.\n\nWhy this piece is special?\n\nMade using carefully selected leftover fabrics from other handcrafted pieces, the Paltu Jacket follows an upcycled design philosophy, ensuring beautiful textiles are repurposed rather than wasted. Lightweight yet statement-making, it layers effortlessly over shirts, dresses, kurtas or denims for an easy everyday look with a bold handcrafted edge.',
        specs: [
            { title: 'Product Specifications', items: ['Neckline: High neck with soft gathered collar', 'Sleeves: Sleeveless', 'Fit: Relaxed fit jacket', 'Colour: Multicolour patchwork', 'Print: Hand-block printed mixed patchwork', 'Length: Waist length'] },
            { title: 'Fabric & Craft', items: ['Fabric: 100% Pure Cotton', 'Craft: Hand Block Printed Patchwork', 'Technique: Reversible Construction', 'Sustainability: Upcycled from leftover handcrafted fabrics', 'Colour: Multicolour Patchwork'] }
        ],
        care: STANDARD_CARE,
        special_note: ONE_OF_A_KIND,
        trust_badges: [{ icon: 'upcycled', label: 'Upcycled' }, { icon: 'wrap', label: 'Reversible' }, { icon: 'cotton', label: '100% Cotton' }],
        sizes: ['Free Size'],
        colors: [{ name: 'Multicolour Patchwork', hex: '#B5653A', images: img('paltujacket', 6), stock: 1 }]
    },
    {
        id: 'top-basanti',
        name: 'Basanti Hand-Block Printed Cotton Wrap Top',
        short_name: 'Basanti Cotton Wrap Top',
        short_description: 'Hand-block printed cotton wrap top with floral Jaal print — available in Blue & Rose Pink',
        category: 'tops', price: 1299, mrp: 1499, tag: 'New Arrival',
        description: 'The Basanti Hand-Block Printed Cotton Wrap Top is designed for effortless everyday elegance. Crafted in soft, breathable pure cotton, the top features delicate hand-block printed floral motifs inspired by traditional Jaipuri textiles.\n\nDesigned in a flattering wrap silhouette, the top ties securely with two tie-up strings — one inside for structure and one outside for the visible wrap detail, allowing the fit to be adjusted comfortably to your shape. The V-neckline enhances the feminine silhouette while keeping the look relaxed and easy to wear.\n\nLightweight, breathable, and versatile, this handcrafted piece moves easily between everyday moments — from college days to coffee outings — making it a staple for those who love traditional prints styled in modern silhouettes.\n\nAvailable in two beautiful colourways, Indigo Blue and Rose Pink, each highlighting the intricate hand-block printed patterns.',
        specs: [
            { title: 'Product Specifications', items: ['Neckline: V-neck wrap neckline', 'Sleeves: Three-quarter sleeves', 'Fit: Adjustable wrap fit', 'Colour: Blue / Rose Pink', 'Print: Hand-block printed floral jaal', 'Length: Waist length'] },
            { title: 'Fabric & Craft', items: ['Fabric: 100% Pure Cotton', 'Craft: Hand Block Printed', 'Technique: Wrap Construction with Dual Tie-Up Detail', 'Print: Floral Jaal Block Print', 'Colours: Blue / Rose Pink'] }
        ],
        care: STANDARD_CARE,
        trust_badges: [{ icon: 'cotton', label: '100% Cotton' }, { icon: 'print', label: 'Hand Block Printed' }, { icon: 'wrap', label: 'Wrap Construction' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        // 25 per colour, split evenly across 5 sizes
        colors: [
            { name: 'Blue', hex: '#4A7C9B', images: img('basanti', 4), stock: 5 },
            { name: 'Rose Pink', hex: '#D4838F', images: img('pinkbasanti', 4), stock: 5 }
        ]
    },
    {
        id: 'top-dopatti',
        name: 'Do Patti Spaghetti Top',          // placeholder — final name TBD (TODO)
        short_name: 'Do Patti Spaghetti Top',
        short_description: 'Upcycled hand-block printed spaghetti strap top — unique, sustainable',
        category: 'tops', price: 700, mrp: 899, tag: 'Upcycled',
        // Not in products-catalog.txt yet: carried over from the current site (TODO)
        description: 'The Do Patti Upcycled Spaghetti Strap Top is a celebration of sustainable fashion and artisanal craft. Handcrafted using carefully repurposed hand-block printed cotton offcuts, each top is a unique patchwork of heritage prints.\n\nThe relaxed spaghetti strap silhouette keeps it breezy and effortless, making it perfect for layering with jackets or wearing solo on warm days. Each piece is one-of-a-kind — embracing the beauty of imperfection and circular fashion.',
        specs: [
            { title: 'Product Specifications', items: ['Fabric: 100% Pure Cotton (Upcycled)', 'Craft: Hand Block Printed Patchwork', 'Sustainability: Upcycled from leftover fabrics', 'Strap: Adjustable spaghetti straps', 'Fit: Relaxed fit', 'Length: Waist length'] }
        ],
        care: STANDARD_CARE,
        special_note: ONE_OF_A_KIND,
        trust_badges: [{ icon: 'upcycled', label: 'Upcycled' }, { icon: 'cotton', label: '100% Cotton' }, { icon: 'statement', label: 'One-of-a-Kind' }],
        sizes: ['Free Size'],                    // placeholder — sizes TBD (TODO)
        colors: [{ name: 'Multicolour Patchwork', hex: '#9C5A3C', images: [...img('dopatti', 7, 'png'), 'assets/images/dopatti8.jpg'], stock: 1 }]
    },
    {
        id: 'kurti-afsana',                      // id kept so old links and Rhea's order still resolve
        name: 'Afsana Handcrafted Cotton Corset Kurti Top',
        short_name: 'Afsana Corset Kurti Top',
        short_description: 'Hand-block printed cotton corset kurti top with a tie-up back — in four colours',
        category: 'tops', price: 650, mrp: 850, tag: 'New Arrival',
        description: 'Meet Afsana. This isn’t your average ethnic top; it’s a bold reimagining of Sanganeri craft for the girl who respects her roots but loves a bit of rebellion.\n\nCrafted from 100% pure, breathable cotton, the Afsana Kurti features a clean, straight-cut front that keeps things classic. But turn around, and you’ll find the “problem” — a provocative, adjustable corset-style tie-up back that lets you cinch the waist for a perfectly sculpted silhouette.\n\nFinished with delicate spaghetti straps and traditional floral buta motifs, it’s designed to transition effortlessly from a college campus to a sunset concert.',
        specs: [
            { title: 'Product Specifications', items: ['Neckline: Elegant straight-cut neckline', 'Sleeves: Sleeveless (delicate spaghetti straps)', 'Fit: Adjustable fit with a corset-style tie-up back', 'Length: Short kurti / hip length'] },
            KURTI_FABRIC,
            KURTI_LOVE
        ],
        care: CORSET_CARE,
        trust_badges: [{ icon: 'cotton', label: '100% Cotton' }, { icon: 'print', label: 'Hand Block Printed' }, { icon: 'statement', label: 'Statement Piece' }],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Red', hex: '#A0312D', images: [...img('afsana', 5, 'png'), 'assets/images/afsana6.jpg'], stock: DEFAULT_STOCK },
            { name: 'Wine', hex: '#6E1F33', images: img('afsanawine', 3), stock: DEFAULT_STOCK },
            { name: 'Mustard', hex: '#C9962B', images: img('afsanamustard', 5), stock: DEFAULT_STOCK },
            { name: 'Pine', hex: '#2F4F3A', images: img('afsanapine', 2), stock: DEFAULT_STOCK }
        ]
    },
    {
        id: 'top-doriyaan',
        name: 'Doriyaan Handcrafted Cotton Halter Backless Kurti Top',
        short_name: 'Doriyaan Halter Kurti Top',
        short_description: 'Halter-neck, backless hand-block printed cotton kurti top — in five colours',
        category: 'tops', price: 650, mrp: 850, tag: 'New Arrival',
        // products-catalog.txt has no description paragraph for Doriyaan; this is written from its specs (TODO)
        description: 'Doriyaan is a halter-neck, backless kurti top hand-block printed by artisans in Sanganer, Jaipur. Crafted in 100% pure cotton with a V-cut neckline, it features an adjustable corset-style tie-up back so you can fit it perfectly to your shape.',
        specs: [
            { title: 'Product Specifications', items: ['Neckline: V-cut neckline', 'Sleeves: Sleeveless and backless', 'Fit: Adjustable fit with a corset-style tie-up back and halter neck', 'Length: Short kurti / hip length'] },
            KURTI_FABRIC,
            KURTI_LOVE
        ],
        care: CORSET_CARE,
        trust_badges: [{ icon: 'cotton', label: '100% Cotton' }, { icon: 'print', label: 'Hand Block Printed' }, { icon: 'statement', label: 'Statement Piece' }],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Wine', hex: '#6E1F33', images: img('doriyaanwine', 2), stock: DEFAULT_STOCK },
            { name: 'Raven', hex: '#1F1F24', images: img('doriyaanraven', 3), stock: DEFAULT_STOCK },
            { name: 'Royal Blue', hex: '#2747A0', images: img('doriyaanroyalblue', 4), stock: DEFAULT_STOCK },
            { name: 'Mustard', hex: '#C9962B', images: img('doriyaanmustard', 2), stock: DEFAULT_STOCK },
            // Sold out in every size except L
            { name: 'Pine', hex: '#2F4F3A', images: img('doriyaanpine', 2), stock: { XS: 0, S: 0, M: 0, L: DEFAULT_STOCK } }
        ]
    },
    {
        id: 'set-afreen',
        name: 'Afreen Hand-block Printed Indigo Cotton Skirt-Top Set',
        short_name: 'Afreen Indigo Skirt-Top Set',
        short_description: 'Natural indigo Sanganeri block-printed cotton set — tiered skirt + drawstring crop top',
        category: 'sets', price: 2000, mrp: 2200, tag: 'Exclusive Drop',
        description: 'Afreen is a soulful celebration of craft and silhouette. Dipped in the deepest hues of natural indigo, this handcrafted set features intricate Sanganeri block prints that tell a story of heritage. The tiered skirt offers a dramatic flare for every “twirl” moment, while the square-neck top — designed with a functional drawstring back — allows for an adjustable fit that beautifully cinches the waist. The handcrafted indigo set, a favourite for every season.',
        specs: [
            { title: 'Afreen Top', items: ['Neckline: Elegant square neckline', 'Sleeves: Chic sleeveless cut', 'Fit: Adjustable drawstring back-tie for a customizable fit, allowing you to cinch the waist to your preference', 'Colour: Natural Indigo Blue', 'Print: Hand-block printed Sanganeri floral motifs', 'Length: Waist-length cropped silhouette'] },
            { title: 'Afreen Skirt', items: ['Fit: High-waisted with a voluminous, tiered flare', 'Colour: Natural Indigo Blue', 'Print: Hand-block printed Sanganeri floral motifs', 'Length: Full-length maxi skirt with tiered panels and gota trim at the hem'] },
            { title: 'Fabric & Artistry', items: ['Fabric: 100% Pure Premium Cotton', 'Craft: Sustainable Handcrafted Ethnic Wear', 'Technique: Traditional Hand-Block Printing', 'Print: Sanganeri Floral Pattern'] }
        ],
        care: 'We recommend a gentle hand wash separately in cold water with a mild detergent. Dry in shade to maintain the vibrancy of the blue.',
        care_note: 'This garment is dyed using natural indigo. Authentic indigo is prone to “bleeding” or colour rubbing for the first few washes — this is a hallmark of the natural dyeing process, not a defect. Hand wash separately in cold water.',
        trust_badges: [{ icon: 'cotton', label: '100% Cotton' }, { icon: 'print', label: 'Sanganeri Print' }, { icon: 'indigo', label: 'Natural Indigo' }],
        size_label: 'Select Top Size',
        size_note: 'Skirt is Free Size — fits all',
        sizes: ['36', '40'],
        colors: [{ name: 'Natural Indigo', hex: '#24345F', images: img('afreen', 7, 'png'), stock: DEFAULT_STOCK }]
    },
    {
        id: 'test-product',
        name: 'Test Product (do not ship)',
        category: 'test', price: 2, is_test: true,
        description: 'Hidden admin-only product for testing the payment and order flow end-to-end.',
        specs: [], trust_badges: [],
        sizes: ['Free Size'],
        colors: [{ name: 'Test', hex: '#999999', images: ['assets/images/iktaratop1.jpg'], stock: 99 }]
    }
];

async function main() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env');

    for (const [index, p] of CATALOG.entries()) {
        const { colors, sizes, ...fields } = p;
        const row = {
            mrp: null, short_name: null, short_description: null, care: null, special_note: null, care_note: null,
            tag: null, size_label: null, size_note: null, is_test: false, is_active: true,
            ...fields, sort_order: index + 1
        };

        const { data: existing } = await supabase.from('products').select('id').eq('id', p.id).maybeSingle();
        if (!existing || UPDATE) {
            const { error } = await supabase.from('products').upsert(row);
            if (error) throw new Error(`${p.id}: ${error.message}`);
        }
        for (const [ci, c] of colors.entries()) {
            let { data: color } = await supabase.from('product_colors').select('id').eq('product_id', p.id).eq('name', c.name).maybeSingle();
            if (!color) {
                const res = await supabase.from('product_colors')
                    .insert({ product_id: p.id, name: c.name, hex: c.hex, images: c.images, sort_order: ci + 1 })
                    .select('id').single();
                if (res.error) throw new Error(`${p.id}/${c.name}: ${res.error.message}`);
                color = res.data;
            } else if (UPDATE) {
                const { error } = await supabase.from('product_colors').update({ hex: c.hex, images: c.images, sort_order: ci + 1 }).eq('id', color.id);
                if (error) throw new Error(`${p.id}/${c.name}: ${error.message}`);
            }

            // Variants: insert only the missing ones, never touch existing stock
            const variants = sizes.map((size, si) => ({
                product_id: p.id, color_id: color.id, size, sort_order: si + 1,
                stock: typeof c.stock === 'number' ? c.stock : (c.stock[size] ?? 0)
            }));
            const { error } = await supabase.from('variants').upsert(variants, { onConflict: 'color_id,size', ignoreDuplicates: true });
            if (error) throw new Error(`${p.id}/${c.name} variants: ${error.message}`);
        }
        console.log(`✓ ${p.id} — ${colors.length} colour(s) × ${sizes.length} size(s)`);
    }

    // Summary straight from the DB
    const { data: rows, error } = await supabase.from('products').select('id, price, mrp, is_active, is_test, product_colors(name, images, variants(size, stock))').order('sort_order');
    if (error) throw error;
    console.log('\nCatalog now in Supabase:');
    for (const r of rows) {
        const colours = r.product_colors.map(c => `${c.name} [${c.variants.map(v => `${v.size}:${v.stock}`).join(' ')}] ${c.images.length} photos`).join(' | ');
        console.log(`  ${r.id} ₹${r.price}${r.mrp ? ` (MRP ₹${r.mrp})` : ''}${r.is_test ? ' (test, admin-only)' : ''} — ${colours}`);
    }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
