import { supabase } from "./supabase";
import type { User, Room } from "./model";

export const services = {
  users: {
    getAllUsers: async () => {
      let { data, error } = await supabase
        .from("users")
        .select("*")
        .range(0, 9);

      return { users: data as User[], error };
    },
    getLeaderboards: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("total_points", { ascending: false, nullsFirst: false })
        .range(0, 9);

      return {
        users: data as User[],
        error,
      };
    },
    getMe: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return { user: null, rank: null, error: null };

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !user) return { user: null, rank: null, error };

      const { count, error: countError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("total_points", user.total_points);

      return {
        user: user as User,
        rank: (count || 0) + 1,
        error: countError,
      };
    },
    getUserById: async (id: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      return { user: data as User, error };
    },
  },
  rooms: {
    getAllRooms: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "Waiting")
        .order("created_at", { ascending: false });

      return { rooms: data as Room[], error };
    },
    getByNameOrCode: async (query: string) => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .or(`name.eq.${query},room_code.eq.${query}`)
        .single();

      return { room: data as Room, error };
    },
    createRoom: async (room: Partial<Room>) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert(room)
        .select()
        .single();

      return { room: data as Room, error };
    },
    updateRoom: async (id: string, updates: Partial<Room>) => {
      const { data, error } = await supabase
        .from("rooms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { room: data as Room, error };
    },
  },
  roomParticipants: {
    join: async (roomId: string, userId: string) => {
      const { error } = await supabase
        .from("room_participants")
        .insert({ room_id: roomId, user_id: userId });
      return { error };
    },
    leave: async (roomId: string, userId: string) => {
      const { error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", userId);
      return { error };
    },
    getParticipants: async (roomId: string) => {
      const { data, error } = await supabase
        .from("room_participants")
        .select("*, users(*)")
        .eq("room_id", roomId);

      // Flatten the structure to return User objects slightly enriched or just the list
      // But typically UI wants the User profile + maybe status.
      // For now, let's map it to a shape easier for the UI.
      const participants = data?.map((p: any) => ({
        ...p.users,
        joined_at: p.joined_at,
      })) as (User & { joined_at: string })[];

      return { participants, error };
    },
    subscribe: (roomId: string, callback: () => void) => {
      return supabase
        .channel(`room_participants:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "room_participants",
            filter: `room_id=eq.${roomId}`,
          },
          () => callback()
        )
        .subscribe();
    },
  },
};
