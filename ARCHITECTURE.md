# Architecture Overview - Smart Task Evaluator

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Next.js  │  │   Tailwind   │  │   ShadCN UI          │ │
│  │  App      │  │   CSS        │  │   Components         │ │
│  └───────────┘  └──────────────┘  └──────────────────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │ HTTP/WebSocket
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Server                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              App Router (Server Components)            │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  API Routes           │  Server Actions                │ │
│  │  • /api/tasks         │  • auth.ts                     │ │
│  │  • /api/payments      │  • tasks.ts                    │ │
│  │  • /api/webhooks      │                                │ │
│  └────────────────────────────────────────────────────────┘ │
└───┬──────────────────┬────────────────────┬─────────────────┘
    │                  │                    │
    ▼                  ▼                    ▼
┌───────────┐    ┌──────────┐      ┌───────────────┐
│  Supabase │    │  OpenAI  │      │    Stripe     │
│           │    │          │      │               │
│  • Auth   │    │  GPT-4   │      │  • Checkout   │
│  • DB     │    │  API     │      │  • Webhooks   │
│  • Storage│    │          │      │               │
└───────────┘    └──────────┘      └───────────────┘
```

## Data Flow

### 1. User Authentication

```
User → Login Page → Server Action (signIn)
  → Supabase Auth → Set Session Cookie
  → Redirect to Dashboard
```

### 2. Task Submission

```
User → Task Form → API Route (/api/tasks/create)
  → Validate Input
  → Store in Supabase
  → Return Task ID
  → Redirect to Task Page
```

### 3. AI Evaluation

```
User → Click "Evaluate" → API Route (/api/tasks/evaluate)
  → Fetch Task from DB
  → Send to OpenAI API
  ┌─→ Build Prompt
  │  → Call GPT-4
  │  → Parse JSON Response
  └─→ Retry on Failure (3x with backoff)
  → Update Task in DB
  → Return Results
```

### 4. Payment Flow

```
User → Click "Unlock" → API Route (/api/payments/create)
  → Create Stripe Session
  → Store Payment Record (pending)
  → Redirect to Stripe Checkout

Stripe → Payment Complete → Webhook (/api/webhooks/stripe)
  → Verify Signature
  → Update Payment Status
  → Unlock Task (is_paid = true)
  → Redirect User Back
```

## Component Hierarchy

```
RootLayout
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
└── Page Content
    ├── Dashboard
    │   ├── Stats Cards
    │   └── ReportHistoryTable
    │       └── Task Cards
    ├── New Task
    │   └── TaskForm
    │       ├── Title Input
    │       ├── Description Textarea
    │       └── File Upload
    └── Task Details
        ├── Task Info Card
        └── EvaluationResultCard
            ├── Score Display
            ├── Strengths List
            ├── Improvements List
            └── Unlock Button
```

## Database Schema

```sql
┌─────────────────────────────────────────────┐
│                 auth.users                  │
│  (Managed by Supabase Auth)                 │
├─────────────────────────────────────────────┤
│  id         UUID PRIMARY KEY                │
│  email      TEXT                            │
│  created_at TIMESTAMP                       │
└──────────────┬──────────────────────────────┘
               │ 1:N
               ▼
┌─────────────────────────────────────────────┐
│                    tasks                     │
├─────────────────────────────────────────────┤
│  id              UUID PRIMARY KEY            │
│  user_id         UUID FOREIGN KEY            │
│  title           TEXT NOT NULL               │
│  description     TEXT NOT NULL               │
│  file_url        TEXT                        │
│  ai_score        INTEGER (1-10)              │
│  strengths       TEXT[]                      │
│  improvements    TEXT[]                      │
│  is_paid         BOOLEAN DEFAULT FALSE       │
│  created_at      TIMESTAMP                   │
│  updated_at      TIMESTAMP                   │
└──────────────┬──────────────────────────────┘
               │ 1:N
               ▼
