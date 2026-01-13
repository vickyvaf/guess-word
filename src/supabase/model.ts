export interface User {
  id: string;
  email: string;
  name: string;
  full_name: string;
  iss: string;
  sub: string;
  provider_id: string;
  avatar_url: string;
  picture: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  total_points: number;
}

export interface Room {
  id: string;
  name: string;
  room_code: string;
  status: "Waiting" | "Playing" | "Finished";
  created_at: string;
  created_by: string;
  host_id: string;
  participants: number;
  max_players: number;
  is_private: boolean;
  current_round: number;
  total_rounds: number;
  current_drawer_id: string | null;
  current_word: string | null;
  round_expires_at: string | null;
}

export interface RoomParticipant {
  room_id: string;
  user_id: string;
  joined_at: string;
  score: number;
}
