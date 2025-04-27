-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create function to generate short random IDs
CREATE OR REPLACE FUNCTION generate_short_id(length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create tables
-- 1. Users Table (profiles extending the Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id),
  short_id TEXT PRIMARY KEY DEFAULT generate_short_id(),
  email TEXT NOT NULL,
  full_name TEXT,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user',
  referral_code TEXT UNIQUE DEFAULT generate_short_id(6),
  referred_by TEXT REFERENCES user_profiles(referral_code),
  referral_earnings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TYPE task_type AS ENUM ('youtube', 'tiktok', 'instagram', 'survey', 'website', 'app');
CREATE TYPE task_status AS ENUM ('active', 'completed', 'expired');

CREATE TABLE tasks (
  id TEXT PRIMARY KEY DEFAULT generate_short_id(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type task_type NOT NULL,
  reward DECIMAL(10, 2) NOT NULL,
  referral_bonus DECIMAL(10, 2) DEFAULT 0,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status task_status DEFAULT 'active',
  requirements JSONB
);

-- 3. User Tasks Table
CREATE TYPE user_task_status AS ENUM ('pending', 'completed', 'rejected');

CREATE TABLE user_tasks (
  id TEXT PRIMARY KEY DEFAULT generate_short_id(),
  user_id TEXT REFERENCES user_profiles(short_id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status user_task_status DEFAULT 'pending',
  proof TEXT,
  reward DECIMAL(10, 2) NOT NULL,
  UNIQUE (user_id, task_id)
);

-- 4. Withdrawal Requests Table
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE withdrawal_requests (
  id TEXT PRIMARY KEY DEFAULT generate_short_id(),
  user_id TEXT REFERENCES user_profiles(short_id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details TEXT NOT NULL,
  status withdrawal_status DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Referrals Tracking Table
CREATE TABLE referrals (
  id TEXT PRIMARY KEY DEFAULT generate_short_id(),
  referrer_id TEXT REFERENCES user_profiles(short_id) ON DELETE CASCADE,
  referred_id TEXT REFERENCES user_profiles(short_id) ON DELETE CASCADE,
  reward DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (referrer_id, referred_id)
);

-- Create functions for admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  totalUsers BIGINT,
  activeUsers BIGINT,
  totalTasks BIGINT,
  completedTasks BIGINT,
  totalPayout DECIMAL,
  pendingWithdrawals BIGINT,
  totalReferrals BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM user_profiles) AS totalUsers,
    (SELECT COUNT(*) FROM user_profiles WHERE created_at > NOW() - INTERVAL '30 days') AS activeUsers,
    (SELECT COUNT(*) FROM tasks) AS totalTasks,
    (SELECT COUNT(*) FROM user_tasks WHERE status = 'completed') AS completedTasks,
    (SELECT COALESCE(SUM(amount), 0) FROM withdrawal_requests WHERE status = 'approved') AS totalPayout,
    (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'pending') AS pendingWithdrawals,
    (SELECT COUNT(*) FROM referrals) AS totalReferrals;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user balance after task completion
CREATE OR REPLACE FUNCTION update_user_balance_on_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id TEXT;
  referral_bonus DECIMAL(10, 2);
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    -- Get task details
    SELECT t.referral_bonus INTO referral_bonus
    FROM tasks t
    WHERE t.id = NEW.task_id;
    
    -- Update user balance and total earnings
    UPDATE user_profiles
    SET balance = balance + NEW.reward,
        total_earnings = total_earnings + NEW.reward,
        completed_tasks = completed_tasks + 1
    WHERE short_id = NEW.user_id;
    
    -- Check if user was referred and update referrer's earnings if applicable
    SELECT referred_by INTO referrer_id
    FROM user_profiles
    WHERE short_id = NEW.user_id;
    
    IF referrer_id IS NOT NULL AND referral_bonus > 0 THEN
      -- Update referrer's balance and referral earnings
      UPDATE user_profiles
      SET balance = balance + referral_bonus,
          total_earnings = total_earnings + referral_bonus,
          referral_earnings = referral_earnings + referral_bonus
      WHERE referral_code = referrer_id;
      
      -- Log the referral reward
      UPDATE referrals
      SET reward = reward + referral_bonus,
          status = 'rewarded'
      WHERE referrer_id = (SELECT short_id FROM user_profiles WHERE referral_code = referrer_id)
        AND referred_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user balance
CREATE TRIGGER update_balance_after_task_completion
AFTER UPDATE ON user_tasks
FOR EACH ROW
EXECUTE FUNCTION update_user_balance_on_task_completion();

-- Create function for withdrawal processing
CREATE OR REPLACE FUNCTION process_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Deduct from user balance
    UPDATE user_profiles
    SET balance = balance - NEW.amount
    WHERE short_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for withdrawal processing
CREATE TRIGGER process_withdrawal_after_approval
AFTER UPDATE ON withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION process_withdrawal();

-- Function to handle referrals
CREATE OR REPLACE FUNCTION handle_referral()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id TEXT;
BEGIN
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by <> '' THEN
    -- Get referrer's ID
    SELECT short_id INTO referrer_id
    FROM user_profiles
    WHERE referral_code = NEW.referred_by;
    
    IF referrer_id IS NOT NULL THEN
      -- Create a referral record
      INSERT INTO referrals (referrer_id, referred_id, status)
      VALUES (referrer_id, NEW.short_id, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling referrals
CREATE TRIGGER handle_referral_after_insert
AFTER INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION handle_referral();

-- Create RLS (Row Level Security) policies
-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Anyone can view active tasks"
  ON tasks FOR SELECT
  USING (status = 'active' OR 
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update tasks"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User tasks policies
CREATE POLICY "Users can view their own tasks"
  ON user_tasks FOR SELECT
  USING (user_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can view all user tasks"
  ON user_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own tasks"
  ON user_tasks FOR INSERT
  WITH CHECK (user_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own tasks"
  ON user_tasks FOR UPDATE
  USING (user_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Withdrawal requests policies
CREATE POLICY "Users can view their own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (user_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can view all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (user_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can update withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Referrals policies
CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (referrer_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ) OR referred_id IN (
    SELECT short_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can view all referrals"
  ON referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create a user profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  referral_code TEXT;
BEGIN
  -- Extract referral code from metadata if it exists
  referral_code := NEW.raw_user_meta_data->>'referral_code';
  
  INSERT INTO user_profiles (id, email, full_name, role, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    referral_code
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a user profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Sample data for testing (optional, comment out for production)
-- Insert a test admin user (you'll need to create this user in Auth)
INSERT INTO user_profiles (id, short_id, email, full_name, role, referral_code)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'ADMIN01', 'admin@example.com', 'Admin User', 'admin', 'ADMIN1');

-- Insert some sample tasks
INSERT INTO tasks (id, title, description, type, reward, referral_bonus, url)
VALUES
  ('TASK001', 'Watch YouTube Product Review', 'Watch this product review video and provide feedback on the presented features.', 'youtube', 0.75, 0.10, 'https://youtube.com/watch?v=sample1'),
  ('TASK002', 'Engage with TikTok Content', 'Watch this short TikTok clip and engage with the content by liking and commenting.', 'tiktok', 0.50, 0.05, 'https://tiktok.com/@creator/video/sample1'),
  ('TASK003', 'Instagram Post Feedback', 'View this Instagram post and provide feedback on the content quality and engagement level.', 'instagram', 0.60, 0.08, 'https://instagram.com/p/sample1'),
  ('TASK004', 'Product Satisfaction Survey', 'Complete a short 5-minute survey about your experience with mobile payment apps.', 'survey', 1.25, 0.15, 'https://forms.example.com/survey1'),
  ('TASK005', 'Test New E-commerce Website', 'Visit this new e-commerce platform, create an account, and navigate through the product categories.', 'website', 1.00, 0.12, 'https://newstore.example.com'),
  ('TASK006', 'Mobile App Beta Testing', 'Download and test this new productivity app. Provide feedback on usability and any bugs encountered.', 'app', 2.00, 0.25, 'https://apps.example.com/download/app1'); 