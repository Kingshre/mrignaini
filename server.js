require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const SHIPPING_FEE = 99;          // flat, per order
const MAX_QTY_PER_LINE = 10;

// ── Supabase (service role: server only, never sent to the browser) ──
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    console.log('✅ Supabase server client initialized.');
} else {
    console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env — checkout is disabled.');
}

// ── Razorpay ──
// Live keys are only ever used when NODE_ENV=production. Locally the server
// uses RAZORPAY_TEST_KEY_ID / RAZORPAY_TEST_KEY_SECRET, or disables payments.
const rzpKeyId = (IS_PROD ? process.env.RAZORPAY_KEY_ID : process.env.RAZORPAY_TEST_KEY_ID) || '';
const rzpKeySecret = (IS_PROD ? process.env.RAZORPAY_KEY_SECRET : process.env.RAZORPAY_TEST_KEY_SECRET) || '';
const rzpMode = rzpKeyId.startsWith('rzp_live_') ? 'LIVE' : rzpKeyId.startsWith('rzp_test_') ? 'TEST' : null;
let razorpay = null;
if (!rzpKeyId || !rzpKeySecret) {
    console.warn(`⚠️  Razorpay ${IS_PROD ? 'live' : 'test'} keys missing — payments are disabled.`);
} else if (rzpMode === 'LIVE' && !IS_PROD) {
    console.warn('⚠️  Refusing to use LIVE Razorpay keys outside production — payments are disabled.');
} else {
    razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
    console.log(`✅ Razorpay enabled (${rzpMode || 'unknown'} mode).`);
}

// ── Email (optional) ──
const transporter = process.env.SMTP_USER ? nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
}) : null;

// Gmail (and most SMTP providers) only send "from" the authenticated account
const MAIL_FROM = process.env.SMTP_FROM || `"Mrignaini" <${process.env.SMTP_USER}>`;

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const app = express();

