# Supabase Setup Guide for Mshiko Tap

This guide will help you set up your Supabase database for the Mshiko Tap application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com/](https://supabase.com/)
2. Create a new project in Supabase

## Database Setup

### Option 1: Using the SQL Editor

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor tab
3. Create a new query
4. Copy and paste the contents of the `supabase_schema.sql` file into the SQL editor
5. Run the query to create all tables, functions, and policies

### Option 2: Using the API

1. Open the terminal in your project directory
2. Run the following command to execute the SQL script:
   ```bash
   supabase db execute --file supabase_schema.sql
   ```
   Note: You'll need the Supabase CLI installed for this option.

## Authentication Setup

1. In your Supabase project dashboard, go to Authentication > Settings
2. Enable Email auth provider
3. (Optional) Configure additional auth providers as needed
4. Go to Authentication > URL Configuration 
5. Add your site URL and redirect URLs (for local development, use `http://localhost:3000`)

## API Keys

You'll need these API keys for your `.env.local` file:

1. Go to Project Settings > API
2. Find your "Project URL" (this is your `NEXT_PUBLIC_SUPABASE_URL`)
3. Find your "anon" key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Copy these values to your `.env.local` file

## Database Structure

The database consists of the following tables:

1. **user_profiles** - User information and statistics
2. **tasks** - Available tasks for users to complete
3. **user_tasks** - Tasks that users have started or completed
4. **withdrawal_requests** - Withdrawal requests from users

## Row Level Security (RLS)

The database is configured with Row Level Security to ensure that:

- Users can only access their own data
- Admins can access all data
- Only admins can create, update, and delete tasks
- Users can create withdrawal requests, but only admins can approve/reject them

## Functions and Triggers

The database includes several functions and triggers:

1. **get_admin_dashboard_stats()** - Retrieves statistics for the admin dashboard
2. **update_user_balance_on_task_completion()** - Updates user balance when a task is completed
3. **process_withdrawal()** - Processes withdrawal requests
4. **handle_new_user()** - Creates a user profile when a new user signs up

## Sample Data

The schema includes sample data to help you get started. This includes:

- A test admin user
- Several sample tasks of different types

## Additional Configuration

### Storage

If you plan to use Supabase Storage for task proof uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "task_proofs"
3. Configure the bucket permissions as needed

### Edge Functions (Optional)

For advanced features like automated task verification:

1. Go to Edge Functions in your Supabase dashboard
2. Create a new function as needed
3. Deploy the function using the Supabase CLI

## Troubleshooting

If you encounter any issues:

1. Check the SQL logs in your Supabase dashboard
2. Ensure all extensions are properly enabled
3. Verify that RLS policies are correctly applied

For more help, refer to the [Supabase documentation](https://supabase.com/docs) or reach out to the community. 