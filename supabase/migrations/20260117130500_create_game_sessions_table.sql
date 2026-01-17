CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,

  status VARCHAR(20) NOT NULL DEFAULT 'running', -- running | ended
  started_at TIMESTAMP DEFAULT now(),
  ends_at TIMESTAMP,
  ended_at TIMESTAMP
);
