# Quick Reference - Smart Task Evaluator

## Essential Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler check

# Supabase
supabase link --project-ref YOUR_REF    # Link to project
supabase db push                         # Push migrations
supabase db pull                         # Pull remote schema
supabase db reset                        # Reset local database

# Stripe CLI (Local Testing)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Project File Count

- **Total Files**: 70+
- **React Components**: 15
- **API Routes**: 6
- **Pages**: 8
- **Utilities**: 10

## Key Files Quick Access

### Configuration

- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Styling config
- `next.config.js` - Next.js config
- `.env.example` - Environment template

### Database

- `supabase/migrations/20240101000000_initial_schema.sql` - DB schema
- `types/database.types.ts` - TypeScript types

### Authentication

- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `app/actions/auth.ts` - Auth actions
- `middleware.ts` - Session refresh

### Core Features

- `lib/ai/evaluator.ts` - AI evaluation logic
- `lib/stripe/client.ts` - Payment integration
- `app/api/tasks/evaluate/route.ts` - Evaluation endpoint
- `app/api/webhooks/stripe/route.ts` - Payment webhook

### UI Components

- `components/navbar.tsx` - Navigation
- `components/task-form.tsx` - Task submission
- `components/evaluation-result-card.tsx` - Results display
- `components/report-history-table.tsx` - Task list

### Pages

- `app/auth/login/page.tsx` - Login
- `app/auth/signup/page.tsx` - Sign up
- `app/dashboard/page.tsx` - Dashboard
- `app/tasks/new/page.tsx` - New task
- `app/tasks/[id]/page.tsx` - Task details
- `app/history/page.tsx` - Task history

### Intentionally Buggy (For Learning)

- `components/buggy-card.tsx` - Buggy React component
- `app/api/buggy-tasks/route.ts` - Buggy API
- `lib/buggy-utils.ts` - Buggy utility functions

## Environment Variables Checklist

```env
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
✓ OPENAI_API_KEY
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✓ STRIPE_SECRET_KEY
✓ STRIPE_WEBHOOK_SECRET
✓ NEXT_PUBLIC_APP_URL
✓ REPORT_UNLOCK_PRICE
```

## API Endpoints Reference

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/api/tasks/create`    | Create new task         |
| POST   | `/api/tasks/evaluate`  | Run AI evaluation       |
| GET    | `/api/tasks/[id]`      | Get task details        |
| POST   | `/api/payments/create` | Create checkout session |
| POST   | `/api/webhooks/stripe` | Handle Stripe events    |

## Database Tables

| Table        | Purpose                          |
| ------------ | -------------------------------- |
| `tasks`      | Store user tasks and evaluations |
| `payments`   | Track payment transactions       |
| `auth.users` | User accounts (Supabase Auth)    |

## Stripe Test Cards

| Card Number         | Description        |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined payment   |
| 4000 0000 0000 0002 | Card declined      |

Use any future expiry date and any 3-digit CVC.

## Common Routes

| Route          | Description                         |
| -------------- | ----------------------------------- |
| `/`            | Home (redirects to dashboard/login) |
| `/auth/login`  | Login page                          |
| `/auth/signup` | Sign up page                        |
| `/dashboard`   | Main dashboard                      |
| `/tasks/new`   | Create new task                     |
| `/tasks/[id]`  | View task details                   |
| `/history`     | View all tasks                      |

## Useful Snippets

### Create New Task (curl)

```bash
curl -X POST http://localhost:3000/api/tasks/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Binary Search",
    "description": "Implemented binary search algorithm"
  }'
```

### Check Supabase Connection

```typescript
const supabase = createClient();
const { data, error } = await supabase.from("tasks").select("count");
console.log({ data, error });
```

### Test AI Evaluation Locally

```typescript
import { evaluateTask } from "@/lib/ai/evaluator";

const result = await evaluateTask({
  title: "Test Task",
  description: "Test description",
});
```

## Troubleshooting Quick Fixes

### Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

### Reset Database (Local)

```bash
supabase db reset
```

### View Supabase Logs

```bash
supabase logs
```

### Test Stripe Webhook

```bash
stripe trigger checkout.session.completed
```

## Performance Tips

1. **Images**: Use `next/image` component
2. **Server Components**: Default to server, add 'use client' only when needed
3. **Database Queries**: Use select() to limit columns
4. **API Routes**: Add proper error handling
5. **Caching**: Use `revalidatePath()` after mutations

## Security Reminders

- ✓ Never commit `.env.local`
- ✓ Use service role key only on server
- ✓ Verify webhook signatures
- ✓ Validate all user inputs
- ✓ Enable RLS on all tables
- ✓ Use HTTPS in production

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Stripe webhook URL updated
- [ ] Domain configured
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Check error logging

## Support Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **OpenAI**: https://platform.openai.com/docs
- **Tailwind**: https://tailwindcss.com/docs

---

**Project Status**: ✅ Production Ready

All core features implemented and tested. Ready for deployment with minimal configuration.
