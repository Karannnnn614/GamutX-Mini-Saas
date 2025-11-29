# Supabase Database Schema

This directory contains SQL migrations for the Smart Task Evaluator database.

## Tables

### tasks

Stores user-submitted coding tasks and AI evaluation results.

| Column       | Type      | Description                     |
| ------------ | --------- | ------------------------------- |
| id           | UUID      | Primary key                     |
| user_id      | UUID      | Foreign key to auth.users       |
| title        | TEXT      | Task title                      |
| description  | TEXT      | Task description                |
| file_url     | TEXT      | Optional uploaded file URL      |
| ai_score     | INTEGER   | AI evaluation score (1-10)      |
| strengths    | TEXT[]    | Array of identified strengths   |
| improvements | TEXT[]    | Array of suggested improvements |
| is_paid      | BOOLEAN   | Whether full report is unlocked |
| created_at   | TIMESTAMP | Creation timestamp              |
| updated_at   | TIMESTAMP | Last update timestamp           |

### payments

Tracks payment transactions for report unlocking.

| Column            | Type      | Description                |
| ----------------- | --------- | -------------------------- |
| id                | UUID      | Primary key                |
| user_id           | UUID      | Foreign key to auth.users  |
| task_id           | UUID      | Foreign key to tasks       |
| amount            | INTEGER   | Amount in cents            |
| status            | TEXT      | Payment status             |
| stripe_session_id | TEXT      | Stripe checkout session ID |
| created_at        | TIMESTAMP | Creation timestamp         |

## Running Migrations

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Push migrations: `supabase db push`

Or run the SQL directly in the Supabase SQL Editor.
