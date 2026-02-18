import React, { useRef, useState, useEffect } from "react";
import { Box, Fab, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type Props = {
  audioPath: string;
  volume: number; // 0-100
};

export default function AudioFab({ audioPath, volume }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100

  // volume反映
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(100, volume)) / 100;
    }
  }, [volume]);

  // progress更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const ended = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  const handleClick = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  if (!audioPath) return null;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <audio ref={audioRef}>
        <source src={`${apiUrl}/static/${audioPath}`} type="audio/wav" />
      </audio>

      {/* 外周Progress */}
      <CircularProgress
        variant="determinate"
        value={progress}
        size={68}
        thickness={2}
        sx={{
          position: "absolute",
          top: -6,
          left: -6,
          zIndex: 1,
        }}
      />

      {/* 中央ボタン */}
      <Fab color="primary" onClick={handleClick}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </Fab>
    </Box>
  );
}
