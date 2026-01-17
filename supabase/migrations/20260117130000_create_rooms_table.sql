CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(10) UNIQUE NOT NULL,

  host_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  max_players INT NOT NULL,
  max_lives INT NOT NULL,
  question_category VARCHAR(50) NOT NULL,

  game_duration_seconds INT NOT NULL DEFAULT 600,

  status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- waiting | playing | finished
  is_private BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT now()
);
