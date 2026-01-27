# AI Domo - Quick Setup Guide

## ✅ Status: Ready to Run!

All environment variables have been configured. Follow these steps to run locally.

## 🚀 Quick Start

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:3000

## 💳 Testing Stripe Payments Locally

For full payment testing with webhooks, you need Stripe CLI:

### Install Stripe CLI (if not installed)

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
curl -s https://packages.stripe.com/api/v1/bots/stripe/cli-linux-x64.tar.gz | tar -xz
sudo mv stripe /usr/local/bin/
```

**Windows:**
Download from: https://github.com/stripe/stripe-cli/releases/latest

### Set Up Webhook Forwarding

1. Login to Stripe:
```bash
stripe login
```

2. Forward webhooks to your local dev server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the webhook signing secret (starts with `whsec_`) and update it in `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

4. Restart your dev server for the new webhook secret to take effect

### Test Payments

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## 📝 Testing Workflow

1. Go to http://localhost:3000
2. Click "Get Started" → "Sign Up"
3. Create an account with any email/password
4. You'll be redirected to Stripe checkout
5. Use test card `4242 4242 4242 4242`
6. Complete payment
7. You'll be redirected back and can start using the chat

## 🔗 Important Links

- **Production**: https://ai-domo-domo-vangs-projects.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz
- **Stripe Dashboard**: https://dashboard.stripe.com/test
- **Vercel Dashboard**: https://vercel.com/domo-vangs-projects/ai-domo

## 🎯 What's Configured

✅ OpenAI API for AI responses
✅ Supabase authentication
✅ Supabase database with RLS
✅ Stripe test mode credentials
✅ Weekly subscription ($9.99/week)
✅ All environment variables set

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

**Stripe webhooks not working?**
- Make sure Stripe CLI is running with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Webhook secret must match in `.env.local`
- Restart dev server after changing webhook secret

**Can't sign up?**
- Check Supabase dashboard → Authentication → Settings
- Make sure "Enable email confirmations" is OFF for testing
- Check Site URL is set to http://localhost:3000

**Payment not completing?**
- Check Stripe CLI is running
- Check webhook events in terminal
- Look for errors in browser console

## 📦 Project Structure

```
ai-domo/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth callback
│   ├── chat/             # Main chat UI
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── pricing/          # Pricing page
│   └── lib/              # Dating coach logic
├── lib/
│   └── supabase/         # Supabase clients
├── .env.local            # ✅ Configured!
└── CREDENTIALS.md        # Backup credentials
```

## ✨ Ready to Go!

Everything is set up. Just run:
```bash
npm run dev
```

And visit http://localhost:3000
