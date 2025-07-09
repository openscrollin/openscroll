import React, { useRef, useState } from "react";

function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={togglePlay} style={{ fontSize: "1.2rem" }}>
          {playing ? "⏸ Pause" : "▶️ Play"}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
