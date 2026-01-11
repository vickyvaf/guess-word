import { supabase } from "./supabase";
import type { User } from "./model";

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
      let { data, error } = await supabase
        .from("users")
        .select("*")
        .range(0, 9)
        .order("total_points", { ascending: false });

      return { users: data as User[], error };
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
  },
};
