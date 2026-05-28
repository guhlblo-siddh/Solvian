# Solvian Email AI — Deployment Guide (v16)

## Deploy to Vercel in 5 minutes

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Solvian v16"
git remote add origin https://github.com/DEIN-USERNAME/solvian.git
git push -u origin main
```

### Step 2 — Connect to Vercel
1. Go to vercel.com → New Project
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Click Deploy

### Step 3 — Add Environment Variables
In Vercel → Project → Settings → Environment Variables, add:

```
ANTHROPIC_API_KEY           = sk-ant-api03-...
NEXT_PUBLIC_SUPABASE_URL    = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY   = eyJ...
STRIPE_SECRET_KEY           = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET       = whsec_...
GOOGLE_CLIENT_ID            = xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET        = GOCSPX-...
NEXT_PUBLIC_APP_URL         = https://dein-projekt.vercel.app
```

### Step 4 — Update Google OAuth
In Google Cloud Console → Credentials → OAuth Client:
- Authorized redirect URIs: add https://dein-projekt.vercel.app/api/gmail/callback

### Step 5 — Update Supabase
In Supabase → Authentication → URL Configuration:
- Site URL: https://dein-projekt.vercel.app
- Redirect URLs: https://dein-projekt.vercel.app/**

### Step 6 — Stripe Webhook
In Stripe Dashboard → Webhooks → Add endpoint:
- URL: https://dein-projekt.vercel.app/api/webhook
- Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed

### Custom Domain (optional)
Vercel → Project → Settings → Domains → Add your domain

---

## Local Development
```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
```

## Build Check
```bash
npm run build   # check for errors before deploying
```