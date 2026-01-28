# 🎁 AI Domo - Complete Project Handover

Hi Domo! This document has everything you need to manage and grow your AI dating coach app.

---

## 🔗 Your Important Links

### **Live Production App**
**URL**: https://ai-domo-domo-vangs-projects.vercel.app
- This is what customers use
- RAG system is live (uses your entire 9,500-word playbook)
- Currently working and ready to launch

### **GitHub Repository (Code)**
**URL**: https://github.com/domovang87-source/ai-domo
- All your code lives here
- Connected to Vercel (auto-deploys when you push changes)
- Username: `domovang87-source`

### **Vercel (Hosting/Deployment)**
**URL**: https://vercel.com/domo-vangs-projects/ai-domo
- Hosts your website
- Auto-deploys from GitHub
- Free tier should be fine for now

**Deployments Page**: https://vercel.com/domo-vangs-projects/ai-domo/deployments
- See all deployments
- Check if things are working

**Environment Variables**: https://vercel.com/domo-vangs-projects/ai-domo/settings/environment-variables
- API keys and secrets stored here

### **Supabase (Database)**
**URL**: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz
- User accounts
- Subscriptions
- Book content (RAG knowledge base)

**Database Tables**:
- `users` - All user accounts
- `knowledge_base` - Your 9,500-word playbook (51 chunks)

**SQL Editor**: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz/sql/new
- Run database queries here

### **Stripe (Payments)**
**URL**: https://dashboard.stripe.com
- Manage subscriptions
- View revenue
- Handle refunds
- Test mode vs Live mode

---

## 💻 Managing the Code (Using Cursor)

### **Opening the Project**

1. Open Cursor
2. **File** → **Open Folder**
3. Navigate to: `/home/marek/Projects/ai-domo`
4. Click **Select Folder**

### **Project Structure**

```
ai-domo/
├── app/
│   ├── api/
│   │   └── chat-api/route.ts          ← Main chat logic + RAG
│   ├── lib/
│   │   ├── rules.ts                    ← Core directives + keyword detection
│   │   ├── attraction.ts               ← Attraction frameworks
│   │   ├── situationships.ts           ← Situationship rules
│   │   ├── texting.ts                  ← Texting rules
│   │   ├── messaging.ts                ← Messaging frameworks (NEW)
│   │   ├── openers.ts                  ← Opener templates (NEW)
│   │   └── retrieval.ts                ← RAG search system (NEW)
│   ├── chat/                           ← Chat interface
│   ├── login/                          ← Login page
│   └── signup/                         ← Signup page
├── scripts/
│   ├── generate_embeddings.ts          ← Upload book content to database
│   └── chunk_book.py                   ← Break book into chunks
├── .env.local                          ← API keys (DO NOT SHARE)
└── package.json                        ← Dependencies
```

---

## 📝 Common Changes You'll Want to Make

### **1. Changing AI's Advice/Rules**

**Files to edit:**
- `app/lib/rules.ts` - Core personality and rules
- `app/lib/attraction.ts` - Attraction frameworks
- `app/lib/texting.ts` - Texting strategy
- `app/lib/messaging.ts` - Messaging frameworks
- `app/lib/openers.ts` - Opener templates

**How to edit:**
1. Open file in Cursor
2. Find the rule inside quotes `"..."`
3. Change the text
4. Save (Ctrl+S or Cmd+S)
5. Deploy (see below)

**Example:**
```typescript
// Before
"Be blunt, practical, and decisive."

// After
"Be direct and empowering. Give tactical advice."
```

### **2. Changing Response Length**

**File**: `app/api/chat-api/route.ts` (line ~118)

```typescript
max_tokens: 1500,  // ← Change this number
```

- 800 = Short responses (~600 words)
- 1500 = Detailed responses (~1,200 words) - current
- 2000 = Very detailed responses

### **3. Changing Temperature (Randomness)**

**File**: `app/api/chat-api/route.ts` (line ~117)

```typescript
temperature: 0.7,  // ← Change this number (0.0 - 1.0)
```

- 0.5 = Very consistent, predictable
- 0.7 = Balanced - current setting
- 0.9 = More creative, varied

### **4. Adding New Content to RAG**

If you write new dating frameworks or update your book:

