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