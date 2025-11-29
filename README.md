# Smart Task Evaluator 🚀

A production-ready Mini-SaaS platform for AI-powered coding task evaluation. Built with Next.js 15, Supabase, Stripe, and OpenAI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🌟 Features

- **🔐 Authentication**: Secure user authentication with Supabase Auth
- **📝 Task Submission**: Upload coding tasks with descriptions and optional file attachments
- **🤖 AI Evaluation**: Automated code review using OpenAI GPT-4
- **📊 Detailed Feedback**: Get scores (1-10), strengths, and improvement suggestions
- **💳 Payment Integration**: Unlock full reports with Stripe payments
- **📜 Task History**: View all past evaluations and reports
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS and ShadCN components
- **🔒 Row Level Security**: Database security with Supabase RLS policies

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **ShadCN UI** - High-quality React components
- **Lucide Icons** - Beautiful icon set

### Backend

- **Supabase** - PostgreSQL database, authentication, and storage
- **Next.js API Routes** - Server-side API endpoints
- **Server Actions** - Type-safe server mutations

### Integrations

- **OpenAI API** - GPT-4 for code evaluation
- **Stripe** - Payment processing
- **Supabase Storage** - File uploads

## 📁 Project Structure

```
smart-task-evaluator/
├── app/
│   ├── actions/          # Server actions
│   │   ├── auth.ts       # Authentication actions
│   │   └── tasks.ts      # Task management actions
│   ├── api/              # API routes
│   │   ├── tasks/        # Task endpoints
│   │   │   ├── create/
│   │   │   ├── evaluate/
│   │   │   └── [id]/
│   │   ├── payments/     # Payment endpoints
│   │   └── webhooks/     # Stripe webhooks
│   ├── auth/             # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/        # Main dashboard
│   ├── tasks/            # Task pages
│   │   ├── new/
│   │   └── [id]/
│   ├── history/          # Task history
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # ShadCN components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   ├── navbar.tsx        # Navigation bar
│   ├── task-form.tsx     # Task submission form
│   ├── evaluation-result-card.tsx  # Results display
│   ├── report-history-table.tsx    # Task list
│   ├── loading.tsx       # Loading states
│   └── buggy-card.tsx    # ⚠️ Intentionally buggy component
├── lib/
│   ├── ai/
│   │   └── evaluator.ts  # AI evaluation service
│   ├── stripe/
│   │   └── client.ts     # Stripe integration
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client
│   │   ├── middleware.ts # Auth middleware
│   │   └── storage.ts    # File storage
│   ├── utils.ts          # Utility functions
│   └── buggy-utils.ts    # ⚠️ Intentionally buggy functions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── README.md         # Database documentation
├── types/
│   └── database.types.ts # TypeScript types
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- OpenAI API key
- Stripe account

### 1. Clone and Install

```bash
cd "GamutX MINI SaaS"
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPORT_UNLOCK_PRICE=999
```

### 3. Database Setup

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

#### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Execute the script

### 4. Stripe Setup

1. **Create Product**: In Stripe Dashboard, create a product for "Full AI Evaluation Report"
2. **Set Price**: Set price to $9.99 (or customize in `.env`)
3. **Webhook Configuration**:
   - Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `checkout.session.expired`
   - Copy webhook secret to `.env`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Tasks Table

| Column       | Type      | Description               |
| ------------ | --------- | ------------------------- |
| id           | UUID      | Primary key               |
| user_id      | UUID      | Foreign key to auth.users |
| title        | TEXT      | Task title                |
| description  | TEXT      | Task description          |
| file_url     | TEXT      | Optional file URL         |
| ai_score     | INTEGER   | Score from 1-10           |
| strengths    | TEXT[]    | Array of strengths        |
| improvements | TEXT[]    | Array of improvements     |
| is_paid      | BOOLEAN   | Report unlock status      |
| created_at   | TIMESTAMP | Creation time             |
| updated_at   | TIMESTAMP | Last update time          |

### Payments Table

| Column            | Type      | Description               |
| ----------------- | --------- | ------------------------- |
| id                | UUID      | Primary key               |
| user_id           | UUID      | Foreign key to auth.users |
| task_id           | UUID      | Foreign key to tasks      |
| amount            | INTEGER   | Amount in cents           |
| status            | TEXT      | Payment status            |
| stripe_session_id | TEXT      | Stripe session ID         |
| created_at        | TIMESTAMP | Creation time             |

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Server-Side Authentication**: Auth checks on all protected routes
- **Input Validation**: Zod schema validation on API routes
- **Environment Variables**: Sensitive keys stored securely
- **Webhook Signature Verification**: Stripe webhook authentication

## 🎨 UI Components

All UI components are built with ShadCN and fully customizable:

- `Button` - Primary action buttons
- `Card` - Content containers
- `Input` / `Textarea` - Form inputs
- `Label` - Form labels
- `Toast` - Notification system

Custom application components:

- `Navbar` - Top navigation with auth
- `TaskForm` - Task submission form
- `EvaluationResultCard` - AI results display with unlock feature
- `ReportHistoryTable` - Task list with actions

## 🤖 AI Evaluation

The AI evaluation system uses OpenAI GPT-4 to analyze coding tasks:

**Input**:

- Task title
- Task description
- Optional code file content

**Output**:

```json
{
  "score": 8,
  "strengths": [
    "Clean code structure",
    "Good error handling",
    "Well documented"
  ],
  "improvements": [
    "Consider edge cases",
    "Add unit tests",
    "Optimize performance"
  ]
}
```

**Features**:

- Automatic retry with exponential backoff
- Response validation
- Error handling
- Configurable prompts

## 💳 Payment Flow

1. User submits task and receives free preview (score + first strength/improvement)
2. Click "Unlock for $9.99" button
3. Redirect to Stripe Checkout
4. After successful payment:
   - Webhook updates database
   - `is_paid` flag set to `true`
   - Full report unlocked

## ⚠️ Intentionally Buggy Files

For debugging demonstration purposes, the following files contain intentional bugs:

### 1. `components/buggy-card.tsx`

**Bugs**:

- Missing import for Button component
- Incorrect useState initialization
- Missing key prop in list rendering
- Typo in variable name (`isLoadin`)
- Off-by-one error in array access

### 2. `app/api/buggy-tasks/route.ts`

**Bugs**:

- Missing authentication checks
- No input validation
- Incorrect HTTP status codes
- Missing error handling
- Security vulnerability (accepting userId from client)
- No pagination on GET endpoint

### 3. `lib/buggy-utils.ts`

**Bugs**:

- Inefficient O(n²) algorithms
- Memory leaks (uncleared intervals)
- Type coercion issues (== vs ===)
- Missing error handling
- Array mutation
- Race conditions

## 📝 API Routes

### Tasks

- `POST /api/tasks/create` - Create new task
- `POST /api/tasks/evaluate` - Run AI evaluation
- `GET /api/tasks/[id]` - Get task details

### Payments

- `POST /api/payments/create` - Create Stripe checkout session

### Webhooks

- `POST /api/webhooks/stripe` - Handle Stripe events

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update `NEXT_PUBLIC_APP_URL` to your production domain.

### Stripe Webhook in Production

1. Update webhook endpoint URL to production domain
2. Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [ShadCN UI](https://ui.shadcn.com)

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your needs.

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🆘 Troubleshooting

### Common Issues

**1. Supabase Connection Error**

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check if database migrations have been applied

**2. OpenAI API Error**

- Verify `OPENAI_API_KEY` is valid
- Check API usage limits

**3. Stripe Webhook Not Working**

- Verify webhook secret matches Stripe dashboard
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**4. Authentication Issues**

- Clear browser cookies
- Check Supabase Auth settings (email confirmation, etc.)

## 📞 Support

For issues and questions:

- Check the documentation above
- Review the intentionally buggy files for learning
- Examine the database schema and RLS policies

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**