1. Add content to a text file: `/tmp/new_content.txt`
2. Ask Cursor's Claude (Cmd+L):
   ```
   "Add the content from /tmp/new_content.txt to the knowledge base"
   ```
3. Claude will chunk it and upload automatically

---

## 🚀 Deploying Changes to Production

After making changes, deploy them:

### **Method 1: Using Cursor Terminal (Recommended)**

1. Open terminal in Cursor: **Terminal** → **New Terminal**
2. Run these commands:

```bash
git add .
git commit -m "Describe what you changed"
git push origin main
```

3. Go to Vercel - it auto-deploys in 2-3 minutes
4. Test at: https://ai-domo-domo-vangs-projects.vercel.app

### **Method 2: Using Cursor's AI Assistant**

1. Press **Cmd+L** (or Ctrl+L on Windows)
2. Say: "Deploy my changes to production"
3. Claude will run the git commands for you

---

## 🧪 Testing Before Deploying

**Always test locally first!**

1. Open terminal in Cursor
2. Run:
   ```bash
   npm run dev
   ```
3. Open browser: http://localhost:3000
4. Test your changes
5. If it works, deploy to production
6. Stop server: Press **Ctrl+C** in terminal

---

## 🤖 Using Claude in Cursor

You have an AI coding assistant built into Cursor.

### **How to Use:**

Press **Cmd+L** (Mac) or **Ctrl+L** (Windows)

### **Example Prompts:**

**Making Changes:**
```
"Change the temperature to 0.8 in the chat API"
"Add a new rule about age gap relationships"
"Make the opener templates shorter"
```

**Finding Things:**
```
"Where is the 6 messages rule defined?"
"Show me all the attraction rules"
```

**Fixing Issues:**
```
"The AI is giving generic advice. Can you check if RAG is working?"
"Users are getting errors when they sign up. Help me debug."
```

**Adding Features:**
```
"Add a welcome message to the chat page"
"Create a FAQ page"
```

---

## 💰 Managing Payments & Subscriptions

### **Viewing Revenue**
1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click **Payments** → See all transactions
3. Click **Subscriptions** → See active subscribers

### **Handling Refunds**
1. Go to **Payments**
2. Find the payment
3. Click **⋯** → **Refund**
4. Enter amount → **Refund**

### **Test Mode vs Live Mode**
- **Test Mode** (toggle in top right): For testing, no real money
- **Live Mode**: Real customers, real money

**Make sure you're in LIVE MODE when customers sign up!**

### **Coupons/Discounts**
1. Go to **Products** → Your product
2. Click **Coupons**
3. Create coupon (% off or fixed amount)
4. Share coupon code with customers

---

## 👥 Managing Users

### **View All Users**
1. Go to Supabase: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz
2. Click **Table Editor** → **users** table
3. See all accounts, subscription status, etc.

### **Manually Activate a Subscription** (if needed)
1. Go to **users** table
2. Find the user
3. Edit these fields:
   - `subscription_status`: "active"
   - `stripe_subscription_id`: (copy from Stripe)
   - `subscription_current_period_end`: (future date)

### **Ban a User**
1. Go to **Authentication** → **Users**
2. Find user
3. Click **⋯** → **Ban user**

---

## 📊 Monitoring Performance

### **Check if App is Working**
1. Go to Vercel: https://vercel.com/domo-vangs-projects/ai-domo
2. Check deployment status (should be green "Ready")
3. Click deployment → **View Function Logs**
4. Look for:
   - `✅ Retrieved X relevant chunks from playbook` ← RAG working
   - Any red errors ← Something broke

### **Check RAG System**
In Vercel logs, you should see:
```
✅ Retrieved 5 relevant chunks from playbook
```

If you see:
```
⚠️ No relevant knowledge found for query
```
RAG is trying but not finding matches (might need to adjust similarity threshold)

---

## 🆘 Troubleshooting Common Issues

### **"App is down / not loading"**
1. Check Vercel deployments - did latest deploy fail?
2. Check Supabase - is database paused?
3. Check environment variables - are API keys still valid?

### **"Payments not working"**
1. Check Stripe dashboard - webhook working?
2. Verify webhook URL: https://ai-domo-domo-vangs-projects.vercel.app/api/webhooks/stripe
3. Check Stripe secret key in Vercel environment variables

