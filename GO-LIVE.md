# Mrignaini — Go-live checklist

Work in order. Each step says how to check it worked. Nothing here prints or shares key values.

---

## 0. Before anything: migrations 004, 005 and 006

Supabase → SQL Editor, in order (004 and 005 are already done):
- `004_admin_tools.sql` — admin photo uploads/deletes, "return to stock" on cancelled orders
- `005_exact_restock.sql` — "return to stock" puts back exactly what an order took
- `006_mrp_pricing_no_coupons.sql` — selling price + crossed-out MRP; all coupons switched off

None of them touch the live checkout or old orders. **006 must run before the merge**: the new
site reads the MRP column it adds.

---

## 1. Razorpay test keys + payment test (local)

1. Razorpay Dashboard → switch to **Test Mode** → Account & Settings → API Keys → **Generate Test Key**.
2. Add to `.env` (keep the live keys as they are):
   ```
   RAZORPAY_TEST_KEY_ID=rzp_test_...
   RAZORPAY_TEST_KEY_SECRET=...
   ```
3. Start the site locally. Port 3000 is used by another app on this PC, so set `PORT=3005` in `.env`, then:
   ```
   npm install
   npm start
   ```
   The log must say `Razorpay enabled (TEST mode)`. Locally the server **never** uses live keys.
4. Open http://localhost:3005/admin-orders.html and sign in (so the hidden ₹2 test product is buyable),
   then open http://localhost:3005/product.html?id=test-product → Buy Now → fill the form → Place Order.
5. In the Razorpay test window pay with UPI **`success@razorpay`** (or card 4111 1111 1111 1111, any future expiry, any CVV).
6. Check:
   - "Order Placed Successfully!" with an order number
   - Admin → Orders → tick **Show test orders**: the order shows **paid**, ₹101, with a payment ID
   - Admin → Products → Test Product: stock dropped from 99 to 98
7. Failure path: repeat with UPI **`failure@razorpay`** → a "Payment failed" message, no paid order.
8. Cancel path: close the Razorpay window → "Payment was cancelled", button usable again.

---

## 2. Email (simplest: Gmail)

1. On the Gmail account that should send order emails: turn on 2-Step Verification →
   https://myaccount.google.com/apppasswords → create an app password ("Mrignaini").
2. Add to `.env` and to Render (step 3):
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<that gmail address>
   SMTP_PASS=<the 16-character app password>
   STORE_OWNER_EMAIL=<where new-order alerts should go>
   ```
   Emails are sent from SMTP_USER. Optional: `SMTP_FROM="Mrignaini" <same address>`.
3. Re-run the step-1 test payment with your own email in the checkout form → you get the
   confirmation, STORE_OWNER_EMAIL gets the "New order" alert.
4. Customer account emails (sign-up confirmation, password reset) are sent by Supabase, which
   only allows a few per hour on its built-in mailer. Supabase → Authentication → Emails →
   **SMTP Settings** → enter the same Gmail details.
5. Supabase → Authentication → **URL Configuration**:
   - Site URL: `https://www.shopmrignaini.com`
   - Redirect URLs: `https://www.shopmrignaini.com/auth.html`, `https://shopmrignaini.com/auth.html`, `http://localhost:3005/auth.html`

---

## 3. Render environment variables

Render → mrignaini-backend → **Environment**. Adding these is safe *before* merging (the old server ignores them).

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | **Required.** Without it the new server refuses live keys and payments stay off. |
| `SUPABASE_URL` | (already set) | keep |
| `SUPABASE_SERVICE_ROLE_KEY` | (already set) | keep — server only |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | (already set, live) | keep |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `STORE_OWNER_EMAIL` | from step 2 | add |
| `RAZORPAY_WEBHOOK_SECRET` | any long random string | optional but recommended, see below |
| `PORT` | — | **don't set**; Render provides it |
| `RAZORPAY_TEST_KEY_*`, `SUPABASE_ANON_KEY` | — | not needed on Render |

Settings → Build Command `npm install`, Start Command `npm start` (or `node server.js`).

**Webhook (safety net if a customer closes the browser right after paying):**
Razorpay Dashboard (Live mode) → Webhooks → Add → URL
`https://mrignaini-backend.onrender.com/api/razorpay/webhook`, secret = `RAZORPAY_WEBHOOK_SECRET`,
events: `payment.captured`. Add it *after* the merge.

---

## 4. Merge `rebuild` into `main`

Pick a quiet time: Vercel (site) and Render (server) deploy separately and for 2–5 minutes the
old site may talk to the new server or vice versa, so checkout can fail briefly.

```
git checkout main
git pull
git merge --no-ff rebuild -m "Merge rebuild: Supabase catalog, secure checkout, admin"
git push origin main
```

---

## 5. Check both deploys

**Render** (Dashboard → Deploys → wait for "Live"), then open
`https://mrignaini-backend.onrender.com/api/health` →
`{"ok":true,"database":true,"payments":true,"paymentMode":"LIVE"}`
(Log shows `Razorpay enabled (LIVE mode)` and `(production)`.)

**Vercel** (Dashboard → Deployments → latest "Ready"), then on https://www.shopmrignaini.com:
- [ ] Homepage shows all 7 products with photos
- [ ] A product page: pick colour + size, add to cart
- [ ] Product cards and pages show the crossed-out MRP and % off (e.g. Afsana ~~₹850~~ ₹650, 24% off)
- [ ] Cart shows colour/size and flat ₹99 shipping (one Afsana = ₹749); no coupon box anywhere
- [ ] Checkout shows the same total (stop before paying, or do step 6)
- [ ] `/admin-orders.html` and `/admin-products.html` sign in and load
- [ ] `https://www.shopmrignaini.com/server.js` → **404** (confirms `.vercelignore` works)
- [ ] `/category.html?cat=kurtis` → lands on Tops

**Optional live check:** as admin, buy the ₹2 test product for real (₹101), confirm it shows paid
in admin, then refund it in Razorpay → Payments → Refund. Set the order to Cancelled in admin.

---

## 6. Run migration 003 (after the new server is confirmed live)

Only once step 5 passes. Supabase → SQL Editor → `supabase/migrations/003_after_new_server_live.sql`.
Run the two duplicate checks at the top first; both must return no rows.

---

## 7. Roll back if something breaks

**Site + server (fastest, no code changes):**
- Vercel → Deployments → previous production deployment → **⋯ → Promote to Production** (Instant Rollback).
- Render → Deploys → the previous deploy (commit 7903ea3) → **Rollback to this deploy**.
  Roll back **both** — the old site only works with the old server and vice versa.

**Or in git:**
```
git checkout main
git revert -m 1 <merge commit sha>
git push origin main
```

**Database:** migrations 001, 002 and 004 only add things; the old server keeps saving orders with
them in place (tested). Nothing to undo. If 003 was already run and you roll back to the old
server, remove its unique indexes:
```sql
drop index if exists public.orders_order_number_key;
drop index if exists public.orders_razorpay_order_id_key;
create index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_razorpay_order_id_idx on public.orders (razorpay_order_id);
```
Note: after a rollback the *old* admin page cannot read orders (RLS now blocks the anon key —
that is intended). Run the new admin locally (`npm start`) or redeploy when fixed.

---

## Running locally (reference)

```
npm install
npm start      →  http://localhost:<PORT from .env>   (use 3005 on this PC)
```
`.env` stays on your machine only (it is git-ignored).
- `npm run seed` — re-run the catalog seed (adds missing items only; `-- --update` overwrites text/prices/photos)
- `npm run upload-photos` — uploads any photos that still point at local files
