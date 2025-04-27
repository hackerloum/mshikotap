-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT REFERENCES users(referral_code),
  CONSTRAINT wallet_balance_positive CHECK (wallet_balance >= 0)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'social_follow', 'survey', 'website_visit')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  requirements JSONB NOT NULL,
  CONSTRAINT reward_positive CHECK (reward > 0)
);

-- Create task_completions table
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'rejected')),
  proof JSONB NOT NULL,
  UNIQUE (user_id, task_id)
);

-- Create withdrawals table
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_method JSONB NOT NULL,
  CONSTRAINT amount_positive CHECK (amount > 0)
);

-- Create function to generate random referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate referral code for new users
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    LOOP
      NEW.referral_code := generate_referral_code();
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM users WHERE referral_code = NEW.referral_code
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_referral_code
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_referral_code();

-- Create function to update user wallet balance after task completion
CREATE OR REPLACE FUNCTION update_wallet_on_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE users
    SET wallet_balance = wallet_balance + (
      SELECT reward FROM tasks WHERE id = NEW.task_id
    )
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_on_task_completion
AFTER UPDATE ON task_completions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_on_task_completion();

-- Create function to update user wallet balance after withdrawal approval
CREATE OR REPLACE FUNCTION update_wallet_on_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE users
    SET wallet_balance = wallet_balance - NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_on_withdrawal
AFTER UPDATE ON withdrawals
FOR EACH ROW
EXECUTE FUNCTION update_wallet_on_withdrawal();

-- Create indexes for better query performance
CREATE INDEX idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Anyone can read active tasks
CREATE POLICY "Anyone can view active tasks" ON tasks
  FOR SELECT
  USING (status = 'active');

-- Users can create task completions
CREATE POLICY "Users can create task completions" ON task_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view own task completions
CREATE POLICY "Users can view own task completions" ON task_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create withdrawals
CREATE POLICY "Users can create withdrawals" ON withdrawals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view own withdrawals
CREATE POLICY "Users can view own withdrawals" ON withdrawals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow public user creation during signup
CREATE POLICY "Allow public user creation during signup" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id); 