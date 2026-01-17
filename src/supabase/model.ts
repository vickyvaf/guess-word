export interface User {
  id: string;
  email: string;
  name: string;
  full_name: string;
  avatar_url: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_code: string;
  host_id: string;
  max_players: number;
  max_lives: number;
  question_category: string;
  game_duration_seconds: number;
  status: "waiting" | "playing" | "finished";
  is_private: boolean;
  created_at: string;
}

export interface GameSession {
  id: string;
  room_id: string;
  status: "running" | "ended";
  started_at: string;
  ends_at: string | null;
  ended_at: string | null;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  game_session_id: string;
  user_id: string;
  lives_left: number;
  is_alive: boolean;
  current_question_id: string | null;
  question_expires_at: string | null;
  score: number;
  joined_at: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface PlayerAnswer {
  id: string;
  game_session_id: string;
  user_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  duration_ms: number;
  answered_at: string;
}