// ── CORS ──
const allowedOrigins = [
    'https://www.shopmrignaini.com',
    'https://shopmrignaini.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];
if (process.env.FRONTEND_URL) allowedOrigins.push(...process.env.FRONTEND_URL.split(',').map(s => s.trim()));
// Any localhost port is fine in development
const corsOptions = {
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        if (!IS_PROD && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true);
        cb(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Razorpay webhooks need the raw body for signature checks, so this route is registered before express.json
app.post('/api/razorpay/webhook', express.raw({ type: 'application/json', limit: '1mb' }), handleWebhook);

app.use(express.json({ limit: '20kb' }));

// Serve the site locally, but never server code, config, or tooling
const BLOCKED_PATHS = /^\/(server\.js|package(-lock)?\.json|node_modules|supabase|scripts|products-catalog\.txt|\.)/i;
app.use((req, res, next) => (BLOCKED_PATHS.test(req.path) ? res.status(404).end() : next()));
app.use(express.static(__dirname, { dotfiles: 'ignore', index: 'index.html' }));

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
class HttpError extends Error {
    constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requireDb() {
    if (!supabase) throw new HttpError(503, 'Store database is not configured.');
}

// Returns { user, isAdmin } for a Supabase access token in the Authorization header, or nulls.
async function getRequestUser(req) {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token || !supabase) return { user: null, isAdmin: false };
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return { user: null, isAdmin: false };
    const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle();
    return { user: data.user, isAdmin: !!adminRow };
}

function normalizeCartItems(items) {
    if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Your cart is empty.');
    if (items.length > 50) throw new HttpError(400, 'Too many items in cart.');
    const merged = new Map();
    for (const raw of items) {
        const variantId = String(raw && raw.variantId || '');
        const qty = Number(raw && raw.qty);
        if (!UUID_RE.test(variantId)) throw new HttpError(400, 'Invalid item in cart. Please refresh and try again.');
        if (!Number.isInteger(qty) || qty < 1) throw new HttpError(400, 'Invalid quantity in cart.');
        merged.set(variantId, (merged.get(variantId) || 0) + qty);
    }
    return [...merged].map(([variantId, qty]) => ({ variantId, qty }));
}

// The single source of truth for what an order costs. Prices always come from the DB.
// No coupons: discount is always 0 and any coupon code sent by a browser is ignored.
async function priceCart(rawItems, { allowTest = false } = {}) {
    requireDb();
    const items = normalizeCartItems(rawItems);
    const { data: rows, error } = await supabase
        .from('variants')
        .select('id, size, stock, is_sold_out, color_id, product_colors(id, name, images, is_active), products(id, name, price, mrp, is_active, is_test)')
        .in('id', items.map(i => i.variantId));
    if (error) throw error;
    const byId = new Map(rows.map(r => [r.id, r]));

    const lines = [];
    const problems = [];
    for (const { variantId, qty } of items) {
        const v = byId.get(variantId);
        const p = v && v.products;
        const c = v && v.product_colors;
        const visible = p && c && c.is_active && (p.is_test ? allowTest : p.is_active);
        if (!visible) {
            problems.push({ variantId, message: 'This item is no longer available.' });
            continue;
        }
        const label = `${p.name} (${c.name}, ${v.size})`;
        if (v.is_sold_out || v.stock <= 0) {
            problems.push({ variantId, message: `${label} is sold out.`, available: 0 });
            continue;
        }
        if (qty > Math.min(v.stock, MAX_QTY_PER_LINE)) {
            const available = Math.min(v.stock, MAX_QTY_PER_LINE);
            problems.push({ variantId, message: `Only ${available} left of ${label}.`, available });
            continue;
        }
        lines.push({
            variantId, productId: p.id, colorId: c.id,
            name: p.name, color: c.name, size: v.size,
            image: (c.images && c.images[0]) || null,
            qty, unitPrice: p.price, unitMrp: p.mrp && p.mrp > p.price ? p.mrp : null, lineTotal: p.price * qty,
            isTest: !!p.is_test
        });
    }

    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const shipping = lines.length ? SHIPPING_FEE : 0;

    return { lines, problems, subtotal, shipping, discount: 0, total: subtotal + shipping };
}

function validateCustomer(c) {
    c = c || {};
    const s = v => String(v ?? '').trim();
    const customer = {
        name: s(c.name), email: s(c.email), phone: s(c.phone).replace(/\s+/g, ''),
        address1: s(c.address1), address2: s(c.address2),
        city: s(c.city), state: s(c.state), pincode: s(c.pincode)
    };
    const errors = {};
    if (customer.name.length < 2 || customer.name.length > 100) errors.name = 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(customer.phone)) errors.phone = 'Please enter a valid 10-digit mobile number.';
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = 'Please enter a valid email.';
    if (customer.address1.length < 5 || customer.address1.length > 200) errors.address1 = 'Please enter your address.';
    if (customer.address2.length > 200) errors.address2 = 'Address line 2 is too long.';
    if (customer.city.length < 2 || customer.city.length > 80) errors.city = 'Please enter your city.';
    if (customer.state.length < 2 || customer.state.length > 80) errors.state = 'Please enter your state.';
    if (!/^\d{6}$/.test(customer.pincode)) errors.pincode = 'Please enter a valid 6-digit pincode.';
    if (Object.keys(errors).length) throw new HttpError(400, 'Please check your details.', { fields: errors });
    return customer;
}

function orderItemsForStorage(lines) {
    return lines.map(l => ({
        variantId: l.variantId, productId: l.productId, colorId: l.colorId,
        name: l.name, color: l.color, size: l.size,
        qty: l.qty, unitPrice: l.unitPrice, unitMrp: l.unitMrp, lineTotal: l.lineTotal
    }));
}

// HttpErrors carry customer-safe messages; anything else is unexpected and stays generic.
const asyncRoute = fn => (req, res) => fn(req, res).catch(err => {
    const known = err instanceof HttpError;
    const status = known ? err.status : 500;
    if (status >= 500) console.error(`❌ ${req.method} ${req.path}:`, err.message || err);
    res.status(status).json({ success: false, message: known ? err.message : 'Something went wrong. Please try again.', ...(known && err.details || {}) });
});

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ ok: true, database: !!supabase, payments: !!razorpay, paymentMode: razorpay ? rzpMode : null });
});

// Price a cart (used by cart + checkout to display totals)
app.post('/api/checkout/quote', asyncRoute(async (req, res) => {
    const { isAdmin } = await getRequestUser(req);
    const quote = await priceCart(req.body.items, { allowTest: isAdmin });
    res.json({ success: true, ...quote });
}));

