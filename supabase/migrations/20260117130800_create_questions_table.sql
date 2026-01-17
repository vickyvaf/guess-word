CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);
