CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- or REFERENCES auth.users(id) if referencing Supabase Auth
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  full_name VARCHAR,
  avatar_url TEXT,
  total_points INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);