// Create a pending order + matching Razorpay order. The amount is computed here, never by the browser.
app.post('/api/checkout/create-order', asyncRoute(async (req, res) => {
    requireDb();
    if (!razorpay) throw new HttpError(503, 'Online payments are temporarily unavailable. Please try again later.');

    const { user, isAdmin } = await getRequestUser(req);
    const customer = validateCustomer(req.body.customer);
    const quote = await priceCart(req.body.items, { allowTest: isAdmin });
    if (quote.problems.length) throw new HttpError(409, quote.problems[0].message, { problems: quote.problems });
    if (!quote.lines.length) throw new HttpError(400, 'Your cart is empty.');

    const isTest = quote.lines.every(l => l.isTest);
    const record = {
        customer_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: [customer.address1, customer.address2].filter(Boolean).join(', '),
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        items: orderItemsForStorage(quote.lines),
        subtotal: quote.subtotal,
        shipping: quote.shipping,
        discount: 0,
        coupon_code: null,
        total: quote.total,
        status: 'pending',
        payment_status: 'pending',
        user_id: user ? user.id : null,
        is_test: isTest
    };

    let order = null;
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
        const orderNumber = 'MRG' + (Date.now() + attempt);
        const { data, error } = await supabase.from('orders').insert({ ...record, order_number: orderNumber }).select().single();
        if (!error) order = data;
        else if (error.code !== '23505') throw error;   // retry only on duplicate order number
    }
    if (!order) throw new HttpError(500, 'Could not create order.');

    let rzpOrder;
    try {
        rzpOrder = await razorpay.orders.create({
            amount: Math.round(quote.total * 100),
            currency: 'INR',
            receipt: order.order_number,
            notes: { order_number: order.order_number }
        });
    } catch (e) {
        await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);
        console.error('❌ Razorpay order create failed:', e.error ? e.error.description : e.message);
        throw new HttpError(502, 'Could not start the payment. Please try again.');
    }

    const { error: updErr } = await supabase.from('orders').update({ razorpay_order_id: rzpOrder.id }).eq('id', order.id);
    if (updErr) throw updErr;

    console.log(`📦 Order ${order.order_number} created (₹${quote.total}) → ${rzpOrder.id}`);
    res.json({
        success: true,
        orderNumber: order.order_number,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: rzpKeyId
    });
}));

// Confirm a payment: signature check + fetch the payment from Razorpay, then mark paid & decrement stock.
async function confirmPayment(razorpayOrderId, paymentId) {
    const { data: order, error } = await supabase.from('orders').select('*').eq('razorpay_order_id', razorpayOrderId).maybeSingle();
    if (error) throw error;
    if (!order) throw new HttpError(404, 'Order not found.');
    if (order.payment_status === 'paid' && order.stock_applied) return order;

    const payment = await razorpay.payments.fetch(paymentId);
    const expectedAmount = Math.round(Number(order.total) * 100);
    if (payment.order_id !== razorpayOrderId) throw new HttpError(400, 'Payment does not belong to this order.');
    if (Number(payment.amount) !== expectedAmount) throw new HttpError(400, 'Payment amount does not match the order.');
    if (payment.status === 'authorized') {
        await razorpay.payments.capture(paymentId, expectedAmount, 'INR');
    } else if (payment.status !== 'captured') {
        throw new HttpError(400, `Payment is ${payment.status}.`);
    }

    const { data: paid, error: rpcErr } = await supabase.rpc('mark_order_paid', {
        p_razorpay_order_id: razorpayOrderId,
        p_payment_id: paymentId
    });
    if (rpcErr) throw rpcErr;
    if (paid.stock_issue) console.warn(`⚠️  ${paid.order_number}: ${paid.stock_issue}`);
    return { ...paid, _newlyPaid: order.payment_status !== 'paid' };
}