┌─────────────────────────────────────────────┐
│                  payments                    │
├─────────────────────────────────────────────┤
│  id                 UUID PRIMARY KEY         │
│  user_id            UUID FOREIGN KEY         │
│  task_id            UUID FOREIGN KEY         │
│  amount             INTEGER                  │
│  status             TEXT                     │
│  stripe_session_id  TEXT                     │
│  created_at         TIMESTAMP                │
└─────────────────────────────────────────────┘
```

## Security Layers

### 1. Row Level Security (RLS)

```sql
-- Users can only access their own tasks
CREATE POLICY "Users view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only modify their own tasks
CREATE POLICY "Users update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);
```

### 2. API Route Protection

```typescript
// Check authentication
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Verify ownership
const task = await supabase
  .from("tasks")
  .select()
  .eq("id", taskId)
  .eq("user_id", user.id)
  .single();
```

### 3. Input Validation

```typescript
const schema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
});

const validated = schema.parse(input);
```

## File Organization

### Directory Structure Logic

```
app/                    # Next.js App Router
├── actions/           # Server actions (mutations)
├── api/               # REST API endpoints
├── (pages)/           # Route pages
└── globals.css        # Global styles

components/            # Reusable React components
├── ui/                # Base UI components (ShadCN)
└── (custom)/          # Application-specific components

lib/                   # Business logic
├── ai/                # AI integration
├── stripe/            # Payment integration
└── supabase/          # Database client

types/                 # TypeScript definitions

supabase/              # Database migrations
```

## State Management

### Server State

- Supabase queries with automatic caching
- Server components fetch data directly
- Revalidation with `revalidatePath()`

### Client State

- React hooks (useState, useEffect)
- Toast notifications (Zustand-based)
- Form state in controlled components

### Authentication State

- Managed by Supabase Auth
- Session stored in HTTP-only cookies
- Middleware refreshes on each request

## API Design Patterns

### REST Endpoints

```
POST   /api/tasks/create       → Create task
POST   /api/tasks/evaluate     → Run evaluation
GET    /api/tasks/[id]         → Get task details
POST   /api/payments/create    → Create checkout
POST   /api/webhooks/stripe    → Handle webhooks
```

### Server Actions

```typescript
"use server";

export async function signIn(formData: FormData) {
  // Direct server-side mutation
  // Automatic revalidation
  // Type-safe
}
```

## Performance Optimizations

1. **Server Components**: Default to server rendering
2. **Lazy Loading**: Dynamic imports for heavy components
3. **Image Optimization**: Next.js Image component
4. **Database Indexes**: On user_id, created_at
5. **Caching**: Supabase query caching
6. **Edge Functions**: Middleware runs on edge

## Error Handling Strategy

```typescript
// API Routes
try {
  // Operation
} catch (error) {
  console.error("Context:", error);
  return NextResponse.json({ error: "User-friendly message" }, { status: 500 });
}

// AI Service
async function evaluateTask(input, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Call AI
    } catch (error) {
      if (attempt < maxRetries) {
        await delay(1000 * attempt); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}

// Client Components
const { toast } = useToast();
try {
  // Action
} catch (error) {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}
```

## Scalability Considerations

### Current Limits

- Free Supabase: 500MB DB, 1GB storage, 50K API requests/month
- Free Vercel: 100GB bandwidth, unlimited requests
- OpenAI: Rate limited by API tier

### Scaling Strategies

1. **Database**: Upgrade Supabase plan, add read replicas
2. **File Storage**: Move to S3/Cloudflare R2 for cheaper storage
3. **AI Calls**: Implement queue system, batch processing
4. **Caching**: Add Redis for session/query caching
5. **CDN**: Enable Vercel Edge Network

## Monitoring & Observability

### Key Metrics

- Authentication success rate
- Task creation → evaluation time
- Payment conversion rate
- AI evaluation accuracy
- API error rates

### Tools

- Supabase: Built-in analytics
- Vercel: Deployment logs, analytics
- Stripe: Payment dashboard
- OpenAI: Usage dashboard

---

This architecture supports ~1000 users with current free tier limits, and can scale to 100K+ users with paid plans and optimizations.
