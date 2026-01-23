# AI Domo - Dating Coach App

AI Domo is a dating coach application with Supabase authentication and Stripe weekly subscriptions.

## 🚀 Live Production

**URL**: https://ai-domo-domo-vangs-projects.vercel.app

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase
- **Payments**: Stripe (Weekly $9.99 subscriptions)
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel
- **AI**: OpenAI GPT-4o-mini

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ installed
- Git installed
- A code editor (Cursor/VSCode)

### 1. Clone the Repository

```bash
git clone https://github.com/domovang87-source/ai-domo.git
cd ai-domo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_PRICE_ID=price_your_stripe_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Note**: Contact the team for actual credentials. Never commit real API keys to Git!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The database schema is already set up in production. If you need to recreate it, run the SQL in `supabase-schema.sql` in your Supabase SQL Editor.

## 🧪 Testing Payments Locally

For local testing with Stripe webhooks:

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to localhost:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Use the webhook signing secret from the CLI output in your `.env.local`

5. Test with card: `4242 4242 4242 4242` (any future date, any CVC)

## 📁 Project Structure

```
ai-domo/
├── app/
│   ├── api/
│   │   ├── chat-api/          # Chat with OpenAI
│   │   ├── check-subscription/ # Verify subscription status
│   │   ├── create-subscription/# Create Stripe checkout
│   │   ├── create-portal-session/ # Stripe billing portal
│   │   └── webhooks/stripe/   # Stripe webhook handler
│   ├── auth/callback/         # Supabase auth callback
│   ├── chat/                  # Main chat interface
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── pricing/               # Pricing page
│   └── lib/                   # Dating coach rules & logic
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   ├── server.ts          # Server Supabase client
│   │   └── middleware.ts      # Auth middleware
│   └── subscription.ts        # Subscription helper
├── middleware.ts              # Route protection
└── supabase-schema.sql        # Database schema
```

## 🔑 Key Features

- **Email/Password Authentication** via Supabase
- **Weekly Subscriptions** ($9.99/week) via Stripe
- **Server-side Auth Verification** on all API routes
- **Stripe Customer Portal** for subscription management
- **Protected Routes** via Next.js middleware
- **Multi-user Support** with isolated user data
- **AI Dating Coach** using OpenAI GPT-4o-mini

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Server-side subscription verification
- Webhook signature validation
- No sensitive data in localStorage
- Environment variables for all secrets

## 🚢 Deployment

The app is deployed on Vercel. To deploy changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy from the `main` branch.

## 🔗 Important Links

- **Production**: https://ai-domo-domo-vangs-projects.vercel.app
- **GitHub**: https://github.com/domovang87-source/ai-domo
- **Supabase Dashboard**: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz
- **Stripe Dashboard**: https://dashboard.stripe.com/test
- **Vercel Dashboard**: https://vercel.com/domo-vangs-projects/ai-domo

## 📝 Common Tasks

### Add New Environment Variable

1. Add to `.env.local` for local development
2. Add to Vercel: Project Settings → Environment Variables
3. Check all 3 boxes: Production, Preview, Development
4. Redeploy: `vercel --prod`

### Update Stripe Product

1. Go to Stripe Dashboard → Products
2. Update pricing/description
3. Copy new Price ID if changed
4. Update `STRIPE_PRICE_ID` in Vercel

### View User Subscriptions

1. Go to Supabase Dashboard → Table Editor → `users`
2. Check `subscription_status` column
3. Or go to Stripe Dashboard → Subscriptions

### Check Webhook Events

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. View "Attempted events" log

## 🐛 Troubleshooting

### Build Fails with "Module not found"
- Check `tsconfig.json` paths configuration
- Make sure all imports use `@/` prefix

### Webhook Not Receiving Events
- Check webhook URL matches production URL
- Verify webhook secret in environment variables
- Check Stripe Dashboard → Webhooks → Events log

### User Can't Sign Up
- Check Supabase Auth settings (Email provider enabled)
- Disable "Confirm email" for testing
- Check Site URL and Redirect URLs in Supabase

### Payment Flow Breaks
- Verify all Stripe environment variables are set
- Check Stripe Dashboard for error logs
- Use test card: `4242 4242 4242 4242`

## 👨‍💻 Development Tips for Cursor

### Useful Cursor Commands

- **Open File**: `Cmd/Ctrl + P` then type file name
- **Search in Project**: `Cmd/Ctrl + Shift + F`
- **Go to Definition**: `F12` or `Cmd/Ctrl + Click`
- **Rename Symbol**: `F2`

### Hot Reload

The dev server supports hot reload. Changes to code will automatically refresh the browser.

### AI Assistant in Cursor

Use Cursor's AI to:
- Explain code: Select code and press `Cmd/Ctrl + L`
- Generate code: Describe what you want in chat
- Debug errors: Paste error messages and ask for help

## 📧 Support

For issues, contact the development team or create an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Stripe
