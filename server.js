require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// --- Supabase Server-Side Client ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;
if (supabaseUrl && supabaseServiceKey && supabaseServiceKey !== 'your_supabase_service_role_key_here') {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase server client initialized.');
} else {
    console.warn('⚠️  WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env. Order saving to DB is disabled.');
}
const nodemailer = require('nodemailer');

// Configure NodeMailer transporter (fallback to console logging for now if missing env vars)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASS || 'testpass'
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Production-ready CORS setup
const allowedOrigins = [
    'https://www.shopmrignaini.com',
    'https://shopmrignaini.com',
    'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Handle preflight requests properly
app.options(/(.*)/, cors(corsOptions));
app.use(bodyParser.json());
// Serve static frontend files if hosted together
app.use(express.static(__dirname));

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

console.log('\n--- RAZORPAY DEBUG INFO ---');
console.log('Loaded RAZORPAY_KEY_ID:', razorpayKeyId ? razorpayKeyId : 'UNDEFINED');
console.log('---------------------------\n');

if (!razorpayKeyId || !razorpayKeySecret || razorpayKeySecret === 'your_razorpay_secret_here') {
    console.warn('\n⚠️  WARNING: Razorpay keys are missing or invalid in .env!');
    console.warn('⚠️  Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correctly set.');
    console.warn('⚠️  You must use a matching Key ID and Secret pair (both Test mode or both Live mode).\n');
}

const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
});

// Endpoint to expose public Key ID to frontend safely
app.get('/get-razorpay-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Endpoint to create an order
app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;
        console.log(`\n📦 [CREATE-ORDER] Received request — Amount: ${amount} paise, Currency: ${currency || 'INR'}`);

        const options = {
            amount: amount, // amount in the smallest currency unit (e.g., paise)
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        console.log(`✅ [CREATE-ORDER] Razorpay order created: ${order.id} (₹${amount / 100})`);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('\n❌ [CREATE-ORDER] Error creating Razorpay order. Check your keys!');
        console.error('Details:', error.error ? error.error.description || error.error : error);
        res.status(500).json({ success: false, message: 'Internal Server Error: ' + (error.error ? error.error.description : '') });
    }
});

// Endpoint to verify payment signature securely
app.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
        console.log(`\n🔐 [VERIFY-PAYMENT] Received verification request`);
        console.log(`   ├─ razorpay_order_id: ${razorpay_order_id}`);
        console.log(`   ├─ razorpay_payment_id: ${razorpay_payment_id}`);
        console.log(`   └─ orderDetails present: ${!!orderDetails}`);

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Securely verified!
            console.log(`✅ [VERIFY-PAYMENT] Signature verified successfully!`);

            // 1. Generate Order Number
            const orderNumber = 'MRG' + Date.now();
            console.log(`   ├─ Order Number: ${orderNumber}`);

            // 2. Save order to Supabase
            if (supabase && orderDetails) {
                const { name, email, phone, address, city, state, pincode, items, total } = orderDetails;
                console.log(`   ├─ Saving to Supabase...`);
                console.log(`   │  Customer: ${name}, Phone: ${phone}, Total: ₹${total}`);
                try {
                    const { data, error } = await supabase
                        .from('orders')
                        .insert({
                            order_number: orderNumber,
                            customer_name: name || '',
                            email: email || '',
                            phone: phone || '',
                            address: address || '',
                            city: city || '',
                            state: state || '',
                            pincode: pincode || '',
                            items: items || [],
                            total: total || 0,
                            payment_id: razorpay_payment_id,
                            razorpay_order_id: razorpay_order_id
                            created_at: new Date().toISOString()
                        });

                    if (error) {
                        console.error('   └─ ❌ Supabase insert error:', error.message, error.details);
                    } else {
                        console.log(`   └─ ✅ Order ${orderNumber} saved to Supabase successfully!`);
                    }
                } catch (dbErr) {
                    console.error('   └─ ❌ Supabase insert exception:', dbErr);
                }
            } else if (!supabase) {
                console.warn('   └─ ⚠️  Supabase client not initialized — order NOT saved to DB.');
            } else if (!orderDetails) {
                console.warn('   └─ ⚠️  No orderDetails in payload — order NOT saved to DB.');
            }

            // 3. Prepare Email content if orderDetails exists
            if (orderDetails) {
                const { name, email, phone, address, items, total } = orderDetails;

                let itemsListHtml = '';
                if (items && Array.isArray(items)) {
                    itemsListHtml = items.map(i => `<li>${i.qty}x Product ID ${i.productId} (Size: ${i.size})</li>`).join('');
                }

                const customerMailOptions = {
                    from: '"Mrignaini Store" <no-reply@mrignaini.com>',
                    to: email || process.env.STORE_OWNER_EMAIL || 'customer@example.com',
                    subject: `Order Confirmation - ${orderNumber}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2 style="color: #1a4a3a;">Thank you for your order!</h2>
                            <p>Hi ${name},</p>
                            <p>We've received your order <strong>${orderNumber}</strong> securely and are getting it ready for shipment.</p>
                            
                            <h3>Order Summary:</h3>
                            <ul>${itemsListHtml}</ul>
                            <p><strong>Amount Paid:</strong> ₹${total}</p>
                            
                            <h3>Shipping Address:</h3>
                            <p>${address}</p>
                            <p>Phone: ${phone}</p>
                            
                            <p>Thank you for shopping with Mrignaini.</p>
                        </div>
                    `
                };

                const adminMailOptions = {
                    from: '"Mrignaini System" <no-reply@mrignaini.com>',
                    to: process.env.STORE_OWNER_EMAIL || 'admin@mrignaini.com',
                    subject: `New Order Received - ${orderNumber}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2 style="color: #1a4a3a;">New Order Received!</h2>
                            <p><strong>Order Number:</strong> ${orderNumber}</p>
                            <p><strong>Customer:</strong> ${name} (${email}, ${phone})</p>
                            <p><strong>Amount Paid:</strong> ₹${total}</p>
                            
                            <h3>Items Ordered:</h3>
                            <ul>${itemsListHtml}</ul>
                            
                            <h3>Shipping Address:</h3>
                            <p>${address}</p>
                        </div>
                    `
                };

                // Send emails in background
                if (process.env.SMTP_USER) {
                    transporter.sendMail(customerMailOptions).catch(err => console.error('Failed to send customer email:', err));
                    transporter.sendMail(adminMailOptions).catch(err => console.error('Failed to send admin email:', err));
                } else {
                    console.log('--- MOCK EMAIL DELIVERY ---');
                    console.log('Customer Email Body:\\n', customerMailOptions.html);
                    console.log('Admin Email Body:\\n', adminMailOptions.html);
                    console.log('Please configure SMTP_USER in .env to send real emails.');
                }
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                orderNumber: orderNumber
            });
        } else {
            console.warn(`❌ [VERIFY-PAYMENT] Signature mismatch! Payment rejected.`);
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('❌ [VERIFY-PAYMENT] Unexpected error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Mrignaini Checkout server running on http://localhost:${PORT}`);
});