### **"RAG not retrieving book content"**
1. Check Supabase → `knowledge_base` table → should have 51 rows
2. If empty, run:
   ```bash
   cd /home/marek/Projects/ai-domo
   npx ts-node scripts/generate_embeddings.ts
   ```

### **"AI responses are terrible"**
1. Check temperature (might be too high)
2. Check if RAG is working (Vercel logs)
3. Test specific queries - which ones fail?
4. Ask Claude in Cursor to help debug

---

## 💵 Monthly Costs

### **Current Cost Breakdown:**

**Vercel (Hosting)**: $0/month
- Free tier (up to 100GB bandwidth)
- Should be fine until you hit 10k+ users

**Supabase (Database)**: $0/month
- Free tier (500MB database, 2GB bandwidth)
- Good until ~5k users

**OpenAI API**: ~$1-5/month (depends on usage)
- Per conversation: ~$0.001 (one-tenth of a cent)
- 1,000 conversations = ~$1
- 5,000 conversations = ~$5

**Stripe**: 2.9% + $0.30 per transaction
- If you charge $9.99/week:
  - Stripe takes: $0.59
  - You keep: $9.40

**Total at 100 subscribers**: ~$10-20/month in costs, ~$940/week in revenue

---

## 🚨 Important Files (DO NOT DELETE)

- `.env.local` - Your API keys (keep this secret!)
- `book_chunks.json` - Your playbook content
- `supabase-embeddings-schema.sql` - Database setup
- `app/lib/retrieval.ts` - RAG system
- `scripts/generate_embeddings.ts` - Upload book content

---

## 📞 Getting Help

### **Ask Claude in Cursor**
Press Cmd+L and ask anything:
- "How do I change X?"
- "Why is Y broken?"
- "Add feature Z"

Claude has full context of your project and can help with anything.

### **Check Documentation Files**
- `RAG_COMPLETE.md` - RAG system overview
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `GUIDE_FOR_CURSOR.md` - Detailed Cursor guide

### **Emergency Contact**
If something is completely broken and you can't fix it:
- Email the developer who built this
- Include: error messages, what you were trying to do, screenshots

---

## ✅ Quick Start Checklist

Before your first day managing the app:

- [ ] Log into GitHub (https://github.com/domovang87-source/ai-domo)
- [ ] Log into Vercel (https://vercel.com/domo-vangs-projects/ai-domo)
- [ ] Log into Supabase (https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz)
- [ ] Log into Stripe (https://dashboard.stripe.com)
- [ ] Open project in Cursor (`/home/marek/Projects/ai-domo`)
- [ ] Test the live app (https://ai-domo-domo-vangs-projects.vercel.app)
- [ ] Try making a small change and deploying it
- [ ] Verify you can run it locally (`npm run dev`)

---

## 🎯 What You Have

✅ **Working AI dating coach** with your entire playbook
✅ **Payment system** charging $9.99/week automatically
✅ **User authentication** and subscription management
✅ **RAG system** searching 9,500 words of your book
✅ **Deployed and scalable** infrastructure
✅ **Cost-effective** (~$0.001 per conversation)

---

## 🚀 Ready to Launch?

When you're ready to launch to customers:

1. ✅ Test the app yourself (10-20 different questions)
2. ✅ Make sure Stripe is in **LIVE MODE** (not test mode)
3. ✅ Share this URL: https://ai-domo-domo-vangs-projects.vercel.app
4. ✅ Monitor Vercel logs for first 24 hours
5. ✅ Watch for customer feedback

---

## 💪 You Got This!

The app is ready. The infrastructure is solid. The AI is using your exact frameworks.

When you need to change something, just ask Claude in Cursor. It will help you with everything.

**Your app is live and ready to make money.** 🚀

---

**Important URLs Summary:**

- **Live App**: https://ai-domo-domo-vangs-projects.vercel.app
- **GitHub**: https://github.com/domovang87-source/ai-domo
- **Vercel**: https://vercel.com/domo-vangs-projects/ai-domo
- **Supabase**: https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz
- **Stripe**: https://dashboard.stripe.com

**Project Folder**: `/home/marek/Projects/ai-domo`

Good luck! 🎉
