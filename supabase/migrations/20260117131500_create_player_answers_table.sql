CREATE TABLE player_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),

  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  duration_ms INT NOT NULL,

  answered_at TIMESTAMP DEFAULT now(),

  UNIQUE (game_session_id, user_id, question_id)
);
