# Smart Task Evaluator - Setup Guide

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Created Supabase project
- [ ] Obtained OpenAI API key
- [ ] Created Stripe account
- [ ] Cloned repository
- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env.local` with all keys
- [ ] Ran database migrations
- [ ] Configured Stripe webhook
- [ ] Started dev server (`npm run dev`)

## Detailed Setup Steps

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to provision (2-3 minutes)
4. Go to Settings → API
5. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY` (Keep secret!)

### 2. Database Migration

Go to SQL Editor in Supabase Dashboard and run the migration:

```sql
-- Copy contents from: supabase/migrations/20240101000000_initial_schema.sql
```

Or use Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 3. Storage Bucket Setup

1. In Supabase Dashboard, go to Storage
2. Bucket `task-files` should be created automatically by migration
3. If not, create it manually:
   - Name: `task-files`
   - Public: `true`

### 4. OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Go to API Keys section
4. Create new secret key
5. Copy to `OPENAI_API_KEY`

**Note**: GPT-4 access required. Check your OpenAI account tier.

### 5. Stripe Configuration

#### Create Product:

1. Go to Stripe Dashboard → Products
2. Click "Add product"
3. Name: "Full AI Evaluation Report"
4. Price: $9.99 USD (one-time)
5. Save

#### Get API Keys:

1. Go to Developers → API Keys
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

#### Setup Webhook (for local development):

```bash
# Install Stripe CLI
# Windows (with Chocolatey):
choco install stripe-cli

# Listen to events
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
```

#### Setup Webhook (for production):

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `checkout.session.async_payment_failed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 6. Environment Variables

Create `.env.local`:

```env
# Required for Development
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-proj-...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
REPORT_UNLOCK_PRICE=999
```

### 7. Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### 8. Test the Application

1. **Sign Up**: Create a new account at `/auth/signup`
2. **Verify Email**: Check your email for verification link (if enabled in Supabase)
3. **Create Task**: Go to `/tasks/new` and submit a task
4. **Run Evaluation**: Click "Run AI Evaluation" on task page
5. **View Results**: See score and preview
6. **Test Payment**: Click "Unlock for $9.99" (use Stripe test cards)
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables (all from `.env.local`)
5. Update `NEXT_PUBLIC_APP_URL` to your production domain
6. Deploy

### Post-Deployment

1. Update Stripe webhook URL to production domain
2. Get new webhook secret and update environment variable
3. Test full flow in production
4. Monitor Vercel logs and Stripe dashboard

## Alternative AI Providers

### Using Groq (faster, cheaper)

1. Get API key from [groq.com](https://groq.com)
2. Install: `npm install groq-sdk`
3. Uncomment Groq implementation in `lib/ai/evaluator.ts`
4. Add `GROQ_API_KEY` to environment variables

### Using Anthropic Claude

1. Get API key from [anthropic.com](https://anthropic.com)
2. Install: `npm install @anthropic-ai/sdk`
3. Implement similar to OpenAI in `lib/ai/evaluator.ts`
4. Add `ANTHROPIC_API_KEY` to environment variables

## Cost Estimates

### Development/Testing:

- Supabase: Free tier (500MB database, 1GB file storage)
- OpenAI: ~$0.03 per evaluation (GPT-4 Turbo)
- Stripe: Free in test mode

### Production (100 users, 500 evaluations/month):

- Supabase: ~$25/month (Pro plan recommended)
- OpenAI: ~$15/month (500 \* $0.03)
- Stripe: 2.9% + $0.30 per successful payment
- Hosting: Free (Vercel Hobby) or $20/month (Pro)

**Total**: ~$40-65/month + transaction fees

## Security Checklist

- [ ] All environment variables in `.env.local` (not committed)
- [ ] Row Level Security enabled on all tables
- [ ] Service role key never exposed to client
- [ ] Stripe webhook signature verified
- [ ] Input validation on all API routes
- [ ] HTTPS enabled in production
- [ ] CORS properly configured

## Troubleshooting

### "Error: Invalid API Key"

- Check if key is copied correctly (no extra spaces)
- Verify key has proper permissions
- For OpenAI, ensure GPT-4 access is enabled

### "Database connection failed"

- Verify Supabase URL and keys
- Check if project is paused (free tier inactivity)
- Ensure database migrations ran successfully

### "Stripe webhook not receiving events"

- In development: Ensure Stripe CLI is running
- In production: Check webhook URL is accessible
- Verify webhook secret matches Stripe dashboard

### "Authentication not working"

- Clear browser cookies
- Check Supabase Auth settings
- Verify email confirmation is disabled for testing (or check email)

## Support & Resources

- **Supabase**: [Discord](https://discord.supabase.com) | [Docs](https://supabase.com/docs)
- **Stripe**: [Support](https://support.stripe.com) | [Docs](https://stripe.com/docs)
- **OpenAI**: [Forum](https://community.openai.com) | [Docs](https://platform.openai.com/docs)
- **Next.js**: [Discord](https://discord.gg/nextjs) | [Docs](https://nextjs.org/docs)

---

Happy coding! 🚀
