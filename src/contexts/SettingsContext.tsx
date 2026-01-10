import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

interface SettingsContextType {
  volume: number;
  backgroundMusicVolume: number;
  setVolume: (volume: number) => void;
  setBackgroundMusicVolume: (volume: number) => void;
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('volume');
    return saved ? parseInt(saved, 10) : 50
  });

  const [backgroundMusicVolume, setBackgroundMusicVolumeState] = useState(() => {
    const saved = localStorage.getItem('backgroundMusicVolume');
    return saved ? parseInt(saved, 10) : 0
  });

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize and start background music
  useEffect(() => {
    bgmRef.current = new Audio("/bgm.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = backgroundMusicVolume / 100;

    // Try to play immediately on load
    const playBGM = async () => {
      if (bgmRef.current) {
        try {
          await bgmRef.current.play();
        } catch (error) {
          // Autoplay was blocked, will try on user interaction
          console.log("Autoplay blocked, will start on user interaction");
        }
      }
    };

    // Try to play immediately
    playBGM();

    // Fallback: Start on first user interaction if autoplay was blocked
    const handleUserInteraction = async () => {
      if (bgmRef.current && bgmRef.current.paused) {
        try {
          await bgmRef.current.play();
        } catch (error) {
          // Ignore errors
        }
      }
      // Remove listeners after first successful play
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add listeners for fallback
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('backgroundMusicVolume', backgroundMusicVolume.toString());
  }, [backgroundMusicVolume]);

  // Apply background music volume from settings
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = backgroundMusicVolume / 100;
    }
  }, [backgroundMusicVolume]);

  const setVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    setVolumeState(clamped);
  };

  const setBackgroundMusicVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    setBackgroundMusicVolumeState(clamped);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        // Check if the error is about provider not being enabled
        if (error.message?.includes('provider is not enabled') || 
            error.message?.includes('validation_failed') ||
            error.status === 400) {
          // Extract project ref from URL
          const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'wtmbscadypctstzhzmvr';
          const dashboardUrl = `https://supabase.com/dashboard/project/${projectRef}/auth/providers`;
          const message = 
            'Google OAuth provider is not enabled in your Supabase project.\n\n' +
            'To fix this:\n\n' +
            '1. Open this link: ' + dashboardUrl + '\n' +
            '2. Find "Google" in the providers list\n' +
            '3. Toggle it ON\n' +
            '4. Add your Google OAuth credentials (Client ID & Secret)\n' +
            '5. Set Redirect URL to: ' + window.location.origin + '\n\n' +
            'Need Google OAuth credentials?\n' +
            'Go to: https://console.cloud.google.com/apis/credentials';
          
          if (confirm(message + '\n\nClick OK to open the Supabase dashboard.')) {
            window.open(dashboardUrl, '_blank');
          }
          return;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in with Google: ' + (error?.message || 'Unknown error'));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        volume,
        backgroundMusicVolume,
        setVolume,
        setBackgroundMusicVolume,
        user,
        session,
        signInWithGoogle,
        signOut,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
