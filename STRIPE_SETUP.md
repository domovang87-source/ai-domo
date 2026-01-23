# Stripe Setup Instructions

## 1. Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)

## 2. Update .env.local

Add these to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, use:
- Production keys (starts with `sk_live_` and `pk_live_`)
- Your production URL: `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`

## 3. Your Product

- Product ID: `prod_TqJq7wUDqAvyzE`
- The checkout will automatically fetch the active price for this product

## 4. Test the Integration

1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test card: `4242 4242 4242 4242`
3. Any future expiry date and any CVC

## 5. Webhook Setup (Optional - for production)

For production, set up webhooks at:
- https://dashboard.stripe.com/webhooks
- Endpoint: `https://yourdomain.com/api/webhook`
- Events: `checkout.session.completed`
