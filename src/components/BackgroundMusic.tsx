import { useRef, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { backgroundMusicVolume } = useSettings();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set volume immediately
      audio.volume = backgroundMusicVolume / 100;

      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.log("Autoplay blocked, waiting for interaction");
          // Autoplay diblokir, tunggu user interaction
          const handleInteraction = () => {
            // Re-query volume just in case, though the ref effects handle updates
            audio
              .play()
              .then(() => {
                window.removeEventListener("click", handleInteraction);
                window.removeEventListener("touchstart", handleInteraction);
                window.removeEventListener("keydown", handleInteraction);
              })
              .catch((e) => console.error("Play failed after interaction:", e));
          };
          window.addEventListener("click", handleInteraction, { once: true });
          window.addEventListener("touchstart", handleInteraction, {
            once: true,
          });
          window.addEventListener("keydown", handleInteraction, { once: true });
        }
      };
      playAudio();
    }
  }, []); // Run on mount only for play logic

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = backgroundMusicVolume / 100;
    }
  }, [backgroundMusicVolume]);

  return <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />;
};

export default BackgroundMusic;
