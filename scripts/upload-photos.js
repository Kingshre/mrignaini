/* ======================================
   One-time photo migration → Supabase Storage ("product-images", public)
   Usage:  node scripts/upload-photos.js            (upload + update the DB)
           node scripts/upload-photos.js --dry-run  (show what would happen)

   For every product colour whose photos still point at local files
   (assets/images/...), each photo is resized to max 1600px, converted to WebP,
   uploaded as <product>/<colour>/<name>-<hash>.webp, and the colour's image
   list is replaced with the public URLs (same order: first = card image).
   Safe to re-run: photos already in Storage are skipped.
   ====================================== */
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'product-images';
const MAX_EDGE = 1600;
const QUALITY = 80;
const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.join(__dirname, '..');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const kb = n => (n / 1024).toFixed(0) + ' KB';

async function ensureBucket() {
    const { data } = await supabase.storage.getBucket(BUCKET);
    if (data) {
        if (!data.public) throw new Error(`Bucket "${BUCKET}" exists but is not public. Make it public in Supabase → Storage.`);
        return;
    }
    if (DRY_RUN) { console.log(`(dry run) would create public bucket "${BUCKET}"`); return; }
    const { error } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: '5MB',
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png']
    });
    if (error) throw new Error('Could not create bucket: ' + error.message);
    console.log(`✓ Created public bucket "${BUCKET}"`);
}

async function main() {
    await ensureBucket();
    const { data: colors, error } = await supabase
        .from('product_colors')
        .select('id, product_id, name, images')
        .order('product_id')
        .order('sort_order');
    if (error) throw error;

    let before = 0, after = 0, uploaded = 0, missing = [];
    for (const color of colors) {
        const images = Array.isArray(color.images) ? color.images : [];
        if (!images.some(src => src.startsWith('assets/'))) continue;

        const next = [];
        for (const src of images) {
            if (!src.startsWith('assets/')) { next.push(src); continue; }   // already a URL
            const file = path.join(ROOT, src);
            if (!fs.existsSync(file)) {
                missing.push(`${color.product_id} / ${color.name}: ${src}`);
                continue;   // drop it; the site shows a placeholder if a colour ends up with no photos
            }
            const original = fs.readFileSync(file);
            const webp = await sharp(original)
                .rotate()   // respect EXIF orientation
                .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toBuffer();
            const hash = crypto.createHash('sha1').update(webp).digest('hex').slice(0, 8);
            const name = path.basename(src).replace(/\.[^.]+$/, '');
            const objectPath = `${color.product_id}/${slug(color.name)}/${name}-${hash}.webp`;
            before += original.length;
            after += webp.length;

            if (!DRY_RUN) {
                const { error: upErr } = await supabase.storage.from(BUCKET).upload(objectPath, webp, {
                    contentType: 'image/webp',
                    cacheControl: '31536000',   // content-hashed names, so caching forever is safe
                    upsert: true
                });
                if (upErr) throw new Error(`${objectPath}: ${upErr.message}`);
                uploaded++;
            }
            const url = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
            next.push(url);
            console.log(`  ${src} (${kb(original.length)}) → ${objectPath} (${kb(webp.length)})`);
        }

        if (!DRY_RUN) {
            const { error: updErr } = await supabase.from('product_colors').update({ images: next }).eq('id', color.id);
            if (updErr) throw new Error(`${color.product_id}/${color.name}: ${updErr.message}`);
        }
        console.log(`✓ ${color.product_id} / ${color.name}: ${next.length} photo(s)`);
    }

    console.log(`\n${DRY_RUN ? '(dry run) ' : ''}Uploaded ${uploaded} photo(s). Size ${kb(before)} → ${kb(after)}${before ? ` (${Math.round(100 - after / before * 100)}% smaller)` : ''}.`);
    if (missing.length) console.log('⚠️  Missing local files (skipped):\n  ' + missing.join('\n  '));
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
