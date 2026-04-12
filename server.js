require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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
app.options('*', cors(corsOptions));
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

        const options = {
            amount: amount, // amount in the smallest currency unit (e.g., paise)
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('\n❌ Error creating Razorpay order. Check your keys!');
        console.error('Details:', error.error ? error.error.description || error.error : error);
        res.status(500).json({ success: false, message: 'Internal Server Error: ' + (error.error ? error.error.description : '') });
    }
});

// Endpoint to verify payment signature securely
app.post('/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Securely verified!
            // In a real application, update the order status in DB here
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Mrignaini Checkout server running on http://localhost:${PORT}`);
});
