CREATE TABLE room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  lives_left INT NOT NULL,
  is_alive BOOLEAN DEFAULT true,

  current_question_id UUID REFERENCES questions(id),
  question_expires_at TIMESTAMP,

  joined_at TIMESTAMP DEFAULT now(),

  UNIQUE (game_session_id, user_id)
);
