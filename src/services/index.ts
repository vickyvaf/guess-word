export interface LeaderboardUser {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  playerName?: string;
}

export const services = {
  users: {
    // Get all unique users dari leaderboard localStorage
    // Lebih sederhana karena tidak perlu table terpisah
    getAllUsers: async (): Promise<LeaderboardUser[]> => {
      try {
        const saved = localStorage.getItem("leaderboard");
        if (!saved) return [];

        const entries = JSON.parse(saved);
        
        // Extract unique users berdasarkan email (atau playerName jika tidak ada email)
        const userMap = new Map<string, LeaderboardUser>();
        
        entries.forEach((entry: any) => {
          const key = entry.email || entry.playerName || 'anonymous';
          
          // Skip jika sudah ada user dengan email yang sama
          if (entry.email && userMap.has(entry.email)) {
            return;
          }
          
          // Skip jika sudah ada user dengan key yang sama
          if (userMap.has(key)) {
            return;
          }

          userMap.set(key, {
            email: entry.email,
            fullName: entry.fullName,
            avatarUrl: entry.avatarUrl,
            playerName: entry.playerName,
          });
        });

        return Array.from(userMap.values());
      } catch (error) {
        console.error("Error getting users from leaderboard:", error);
        return [];
      }
    },
  }
};
