-- ==============================================================================
-- ESCAPE GAMING LOUNGE - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create Profiles Table (Customer Auth & Details)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  total_points_balance INT DEFAULT 0,
  qr_code_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Stations Table (Real-time live status for PS5, SimRacing & VR)
CREATE TABLE IF NOT EXISTS public.stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'ps5', 'simracing', 'vr'
  description TEXT,
  image TEXT,
  specs JSONB,
  status TEXT DEFAULT 'available', -- 'available', 'in-use', 'maintenance'
  current_session JSONB, -- active timer details
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Bookings Table (Slot Reservations & Confirmation Logs)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_id TEXT REFERENCES public.profiles(id),
  station_id TEXT REFERENCES public.stations(id),
  station_type TEXT NOT NULL,
  sim_mode TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  controllers_count INT DEFAULT 2,
  extra_persons_count INT DEFAULT 0,
  total_cost NUMERIC(10, 2) NOT NULL,
  redeemed_points INT DEFAULT 0,
  is_reward_booking BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Reward Points Table (Strict 30-Day Expiration Ledger)
CREATE TABLE IF NOT EXISTS public.reward_points (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INT NOT NULL,
  earned_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ NOT NULL, -- Calculated as (earned_date + INTERVAL '30 days')
  is_expired BOOLEAN DEFAULT FALSE,
  is_redeemed BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Notification Dispatches Table (SMS & Email Logs)
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  sms_content TEXT NOT NULL,
  email_subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUTO EXPIRATION FUNCTION FOR 30-DAY REWARD TOKENS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_30day_reward_expirations()
RETURNS VOID AS $$
BEGIN
  UPDATE public.reward_points
  SET is_expired = TRUE
  WHERE is_expired = FALSE 
    AND is_redeemed = FALSE 
    AND expiry_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Realtime for Stations & Bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.stations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reward_points;

-- RLS Policies (Allow read/write for client app)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read stations" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Allow public update stations" ON public.stations FOR ALL USING (true);

CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR ALL USING (true);

CREATE POLICY "Allow public read reward_points" ON public.reward_points FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update reward_points" ON public.reward_points FOR ALL USING (true);

CREATE POLICY "Allow public notifications" ON public.notifications FOR ALL USING (true);
