# Fix for User Registration Error

To resolve the "database error saving new user" issue, you need to add proper Row Level Security (RLS) policies to your Supabase database.

## Steps to Fix the Issue

1. **Log in to your Supabase Dashboard**:
   - Go to [https://app.supabase.io/](https://app.supabase.io/) and log in
   - Select your MshikoTap project

2. **Open the SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Following SQL Commands**:
   ```sql
   -- Add policy to allow inserting users from public
   CREATE POLICY "Users can insert their own profile" ON users
     FOR INSERT
     WITH CHECK (auth.uid() = id);
   
   -- Add policy to allow users to be registered from signup
   CREATE POLICY "Enable insert for authenticated users only" ON users
     FOR INSERT
     WITH CHECK (auth.role() = 'authenticated');
   
   -- This is a fallback policy to enable registration
   CREATE POLICY "Allow public user creation during signup" ON users
     FOR INSERT
     WITH CHECK (true);
   ```

4. **Click "Run" to execute the SQL**

5. **Verify the Policies Were Created**:
   ```sql
   -- Check existing policies
   SELECT
       schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual,
       with_check
   FROM
       pg_policies
   WHERE
       tablename = 'users';
   ```

## What This Does

These policies fix the issue by:

1. Allowing users to insert their own profile when their auth.uid matches the id
2. Allowing authenticated users to insert records
3. Adding a fallback policy to allow public registration

## After Applying the Fix

After adding these policies, try registering again. The error should be resolved, and users should be able to sign up successfully.

## If You're Still Having Issues

If you're still encountering errors after applying these changes, check the following:

1. **Verify your database schema** matches what's in the `database/schema.sql` file
2. **Check that the Supabase instance** is properly set up and running
3. **Look at the browser console** for more detailed error messages
4. **Examine the Supabase logs** in the dashboard for any authentication or database errors 