app.post('/api/checkout/verify', asyncRoute(async (req, res) => {
    requireDb();
    if (!razorpay) throw new HttpError(503, 'Payments are not configured.');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new HttpError(400, 'Missing payment details.');

    const expected = crypto.createHmac('sha256', rzpKeySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const a = Buffer.from(expected), b = Buffer.from(String(razorpay_signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        console.warn(`❌ Signature mismatch for ${razorpay_order_id}`);
        throw new HttpError(400, 'Invalid payment signature.');
    }

    const order = await confirmPayment(razorpay_order_id, razorpay_payment_id);
    if (order._newlyPaid) sendOrderEmails(order);
    console.log(`✅ Order ${order.order_number} paid (${razorpay_payment_id})`);
    res.json({ success: true, orderNumber: order.order_number });
}));

// Safety net if the customer closes the browser after paying.
// Set RAZORPAY_WEBHOOK_SECRET and point a Razorpay webhook (payment.captured) at /api/razorpay/webhook.
async function handleWebhook(req, res) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !supabase || !razorpay) return res.status(503).end();
    const signature = req.get('x-razorpay-signature') || '';
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(400).end();
    }
    try {
        const event = JSON.parse(req.body.toString('utf8'));
        const payment = event.payload && event.payload.payment && event.payload.payment.entity;
        if (['payment.captured', 'order.paid'].includes(event.event) && payment && payment.order_id) {
            const order = await confirmPayment(payment.order_id, payment.id);
            if (order._newlyPaid) sendOrderEmails(order);
            console.log(`🔔 Webhook: order ${order.order_number} paid`);
        }
        res.json({ ok: true });
    } catch (e) {
        console.error('❌ Webhook error:', e.message);
        res.status(e.status && e.status < 500 ? 200 : 500).json({ ok: false });   // 200 for unknown orders so Razorpay stops retrying
    }
}

// ─────────────────────────────────────────
// Emails
// ─────────────────────────────────────────
function sendOrderEmails(order) {
    const fmt = n => '₹' + Number(n || 0).toLocaleString('en-IN');
    const itemsHtml = (order.items || []).map(i =>
        `<li>${escapeHtml(i.qty)} × ${escapeHtml(i.name)} — ${escapeHtml(i.color)}, Size ${escapeHtml(i.size)} — ${fmt(i.lineTotal)}</li>`).join('');
    const address = escapeHtml([order.address, order.city, order.state, order.pincode].filter(Boolean).join(', '));
    const totals = `
        <p>Subtotal: ${fmt(order.subtotal)}<br>
        Shipping: ${fmt(order.shipping)}<br>
        <strong>Total paid: ${fmt(order.total)}</strong></p>`;

    const customerMail = {
        from: MAIL_FROM,
        to: order.email,
        subject: `Order Confirmation - ${order.order_number}`,
        html: `<div style="font-family:sans-serif;color:#333">
            <h2 style="color:#1a4a3a">Thank you for your order!</h2>
            <p>Hi ${escapeHtml(order.customer_name)},</p>
            <p>We've received your order <strong>${escapeHtml(order.order_number)}</strong> and are getting it ready.</p>
            <h3>Order Summary</h3><ul>${itemsHtml}</ul>${totals}
            <h3>Shipping Address</h3><p>${address}</p><p>Phone: ${escapeHtml(order.phone)}</p>
            <p>Thank you for shopping with Mrignaini.</p></div>`
    };
    const adminMail = {
        from: MAIL_FROM,
        to: process.env.STORE_OWNER_EMAIL,
        subject: `New Order Received - ${order.order_number}`,
        html: `<div style="font-family:sans-serif;color:#333">
            <h2 style="color:#1a4a3a">New order</h2>
            <p><strong>${escapeHtml(order.order_number)}</strong> — ${escapeHtml(order.customer_name)} (${escapeHtml(order.email)}, ${escapeHtml(order.phone)})</p>
            <ul>${itemsHtml}</ul>${totals}
            ${order.stock_issue ? `<p style="color:#991b1b"><strong>${escapeHtml(order.stock_issue)}</strong></p>` : ''}
            <h3>Shipping Address</h3><p>${address}</p></div>`
    };

    if (!transporter) {
        console.log(`✉️  Email not configured (SMTP_USER missing) — skipped emails for ${order.order_number}.`);
        return;
    }
    if (order.email) transporter.sendMail(customerMail).catch(err => console.error('Customer email failed:', err.message));
    if (process.env.STORE_OWNER_EMAIL) transporter.sendMail(adminMail).catch(err => console.error('Admin email failed:', err.message));
}

// Express 5 passes listen errors (e.g. port already in use) to this callback
app.listen(PORT, (err) => {
    if (err) {
        console.error(`❌ Could not start server on port ${PORT}: ${err.code || err.message}`);
        if (err.code === 'EADDRINUSE') console.error(`   Another app is using port ${PORT}. Set PORT=<free port> in .env or the shell.`);
        process.exit(1);
    }
    console.log(`Mrignaini server running on http://localhost:${PORT} (${IS_PROD ? 'production' : 'development'})`);
});
